import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Container, Form, Grid } from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';
import Loading from '../components/loading';
import { TableEditor } from '../components/table-editor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';
import { useStore } from '../stores';
import { PaymentMethod } from '../stores/PaymentMethod';

const InvoiceEditComp: React.FC = (props) => {
    const { invoiceStore } = useStore();
    const history = useHistory();
    const location = useLocation();
    const param = useParams();
    const invoiceId = param.id ? param.id : 0;

    const serviceTableColumns: TableEditorDataColumn[] = [
        {
            name: 'Service Description',
            type: 'textarea',
            required: true
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

    function renderForm() {
        const {invoice, setPaymentMethod, setInvoiceDate, grandTotal, gstTotal, subTotal, getServiceData} = invoiceStore;
        const invoiceDate = moment(invoice.invoiceDateTime).format('DD/MM/YYYY');
        const isPaidByCash = invoice.paymentMethod === PaymentMethod.Cash;
        const isPaidByCard = invoice.paymentMethod === PaymentMethod.Card;
        const isUnPaid = !isPaidByCard && !isPaidByCash;
        
        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <Form autoComplete='none'>
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
                                <Form.Input
                                    fluid
                                    label='Full name'
                                    icon={{ name: 'search', circular: true, link: true }}
                                    autoComplete='off'
                                    value={invoice.customer?.fullName}
                                />
                                <Form.Input
                                    fluid
                                    label='Phone number'
                                    autoComplete='off'
                                    value={invoice.customer?.phone}
                                />
                                <Form.Input fluid label='Email' autoComplete='off' value={invoice.customer?.email} />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Company' value={invoice.customer?.company} />
                                <Form.Input fluid label='ABN' value={invoice.customer?.abn} />
                            </Form.Group>
                            <Form.Input fluid label='Address' value={invoice.customer?.address} />
                        </fieldset>
                        <fieldset>
                            <legend>Car</legend>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Reg. No'
                                    icon={{ name: 'search', circular: true, link: true }}
                                    value={invoice.car?.plateNo}
                                />
                                <Form.Input fluid label='ODO' type='number' value={invoice.odo} />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Make' value={invoice.car?.carMake} />
                                <Form.Input fluid label='Model' value={invoice.car?.carModel} />
                                <Form.Input fluid label='Year' type='number' value={invoice.car?.carYear} />
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
                                        <Form.Field>
                                            <input
                                                type='radio'
                                                id='paymentMethodCash'
                                                name='paymentmethod'
                                                value='cash'
                                                checked={isPaidByCash}
                                                onChange={() => setPaymentMethod(PaymentMethod.Cash)}
                                            />
                                            <label htmlFor='paymentMethodCash'>Cash</label>
                                        </Form.Field>
                                        <span>&nbsp; &nbsp; &nbsp;</span>
                                        <Form.Field>
                                            <input
                                                type='radio'
                                                id='paymentMethodCard'
                                                name='paymentmethod'
                                                value='card'
                                                checked={isPaidByCard}
                                                onChange={() => setPaymentMethod(PaymentMethod.Card)}
                                            />
                                            <label htmlFor='paymentMethodCard'>Card</label>
                                        </Form.Field>
                                        <span>&nbsp; &nbsp; &nbsp;</span>
                                        <Form.Field>
                                            <input
                                                type='radio'
                                                id='paymentMethodUnpaid'
                                                name='paymentmethod'
                                                value='notpay'
                                                checked={isUnPaid}
                                                onChange={() => setPaymentMethod(PaymentMethod.Unpaid)}
                                            />
                                            <label htmlFor='paymentMethodUnpaid'>UnPaid</label>
                                        </Form.Field>
                                    </Form.Group>
                                </fieldset>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                <Form.Field inline>
                                    <label>Total (ex. GST)</label>
                                    <input type='number' readOnly placeholder='0' style={{ textAlign: 'right' }} value={subTotal.toFixed(2)} />
                                </Form.Field>
                                <Form.Field inline>
                                    <label>GST</label>
                                    <input type='number' readOnly placeholder='0' style={{ textAlign: 'right' }} value={gstTotal.toFixed(2)}/>
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
