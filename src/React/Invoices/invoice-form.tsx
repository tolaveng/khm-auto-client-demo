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
import { Invoice } from '../types/invoice';
import { Service } from '../types/service';
import normalizePhone from '../utils/normalize-phone';
import { ServiceIndex } from '../types/service-index';

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

export interface InvoiceFormProps {
    invoiceDate: string,
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
    paymentMethod: string,
    subTotal: string,
    gstTotal: string,
    grandTotal: string,
}

interface IProps {
    invoice: Invoice,
    onServiceChange: (services: Service[]) => void;
    onSaveInvoice: (formData: InvoiceFormProps, serviceData: Service[], isPrint: boolean) => Promise<void>;
    serviceIndices: ServiceIndex[];
    isLoadFailed?: boolean;
}

export const INVOICE_FORM = 'INVOICE_FORM';

const InvoiceFormComp: React.FC<InjectedFormProps<InvoiceFormProps, IProps> & IProps> = (props) => {
    const { handleSubmit, pristine, submitting, onServiceChange, invoice, onSaveInvoice, valid, serviceIndices, isLoadFailed } = props;
    const [serviceData, setServiceData] = useState(invoice.services ?? []);

    serviceTableColumns[0].autoCompletData = serviceIndices.map(ser => ser.serviceName);

    useEffect(() => {
        setServiceData(invoice.services);
    }, [invoice]);

    useEffect(() => {
        onServiceChange(serviceData);
    }, [serviceData])

    // --- Service ---
    const addService = (row: TableEditorDataRow) => {
        setServiceData([
            ...serviceData,
            {
                serviceId: row.id ?? 0,
                serviceName: row.cells![0],
                servicePrice: row.cells![1],
                serviceQty: row.cells![2],
                invoiceId: invoice ? invoice.invoiceId : 0,
            },
        ]);
    };

    const updateService = (row: TableEditorDataRow) => {
        const newServices = [...serviceData];
        const updateService = newServices.find((sv) => sv.serviceId == row.id);
        if (updateService) {
            updateService.serviceName = row.cells![0];
            updateService.servicePrice = row.cells![1];
            updateService.serviceQty = row.cells![2];
        }
        setServiceData(newServices);
    };

    const deleteService = (rowId: number) => {
        const newServices = serviceData.filter((sv) => sv.serviceId !== rowId);
        setServiceData(newServices);
    };
    // --- end service ---


    const formSubmit = (formData: InvoiceFormProps, isPrint: boolean) => {
        if (valid) {
            return onSaveInvoice(formData, serviceData, isPrint);
        }
    }


    return (
        <Form autoComplete='none'>
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
                    <Field label='Reg. No' name='carNo' component={TextInput} type='text' icon='search' fluid={true} />
                    <Field label='ODO' name='odo' type='number' component={TextInput} fluid={true} />
                    <Field label='Year' name='year' component={TextInput} type='text' fluid={true} maxLength={4} max={9999} />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Field label='Make' name='make' component={TextInput} type='text' fluid={true} />
                    <Field label='Model' name='model' component={TextInput} type='text' fluid={true} />
                </Form.Group>
            </fieldset>
            <fieldset style={{ minHeight: 200 }}>
                <legend>Services</legend>
                <TableEditor
                    columns={serviceTableColumns}
                    rows={mapServiceToTableEditorDataRow(serviceData)}
                    onRowAdded={addService}
                    onRowUpdated={updateService}
                    onRowDeleted={deleteService}
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
                        label='Total (ex.GST)'
                        name='subTotal'
                        type='text'
                        component={TextInput}
                        inline
                        readOnly
                        styles={{ textAlign: 'right' }}
                    />
                    <Field label='GST' name='gstTotal' type='text' component={TextInput} inline readOnly styles={{ textAlign: 'right' }} />
                    <Field
                        label='Total (in.GST)'
                        name='grandTotal'
                        type='text'
                        component={TextInput}
                        inline
                        readOnly
                        styles={{ textAlign: 'right', fontWeight: 'bold' }}
                    />
                </Grid.Column>
            </Grid>
            <div style={{ textAlign: 'right' }}>
                <Button primary className='action-button' type='button' onClick={handleSubmit(val => formSubmit(val, true))} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                    <Icon name='print' />
                    Print
                </Button>
                <Button basic color='blue' className='action-button' type='button' onClick={handleSubmit(val => formSubmit(val, false))} disabled={submitting || isLoadFailed} loading={submitting} icon labelPosition='left'>
                    <Icon name='save' />
                    Save
                </Button>
                <Button basic color='blue' className='action-button' type='button' as={Link} to='/invoice' icon labelPosition='left'>
                    <Icon name='cancel' />
                    Close
                </Button>
            </div>
        </Form>
    );
};

const validate = (values: any) => {
    const errors: any = {}
    const requiredFields = ['invoiceDate', 'carNo', 'paymentMethod']
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

    return errors
}

// const mapStateToProps = (state: RootState) => {
//     const { invoice } = state.invoiceState;
//     return {
//         initialValues: {
//             invoiceDate: invoice.invoiceDateTime,
//             fullName: invoice.fullName,
//             phoneNumber: invoice.phone,
//             email: invoice.email,
//             company: invoice.company,
//             abn: invoice.abn,
//             address: invoice.address,
//             plateNo: invoice.car?.plateNo,
//             odo: invoice.car?.odo,
//             make: invoice.car?.carMake,
//             model: invoice.car?.carModel,
//             year: invoice.car?.carYear,
//             note: invoice.note,
//             paymentMethod: invoice.paymentMethod.toString(),
//         },
//         services: invoice.services
//     }
// }


// const InvoiceFormFx = reduxForm<InvoiceForm, IProps>({
//     validate,
//     form: INVOICE_FORM,
//     enableReinitialize: false,
// })(InvoiceFormComp);

// export const InvoiceForm = connect(mapStateToProps)(InvoiceFormFx);


export const InvoiceForm = reduxForm<InvoiceFormProps, IProps>({
    validate,
    form: INVOICE_FORM,
    enableReinitialize: true,
})(InvoiceFormComp);

