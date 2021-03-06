import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Container, Form, Grid, Radio } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import Loading from '../components/loading';
import { TableEditor } from '../components/table-editor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { useStore } from '../stores';
import { PaymentMethod } from '../stores/PaymentMethod';

import TextInput from '../components/form/TextInput';
import RadioInput from '../components/form/RadioInput';
import TextAreaInput from '../components/form/TextAreaInput';
import DatePickerInput from '../components/form/DatePickerInput';


const InvoiceEditComp: React.FC<RouteComponentProps<RequestId>> = (props) => {
    const { invoiceStore } = useStore();
    const history = useHistory();
    const location = useLocation();
    const param = useParams();

    const invoiceId = Number(props.match.params.id) ?? 0;

    const [serviceStore, setServiceStore] = useState<TableEditorDataRow[]>([]);

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

    function addService(row: TableEditorDataRow) {
        console.log('add service');
        //invoiceStore.addService(row.id!, row.cells!);
        setServiceStore([...serviceStore, row]);
    }

    function updateService(row: TableEditorDataRow) {
        invoiceStore.updateService(row.id!, row.cells!);
    }

    function deleteService(rowId: number) {
        invoiceStore.deleteService(rowId);
    }

    function saveInvoice(value: any) {
        console.log(value);
    }

    useEffect(() => {
        (async () => {
            if (invoiceId && invoiceId !== 0) {
                await invoiceStore.loadInvoice(invoiceId);
            }
        })();
    }, [invoiceStore]);

    function renderInputForm({ handleSubmit, values, form, pristine, submitting }: FormRenderProps) {
        console.log(values.getServiceData);
        const {
            invoice,
            setPaymentMethod,
            setInvoiceDate,
            grandTotal,
            gstTotal,
            subTotal,
            getServiceData,
        } = invoiceStore;
        const invoiceDate = moment(invoice.invoiceDateTime).format('DD/MM/YYYY');
        const isPaidByCash = invoice.paymentMethod === PaymentMethod.Cash;
        const isPaidByCard = invoice.paymentMethod === PaymentMethod.Card;
        const isUnPaid = !isPaidByCard && !isPaidByCash;
        const test = serviceStore.map(sv => {
            return sv.cells![1] * sv.cells![2];
        })
        const total = test.reduce(((a, v) => a + v), 0);
        console.log('test', total);
        console.log('total', total);
        return (
            <Form onSubmit={handleSubmit} autoComplete='none'>
                <fieldset>
                    <Form.Group widths='equal'>
                        <Field
                            label='Invoice Date'
                            name='txtInvoiceDate'
                            component={DatePickerInput}
                            value={invoiceDate}
                        />
                        <Form.Field />
                        <Form.Field />
                    </Form.Group>
                </fieldset>

                <fieldset>
                    <legend>Customer</legend>
                    <Form.Group widths='equal'>
                        <Field
                            label='Full Name'
                            name='txtFullName'
                            component={TextInput}
                            value={invoice.customer?.fullName}
                            icon='search'
                            fluid
                            autoComplete='off'
                            onIconClick={() => {
                                console.log('customer search');
                            }}
                        />

                        <Field
                            label='Phone number'
                            name='txtPhoneNumber'
                            component={TextInput}
                            value={invoice.customer?.phone}
                            fluid
                            autoComplete='off'
                            error={'test error'}
                        />
                        <Field
                            label='Email'
                            name='txtEmail'
                            component={TextInput}
                            value={invoice.customer?.email}
                            fluid
                            autoComplete='off'
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Field
                            label='Company'
                            name='txtCompany'
                            component={TextInput}
                            value={invoice.customer?.company}
                            fluid
                        />
                        <Field label='ABN' name='txtABN' component={TextInput} value={invoice.customer?.abn} fluid />
                    </Form.Group>
                    <Field
                        label='Address'
                        name='txtAddress'
                        component={TextInput}
                        value={invoice.customer?.address}
                        fluid
                    />
                </fieldset>
                <fieldset>
                    <legend>Car</legend>
                    <Form.Group widths='equal'>
                        <Field
                            label='Reg. No'
                            name='txtPlateNo'
                            component={TextInput}
                            value={invoice.car?.plateNo}
                            icon='search'
                            fluid
                        />
                        <Field
                            label='ODO'
                            name='txtODO'
                            type='number'
                            component={TextInput}
                            value={invoice.odo}
                            fluid
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Field label='Make' name='txtMake' component={TextInput} value={invoice.car?.carMake} fluid />
                        <Field
                            label='Model'
                            name='txtModel'
                            component={TextInput}
                            value={invoice.car?.carModel}
                            fluid
                        />
                        <Field
                            label='Year'
                            name='txtYear'
                            component={TextInput}
                            type='number'
                            value={invoice.car?.carYear}
                            fluid
                        />
                    </Form.Group>
                </fieldset>
                <fieldset style={{ minHeight: 200 }}>
                    <legend>Services</legend>
                    <TableEditor
                        columns={serviceTableColumns}
                        rows={serviceStore}
                        onRowAdded={addService}
                        onRowUpdated={updateService}
                        onRowDeleted={deleteService}
                    />
                </fieldset>

                <Grid columns='2'>
                    <Grid.Column>
                        <Field label='Note' name='txtNote' component={TextAreaInput} rows='3' />
                        <fieldset>
                            <legend>Payment</legend>
                            <Form.Group inline>
                                <Field
                                    label='Cash'
                                    name='paymentMethod'
                                    type='radio'
                                    component={RadioInput}
                                    value='cash'
                                    htmlFor='cash'
                                    checked={isPaidByCash}
                                />
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <Field
                                    label='Card'
                                    name='paymentMethod'
                                    type='radio'
                                    component={RadioInput}
                                    value='card'
                                    htmlFor='card'
                                    checked={isPaidByCard}
                                />
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <Field
                                    label='UnPaid'
                                    name='paymentMethod'
                                    type='radio'
                                    component={RadioInput}
                                    value='unpaid'
                                    htmlFor='unpaid'
                                    checked={isUnPaid}
                                />
                            </Form.Group>
                        </fieldset>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Field
                            label='Total (ex.GST)'
                            name='txtSubTotal'
                            type='number'
                            component={TextInput}
                            value={subTotal.toFixed(2)}
                            inline
                            style={{ textAlign: 'right' }}
                            readOnly
                        />
                        <Field
                            label='GST'
                            name='txtGST'
                            type='number'
                            component={TextInput}
                            value={total.toFixed(2)}
                            inline
                            style={{ textAlign: 'right' }}
                            readOnly
                        />
                        <Field
                            label='Total (in.GST)'
                            name='txtGrandTotal'
                            type='number'
                            component={TextInput}
                            value={grandTotal.toFixed(2)}
                            inline
                            style={{ textAlign: 'right', fontWeight: 'bold' }}
                            readOnly
                        />
                    </Grid.Column>
                </Grid>
                <div style={{ textAlign: 'right' }}>
                    <Button primary className='action-button'>
                        Print
                    </Button>
                    <Button basic color='blue' className='action-button' type='submit'>
                        Save
                    </Button>
                    <Button basic color='blue' className='action-button'>
                        Close
                    </Button>
                </div>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <FinalForm onSubmit={saveInvoice} render={renderInputForm} initialValues={invoiceStore}/>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        );
    }

    return (
        <Container fluid>
            <HeaderLine label={invoiceId ? 'Edit Invoice' : 'New Invoice'} />
            {invoiceStore.isLoading && <Loading />}
            {!invoiceStore.isLoading && renderForm()}
        </Container>
    );
};

export const InvoiceEditPage = observer(InvoiceEditComp);
