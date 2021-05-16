import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Grid, Button, Form, Icon } from 'semantic-ui-react';
import DatePickerInput from '../components/form/DatePickerInput';
import RadioInput from '../components/form/RadioInput';
import TextAreaInput from '../components/form/TextAreaInput';
import TextInput from '../components/form/TextInput';
import { TableEditor } from '../components/table-editor/TableEditor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { PaymentMethod } from '../types/PaymentMethod';
import { Service } from '../types/service';
import normalizePhone from '../utils/normalize-phone';
import { ServiceIndex } from '../types/service-index';
import AutoSuggestInput from '../components/form/AutoSuggestInput';
import { Quote } from '../types/quote';

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
        maxLength: 2,
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
    odo: number,
    make: string,
    model: string,
    year: number,
    note: string,
    subTotal: string,
    discount: string,
    amountTotal: string,
}

interface IProps {
    quote: Quote,
    onServiceChange: (services: Service[]) => void;
    onSaveQuote: (formData: QuoteFormProps, serviceData: Service[], isPrint: boolean) => Promise<void>;
    serviceIndices: ServiceIndex[];
    isLoadFailed?: boolean;
    carSearchHandler?: (value: string) => void;
    carMakes: string[];
    carModels: string[];
    onDeleteQuote: (quoteId: number) => void;
    makeInvoiceFromQuote: (quoteId: number) => void;
}

export const QUOTE_FORM = 'QUOTE_FORM';

const QuoteFormComp: React.FC<InjectedFormProps<QuoteFormProps, IProps> & IProps> = (props) => {
    const { handleSubmit, pristine, submitting, onServiceChange, quote, onSaveQuote, valid, serviceIndices, isLoadFailed,
         carSearchHandler, carMakes, carModels, onDeleteQuote, makeInvoiceFromQuote } = props;
    const [serviceData, setServiceData] = useState(quote.services ?? []);

    serviceTableColumns[0].autoCompletData = serviceIndices.map(ser => ser.serviceName);

    useEffect(() => {
        setServiceData(quote.services);
    }, [quote]);

    useEffect(() => {
        onServiceChange(serviceData);
    }, [serviceData])


    const updateService = (row: TableEditorDataRow) => {

        if (row.isNew) {
            setServiceData([
                ...serviceData,
                {
                    serviceId: row.id ?? 0,
                    serviceName: row.cells?.[0],
                    servicePrice: row.cells?.[1],
                    serviceQty: row.cells?.[2],
                    invoiceId: quote ? quote.quoteId : 0,
                },
            ]);
        } else {
            const newServices = [...serviceData];
            const updateService = newServices.find((sv) => sv.serviceId == row.id);
            if (updateService) {
                updateService.serviceName = row.cells![0];
                updateService.servicePrice = row.cells![1];
                updateService.serviceQty = row.cells![2];
            }
            setServiceData(newServices);
        }
    };

    const deleteService = (rowId: number) => {
        const newServices = serviceData.filter((sv) => sv.serviceId !== rowId);
        setServiceData(newServices);
    };
    // --- end service ---

    const formSubmit = (formData: QuoteFormProps, isPrint: boolean) => {
        if (valid) {
            return onSaveQuote(formData, serviceData, isPrint);
        }
    }


    const handleDelete = () => {
        if (quote && quote.quoteId) {
            onDeleteQuote(quote.quoteId);
        }
    }

    const handleMakeInvoiceFromQuote = () => {
        if (quote && quote.quoteId) {
            makeInvoiceFromQuote(quote.quoteId);
        }
    }

    return (
        <Form autoComplete='off'>
            <fieldset>
                <Form.Group widths='equal'>
                    <Field label='Quote Date' name='quoteDate' component={DatePickerInput} type='text' defaultDate={new Date()} />
                    <Form.Field />
                    {(quote.quoteId && quote.quoteId > 0)
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
                        normalize={normalizePhone}
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
                    <Field label='Reg. No' name='carNo' component={TextInput} type='text' icon='search' fluid={true} onIconClick={carSearchHandler} />
                    <Field label='ODO' name='odo' type='number' component={TextInput} fluid={true} />
                    <Field label='Year' name='year' component={TextInput} type='text' fluid={true} maxLength={4} max={9999} />
                </Form.Group>
                <Form.Group widths='equal'>
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
                    onRowUpdated={updateService}
                    onRowDeleted={deleteService}
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
                        type='text'
                        component={TextInput}
                        inline
                        styles={{ textAlign: 'right' }}
                    />
                    <Field
                        label='Total (in.gst)'
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
                        (!!quote && !!quote.quoteId && quote.quoteId > 0) &&
                        <Button basic color='red' className='action-button' type='button' onClick={handleDelete} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                            <Icon name='trash' />
                            <span>DELETE</span>
                        </Button>
                    }
                </div>
                <div style={{ textAlign: 'right', float: 'right' }}>
                    {
                        (!!quote && !!quote.quoteId && quote.quoteId > 0) &&
                        <Button color='green' className='action-button' type='button' onClick={handleMakeInvoiceFromQuote} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                            <Icon name='file alternate outline' />
                            <span>Create New Invoice</span>
                        </Button>
                    }
                    <Button primary className='action-button' type='button' onClick={handleSubmit(val => formSubmit(val, true))} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                        <Icon name='print' />
                        <span>Print</span>
                    </Button>
                    <Button basic color='blue' className='action-button' type='button' onClick={handleSubmit(val => formSubmit(val, false))} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                        <Icon name='save' />
                        <span>Save</span>
                    </Button>
                    <Button basic color='blue' className='action-button' type='button' as={Link} to='/quote' icon labelPosition='left'>
                        <Icon name='cancel' />
                        <span>Close</span>
                    </Button>
                </div>
            </div>
        </Form>
    );
};

const validate = (values: any) => {
    const errors: any = {}
    const requiredFields = ['quoteDate', 'carNo', 'paymentMethod']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }

    // if (!values.fullName && !values.phoneNumber) {
    //     errors.fullName = 'Customer name or phone number is required';
    //     errors.phoneNumber = 'Customer name or phone number is required';
    // }

    if (isNaN(Number(values.discount))) {
        errors.discount = 'Number Only'
    }

    return errors
}

// const mapStateToProps = (state: RootState) => {
//     const { quote } = state.quoteState;
//     return {
//         initialValues: {
//             quoteDate: quote.quoteDateTime,
//             fullName: quote.fullName,
//             phoneNumber: quote.phone,
//             email: quote.email,
//             company: quote.company,
//             abn: quote.abn,
//             address: quote.address,
//             plateNo: quote.car?.plateNo,
//             odo: quote.car?.odo,
//             make: quote.car?.carMake,
//             model: quote.car?.carModel,
//             year: quote.car?.carYear,
//             note: quote.note,
//             paymentMethod: quote.paymentMethod.toString(),
//         },
//         services: quote.services
//     }
// }


// const QuoteFormFx = reduxForm<QuoteForm, IProps>({
//     validate,
//     form: QUOTE_FORM,
//     enableReinitialize: false,
// })(QuoteFormComp);

// export const QuoteForm = connect(mapStateToProps)(QuoteFormFx);


export const QuoteForm = reduxForm<QuoteFormProps, IProps>({
    validate,
    form: QUOTE_FORM,
    enableReinitialize: true, //update when the initial value update
    keepDirtyOnReinitialize: true    // reinit the value, it keeps edited value
})(QuoteFormComp);

