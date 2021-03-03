import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { RouteComponentProps, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Container, Form, Grid, Radio } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import Loading from '../components/loading';
import { TableEditor } from '../components/table-editor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { useStore } from '../stores';
import { PaymentMethod } from '../stores/PaymentMethod';
import { Field, Form as FinalForm, FormRenderProps } from 'react-final-form';
import TextInput from '../components/form/TextInput';
import RadioInput from '../components/form/RadioInput';

const InvoiceEditComp: React.FC<RouteComponentProps<RequestId>> = (props) => {
    const { invoiceStore } = useStore();
    const history = useHistory();
    const location = useLocation();
    const param = useParams();

    const invoiceId = Number(props.match.params.id) ?? 0;

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
        invoiceStore.addService(row.id!, row.cells!);
    }

    function updateService(row: TableEditorDataRow) {
        invoiceStore.updateService(row.id!, row.cells!);
    }

    function deleteService(rowId: number) {
        invoiceStore.deleteService(rowId);
    }

    useEffect(() => {
        (async () => {
            if (invoiceId && invoiceId !== 0) {
                await invoiceStore.loadInvoice(invoiceId);
            }
        })();
    }, [invoiceStore]);

    function renderInputForm({ handleSubmit }: FormRenderProps) {
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
        return (
            <Form onSubmit={handleSubmit} autoComplete='none'>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Invoice Date</label>
                        <DatePicker
                            value={invoiceDate}
                            onChange={(date) => {
                                setInvoiceDate(date);
                            }}
                        />
                    </Form.Field>
                    <Form.Field />
                    <Form.Field />
                </Form.Group>
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
                        rows={getServiceData}
                        onRowAdded={addService}
                        onRowUpdated={updateService}
                        onRowDeleted={deleteService}
                    />
                </fieldset>

                <Grid columns='2'>
                    <Grid.Column>
                        <Form.TextArea label='Note' rows='3' />
                        <fieldset>
                            <legend>Payment</legend>
                            <Form.Group inline>
                                <Field
                                    label='Cash'
                                    name='paymentMethod'
                                    component={RadioInput}
                                    value='cash'
                                    htmlFor='cash'
                                    checked={isPaidByCash}
                                />
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <Field
                                    label='Card'
                                    name='paymentMethod'
                                    component={RadioInput}
                                    value='card'
                                    htmlFor='card'
                                    checked={isPaidByCard}
                                />
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <Field
                                    label='UnPaid'
                                    name='paymentMethod'
                                    component={RadioInput}
                                    value='unpaid'
                                    htmlFor='unpaid'
                                    checked={isUnPaid}
                                />
                            </Form.Group>
                        </fieldset>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Form.Field inline>
                            <label>Total (ex. GST)</label>
                            <input
                                type='number'
                                readOnly
                                placeholder='0'
                                style={{ textAlign: 'right' }}
                                value={subTotal.toFixed(2)}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>GST</label>
                            <input
                                type='number'
                                readOnly
                                placeholder='0'
                                style={{ textAlign: 'right' }}
                                value={gstTotal.toFixed(2)}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Total (in. GST)</label>
                            <input
                                type='number'
                                readOnly
                                placeholder='0'
                                style={{ textAlign: 'right', fontWeight: 'bold' }}
                                value={grandTotal.toFixed(2)}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid>
                <div style={{ textAlign: 'right' }}>
                    <Button primary className='action-button'>
                        Print
                    </Button>
                    <Button basic color='blue' className='action-button'>
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
                    <FinalForm onSubmit={() => {}} render={renderInputForm} />
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
