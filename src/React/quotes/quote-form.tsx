import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Icon } from 'semantic-ui-react';
import DatePickerInput from '../components/form/DatePickerInput';
import TextAreaInput from '../components/form/TextAreaInput';
import TextInput from '../components/form/TextInput';
import { TableEditor } from '../components/table-editor/TableEditor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { Quote } from '../types/quote';
import { Service } from '../types/service';
import { ServiceIndex } from '../types/service-index';
import AutoSuggestInput from '../components/form/AutoSuggestInput';
import { Field, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Car } from '../types/car';

const serviceTableColumns: TableEditorDataColumn[] = [
    {
        name: 'Service Description',
        type: 'textarea',
        required: true,
    },
    {
        name: 'Price',
        collapse: true,
        type: 'number',
        textAlign: 'right',
        required: true,
    },
    {
        name: 'Qty',
        collapse: true,
        type: 'number',
        textAlign: 'right',
        maxLength: 3,
        required: true,
        default: 1,
    },
    {
        name: 'Total',
        collapse: true,
        type: 'number',
        textAlign: 'right',
        readOnly: true,
    },
];

const mapServiceToTableEditorDataRow = (services: Service[]): TableEditorDataRow[] => {
    if (services.length == 0) return [];
    return services.map((sv) => ({
        id: sv.serviceId,
        cells: [sv.serviceName, sv.servicePrice, sv.serviceQty, (sv.servicePrice * sv.serviceQty)],
    }));
};

export interface QuoteFormProps {
    quoteDate: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    company: string,
    abn: string,
    address: string,
    carNo: string,
    odo: string,
    color: string,
    make: string,
    model: string,
    year: string,
    note: string,
    subTotal: string,
    discount: string,
    amountTotal: string,

    isPrintForm?: string
}

const validationSchema = Yup.object({
    carNo: Yup.string().required('Registration Number is required'),
})

interface IProps {
    initValues: QuoteFormProps,
    quote: Quote,
    onSaveQuote: (formData: QuoteFormProps, serviceData: Service[], isPrint: boolean) => Promise<void>;
    serviceIndices: ServiceIndex[];
    isLoadFailed?: boolean;
    carSearchHandler?: (value: string, callback: (car: Car) => void) => void;
    carMakes: string[];
    carModels: string[];
    onDeleteQuote: (quoteId: number) => void;
    onServiceNameChange: (value: string) => void;

    // set ref in parent
    setQuoteFormik: (formik: FormikProps<QuoteFormProps>) => void;
}

const calculateTotal = (services: Service[], quoteDiscount: number) => {
    let subTotal = 0;
    let amountTotal = 0;

    services.forEach((service) => {
        subTotal += Number(service.servicePrice) * Number(service.serviceQty);
    });

    amountTotal = subTotal - quoteDiscount;

    return {
        subTotal, amountTotal
    }
}

const QuoteFormComp: React.FC<IProps> = (props) => {
    const { initValues, quote, onSaveQuote, serviceIndices, isLoadFailed, carSearchHandler, carMakes, carModels,
        onDeleteQuote, setQuoteFormik, onServiceNameChange } = props;
    const [serviceData, setServiceData] = useState(quote.services ?? []);

    serviceTableColumns[0].autoCompletData = serviceIndices.map(ser => ser.serviceName);

    const carColors = ["Black", "Cyan", "Red", "Dark Red", "Orange", "Pink", "White", "Green", "Blue", "Light Blue", "Dark Blue", "Teal", "Sky Blue", "Khaki", "Lavender",
        "Yellow", "Light Yellow", "Purple", "Gold", "Silver", "Navy", "Peru", "Brown", "Violet", "Orchid", "Olive", "Magenta", "Indigo", "Slate Blue",
        "Chocolate", "Sienna", "Maroon", "Ivory", "Light Gray", "Gray", "Dark Gray", "Cacao", "Chaco", "Coral",
    ];

    useEffect(() => {
        setServiceData(quote.services);
    }, [quote]);

    const updateService = (row: TableEditorDataRow, formik: FormikProps<QuoteFormProps>) => {
        let exitingServieData = [...serviceData];
        if (row.isNew) {
            exitingServieData = exitingServieData.concat({
                serviceId: row.id ?? 0,
                serviceName: row.cells![0],
                servicePrice: row.cells![1],
                serviceQty: row.cells![2],
                quoteId: quote ? quote.quoteId : 0,
            }
            );
            setServiceData(exitingServieData);

        } else {
            const updatedService = exitingServieData.find((sv) => sv.serviceId == row.id);
            if (updatedService) {
                updatedService.serviceName = row.cells![0];
                updatedService.servicePrice = row.cells![1];
                updatedService.serviceQty = row.cells![2];
            }
            setServiceData(exitingServieData);
        }
        const discount = Number(formik.values.discount) ? Number(formik.values.discount) : 0;
        const total = calculateTotal(exitingServieData, discount);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('amountTotal', total.amountTotal.toFixed(2));
    };

    const deleteService = (rowId: number, formik: FormikProps<QuoteFormProps>) => {
        const newServices = serviceData.filter((sv) => sv.serviceId !== rowId);
        setServiceData(newServices);

        const discount = Number(formik.values.discount) ? Number(formik.values.discount) : 0;
        const total = calculateTotal(newServices, discount);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('amountTotal', total.amountTotal.toFixed(2));
    };

    const onDiscountChange = (value: string, formik: FormikProps<QuoteFormProps>) => {
        //const discount = Number(formik.values.discount) ? Number(formik.values.discount) : 0;
        const discount = Number(value) ? Number(value) : 0;
        const total = calculateTotal(serviceData, discount);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('amountTotal', total.amountTotal.toFixed(2));
    }

    const handleServiceChange = (rowId: number, columnId: number, value: string) => {
        if (columnId == 0 && value && value.length > 3 && value.length < 16) { // description
            if (onServiceNameChange) {
                onServiceNameChange(value)
            }
        }
    }

    // --- end service ---

    const handleCarSearchHandler = (value: string) => {
        if (carSearchHandler) {
            carSearchHandler(value, function (car: Car) {
                //ignored
            })
        }
    }

    const handleFormSubmit = (formValues: QuoteFormProps, formAction: any) => {
        onSaveQuote(formValues, serviceData, formValues.isPrintForm == 'true')
            .then(() => {
                if (formValues.isPrintForm == 'true') {
                    formAction.setSubmitting(false);
                }
            })
            .catch((err) => {
                toast.error(err);
                formAction.setSubmitting(false);
            });
    }

    const handleSaveForm = (formik: FormikProps<QuoteFormProps>) => {
        formik.setFieldValue('isPrintForm', 'false');
        if (!formik.values.carNo) {
            toast.error('Registration number is required.')
        }
        formik.submitForm();
    }

    const handlePrintForm = (formik: FormikProps<QuoteFormProps>) => {
        formik.setFieldValue('isPrintForm', 'true');
        if (!formik.values.carNo) {
            toast.error('Registration number is required.')
        }
        formik.submitForm();
    }


    const handleDelete = () => {
        if (quote && quote.quoteId) {
            onDeleteQuote(quote.quoteId);
        }
    }

    return (
        <Formik
            key={quote.quoteId}
            initialValues={initValues}
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
            enableReinitialize={false}  // using key cause React to create a new form
            innerRef={frm => frm && setQuoteFormik(frm)}
        >
            {
                (formik) => {
                    return (
                        <Form autoComplete='off' onSubmit={formik.handleSubmit}>
                            <fieldset>
                                <Form.Group widths='equal'>
                                    <Field label='Quote Date' name='quoteDate' component={DatePickerInput} type='text' defaultDate={new Date()} />
                                    <Form.Field />
                                    {quote.quoteId
                                        ? <Form.Field><label>Quote No</label><label style={{ padding: 4, border: '1px solid #cccccc', borderRadius: 2 }}>{quote.quoteId}</label></Form.Field>
                                        : <Form.Field />
                                    }

                                </Form.Group>
                            </fieldset>

                            <fieldset>
                                <legend>Customer</legend>
                                <Form.Group widths='equal'>
                                    <Field
                                        label='Full Name'
                                        name='fullName'
                                        component={TextInput}
                                        type='text'
                                        fluid={true}
                                        autoComplete='off'
                                    />

                                    <Field
                                        label='Phone number'
                                        name='phoneNumber'
                                        component={TextInput}
                                        type='text'
                                        fluid={true}
                                        autoComplete='off'
                                        error={'test error'}
                                    // normalize={normalizePhone}
                                    />
                                    <Field label='Email' name='email' component={TextInput} type='text' fluid={true} autoComplete='off' />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Field label='Company' name='company' component={TextInput} type='text' fluid={true} />
                                    <Field label='ABN' type='text' name='abn' component={TextInput} fluid={true} />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Field label='Address' name='address' component={TextInput} type='text' fluid={true} />
                                </Form.Group>
                            </fieldset>
                            <fieldset>
                                <legend>Car</legend>
                                <Form.Group widths='equal'>
                                    <Field label='Registration Number' name='carNo' component={TextInput} type='text' icon='search' fluid={true} onIconClick={handleCarSearchHandler} />
                                    <Field label='ODO' name='odo' type='number' component={TextInput} fluid={true} />
                                    <Field label='Year' name='year' component={TextInput} type='text' fluid={true} maxLength={4} max={9999} />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Field label='Color' name='color' component={AutoSuggestInput} type='text' fluid={true} options={carColors} />
                                    <Field label='Make' name='make' component={AutoSuggestInput} type='text' fluid={true} options={carMakes} />
                                    <Field label='Model' name='model' component={AutoSuggestInput} type='text' fluid={true} options={carModels} />
                                </Form.Group>
                            </fieldset>
                            <fieldset style={{ minHeight: 200 }}>
                                <legend>Services</legend>
                                <TableEditor
                                    columns={serviceTableColumns}
                                    rows={mapServiceToTableEditorDataRow(serviceData)}
                                    //onRowAdded={addService}
                                    onRowUpdated={(row) => updateService(row, formik)}
                                    onRowDeleted={(rowId) => deleteService(rowId, formik)}
                                    onChange={handleServiceChange}
                                />
                            </fieldset>

                            <Grid columns='2'>
                                <Grid.Column>
                                    <Field label='Note' name='note' type='text' component={TextAreaInput} rows='3' />
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                    <Field
                                        label='SubTotal'
                                        name='subTotal'
                                        type='text'
                                        component={TextInput}
                                        inline
                                        readOnly
                                        styles={{ textAlign: 'right', fontWeight: 'bold' }}
                                    />
                                    <Field
                                        label='Discount'
                                        name='discount'
                                        type='number'
                                        component={TextInput}
                                        inline
                                        styles={{ textAlign: 'right' }}
                                        onTextChange={(val: string) => onDiscountChange(val, formik)}
                                    />
                                    <Field
                                        label='Balance due'
                                        name='amountTotal'
                                        type='text'
                                        component={TextInput}
                                        inline
                                        readOnly
                                        styles={{ textAlign: 'right', fontWeight: 'bold' }}
                                    />
                                </Grid.Column>
                            </Grid>
                            <div>
                                <div style={{ textAlign: 'left', float: 'left' }}>
                                    {
                                        !!quote && !!quote.quoteId &&
                                        <Button basic color='red' className='action-button' type='button' onClick={handleDelete} disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'>
                                            <Icon name='trash' />
                                            <span>DELETE</span>
                                        </Button>
                                    }
                                </div>
                                <div style={{ textAlign: 'right', float: 'right' }}>
                                    {!!quote && !!quote.quoteId &&
                                        <Button color='green' className='action-button' type='button'
                                            as={Link} to={'/invoice/fromquote/' + quote.quoteId}
                                            disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'
                                        >
                                            <Icon name='file alternate' />
                                            <span>Make Invoice</span>
                                        </Button>
                                    }
                                    <Button primary className='action-button' type='button'
                                        disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'
                                        onClick={() => handlePrintForm(formik)}
                                    >
                                        <Icon name='print' />
                                        <span>Save & Print</span>
                                    </Button>
                                    <Button primary color='blue' className='action-button' type='button'
                                        disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'
                                        onClick={() => handleSaveForm(formik)}
                                    >
                                        <Icon name='save' />
                                        <span>Save & Close</span>
                                    </Button>
                                    <Button basic color='blue' className='action-button' type='button' as={Link} to='/quote' icon labelPosition='left'>
                                        <Icon name='cancel' />
                                        <span>Close</span>
                                    </Button>
                                </div>
                            </div>
                            <Field type='hidden' name='isPrintForm' value='false' />
                        </Form>
                    );
                }
            }
        </Formik>
    );
};



export const QuoteForm = QuoteFormComp;
