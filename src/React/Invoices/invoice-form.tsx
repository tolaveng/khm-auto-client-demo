import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Icon } from 'semantic-ui-react';
import DatePickerInput from '../components/form/DatePickerInput';
import RadioInput from '../components/form/RadioInput';
import TextAreaInput from '../components/form/TextAreaInput';
import TextInput from '../components/form/TextInput';
import { TableEditor } from '../components/table-editor/TableEditor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { PaymentMethod } from '../types/PaymentMethod';
import { Invoice } from '../types/invoice';
import { Service } from '../types/service';
import { ServiceIndex } from '../types/service-index';
import AutoSuggestInput from '../components/form/AutoSuggestInput';
import { Field, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { RoundToTwo } from '../utils/helper';
import { Car } from '../types/car';
import Colors from '../constants/colors';

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

export interface InvoiceFormProps {
    invoiceDate: string,
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
    paymentMethod: string,
    subTotal: string,
    discount: string,
    gstTotal: string,
    amountTotal: string,

    isPrintForm?: string
}

const validationSchema = Yup.object({
    carNo: Yup.string().required('Registration Number is required'),
})

interface IProps {
    initValues: InvoiceFormProps,
    invoice: Invoice,
    onSaveInvoice: (formData: InvoiceFormProps, serviceData: Service[], isPrint: boolean) => Promise<void>;
    serviceIndices: ServiceIndex[];
    isLoadFailed?: boolean;
    carSearchHandler?: (value: string, callback: (car: Car) => void) => void;
    carMakes: string[];
    carModels: string[];
    onDeleteInvoice: (invoiceId: number) => void;
    onServiceNameChange: (value: string) => void;

    // set ref in parent
    setInvoiceFormik: (formik: FormikProps<InvoiceFormProps>) => void;
}

const calculateTotal = (services: Service[], invoiceDiscount: number, invoiceGst: number) => {
    let subTotal = 0;
    let gstTotal = 0;
    let amountTotal = 0;

    services.forEach((service) => {
        subTotal += Number(service.servicePrice) * Number(service.serviceQty);
    });

    subTotal = subTotal - invoiceDiscount;
    gstTotal = RoundToTwo(subTotal * invoiceGst / 100);
    amountTotal = subTotal + gstTotal;

    return {
        subTotal, gstTotal, amountTotal
    }
}

const InvoiceFormComp: React.FC<IProps> = (props) => {
    const { initValues, invoice, onSaveInvoice, serviceIndices, isLoadFailed, carSearchHandler, carMakes, carModels,
        onDeleteInvoice, setInvoiceFormik, onServiceNameChange } = props;
    const [serviceData, setServiceData] = useState(invoice.services ?? []);

    serviceTableColumns[0].autoCompletData = serviceIndices.map(ser => ser.serviceName);

    useEffect(() => {
        setServiceData(invoice.services);
    }, [invoice]);

    const updateService = (row: TableEditorDataRow, formik: FormikProps<InvoiceFormProps>) => {
        let exitingServieData = [...serviceData];
        if (row.isNew) {
            exitingServieData = exitingServieData.concat({
                serviceId: row.id ?? 0,
                serviceName: row.cells![0],
                servicePrice: row.cells![1],
                serviceQty: row.cells![2],
                invoiceId: invoice ? invoice.invoiceId : 0,
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
        const total = calculateTotal(exitingServieData, discount, invoice.gst);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('gstTotal', total.gstTotal.toFixed(2));
        formik.setFieldValue('amountTotal', total.amountTotal.toFixed(2));
    };

    const deleteService = (rowId: number, formik: FormikProps<InvoiceFormProps>) => {
        const newServices = serviceData.filter((sv) => sv.serviceId !== rowId);
        setServiceData(newServices);

        const discount = Number(formik.values.discount) ? Number(formik.values.discount) : 0;
        const total = calculateTotal(newServices, discount, invoice.gst);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('gstTotal', total.gstTotal.toFixed(2));
        formik.setFieldValue('amountTotal', total.amountTotal.toFixed(2));
    };

    const onDiscountChange = (value: string, formik: FormikProps<InvoiceFormProps>) => {
        //const discount = Number(formik.values.discount) ? Number(formik.values.discount) : 0;
        const discount = Number(value) ? Number(value) : 0;
        const total = calculateTotal(serviceData, discount, invoice.gst);
        formik.setFieldValue('subTotal', total.subTotal.toFixed(2));
        formik.setFieldValue('gstTotal', total.gstTotal.toFixed(2));
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

    const handleFormSubmit = (formValues: InvoiceFormProps, formAction: any) => {
        onSaveInvoice(formValues, serviceData, formValues.isPrintForm == 'true')
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

    const handleSaveForm = (formik: FormikProps<InvoiceFormProps>) => {
        formik.setFieldValue('isPrintForm', 'false');
        if (!formik.values.carNo) {
            toast.error('Registration number is required.')
        }
        formik.submitForm();
    }

    const handlePrintForm = (formik: FormikProps<InvoiceFormProps>) => {
        formik.setFieldValue('isPrintForm', 'true');
        if (!formik.values.carNo) {
            toast.error('Registration number is required.')
        }
        formik.submitForm();
    }


    const handleDelete = () => {
        if (invoice && invoice.invoiceId) {
            onDeleteInvoice(invoice.invoiceId);
        }
    }

    const formKey = useRef(invoice.invoiceId ? invoice.invoiceId : Date.now()); // random key

    return (
        <Formik
            key={formKey.current}
            initialValues={initValues}
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
            enableReinitialize={false}  // using key cause React to create a new form
            innerRef={frm => frm && setInvoiceFormik(frm)}
        >
            {
                (formik) => {
                    return (
                        <Form autoComplete='off' onSubmit={formik.handleSubmit}>
                            <fieldset>
                                <Form.Group widths='equal'>
                                    <Field label='Invoice Date' name='invoiceDate' component={DatePickerInput} type='text' defaultDate={new Date()} />
                                    <Form.Field />
                                    {invoice.invoiceNo
                                        ? <Form.Field><label>Invoice No</label><label style={{ padding: 4, border: '1px solid #cccccc', borderRadius: 2 }}>{invoice.invoiceNo}</label></Form.Field>
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
                                    <Field label='Color' name='color' component={AutoSuggestInput} type='text' fluid={true} options={Colors.CarColors} useContains={true} />
                                    <Field label='Make' name='make' component={AutoSuggestInput} type='text' fluid={true} options={carMakes} useContains={true} />
                                    <Field label='Model' name='model' component={AutoSuggestInput} type='text' fluid={true} options={carModels} useContains={true} />
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
                                    <fieldset>
                                        <legend>Payment</legend>
                                        <Form.Group inline>
                                            <Field
                                                label='Cash'
                                                name='paymentMethod'
                                                type='radio'
                                                component={RadioInput}
                                                htmlFor='cash'
                                                value={PaymentMethod.Cash.toString()}
                                            />
                                            <span>&nbsp; &nbsp; &nbsp;</span>
                                            <Field
                                                label='Card'
                                                name='paymentMethod'
                                                type='radio'
                                                component={RadioInput}
                                                htmlFor='card'
                                                value={PaymentMethod.Card.toString()}
                                            />
                                            <span>&nbsp; &nbsp; &nbsp;</span>
                                            <Field
                                                label='UnPaid'
                                                name='paymentMethod'
                                                type='radio'
                                                component={RadioInput}
                                                htmlFor='unpaid'
                                                value={PaymentMethod.Unpaid.toString()}
                                            />
                                        </Form.Group>
                                    </fieldset>
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
                                    <Field label='GST' name='gstTotal' type='text' component={TextInput} inline readOnly styles={{ textAlign: 'right' }} />
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
                                        !!invoice && !!invoice.invoiceNo &&
                                        <Button basic color='red' className='action-button' type='button' onClick={handleDelete} disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'>
                                            <Icon name='trash' />
                                            <span>DELETE</span>
                                        </Button>
                                    }
                                </div>
                                <div style={{ textAlign: 'right', float: 'right' }}>
                                    {
                                        !!invoice && !!invoice.invoiceNo &&
                                        <Button color='green' className='action-button' type='button'
                                            as={Link} to={'/invoice/copy/' + invoice.invoiceId}
                                            disabled={formik.isSubmitting || isLoadFailed} loading={formik.isSubmitting} icon labelPosition='left'
                                        >
                                            <Icon name='copy' />
                                            <span>Copy Invoice</span>
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
                                    <Button basic color='blue' className='action-button' type='button' as={Link} to='/invoice' icon labelPosition='left'>
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



export const InvoiceForm = InvoiceFormComp;

