import moment from 'moment';
import React from 'react';
import { Button, Container, Form, Grid, Icon, List, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';
import { Invoice } from '../models/invoice';
import { getToDay } from '../utils/helper';

const generateInvoices = () => {
    const invoices: Invoice[] = [
        {
            invoiceId: 1,
            invoiceNo: 1,
            invoiceDateTime: new Date(),
            modifiedDateTime: new Date(),
            isPaid: false,
            paidDate: new Date(),
            paymentMethod: 1,
            gst: 10,
            note: 'test note',
            odo: 1111,
            carId: 1,
            customerId: 1,
            userId: 1,
            archived: false,
        },
        {
            invoiceId: 22222,
            invoiceNo: 2,
            invoiceDateTime: new Date(),
            modifiedDateTime: new Date(),
            isPaid: false,
            paidDate: new Date(),
            paymentMethod: 1,
            gst: 10,
            note: 'test note',
            odo: 22222,
            carId: 1,
            customerId: 1,
            userId: 1,
            archived: false,
        },
        {
            invoiceId: 333333,
            invoiceNo: 4,
            invoiceDateTime: new Date(),
            modifiedDateTime: new Date(),
            isPaid: false,
            paidDate: new Date(),
            paymentMethod: 1,
            gst: 10,
            note: 'test note',
            odo: 3333,
            carId: 1,
            customerId: 1,
            userId: 1,
            archived: false,
        },
    ];

    var invoiceList = invoices.map((inv) => {
        return (
            <Table.Row key={inv.invoiceId}>
                <Table.Cell collapsing>{inv.invoiceNo}</Table.Cell>
                <Table.Cell collapsing>{moment(inv.invoiceDateTime).format('DD/MM/YYYY')}</Table.Cell>
                <Table.Cell>{inv.carId}</Table.Cell>
                <Table.Cell>{inv.customerId}</Table.Cell>
                <Table.Cell>{inv.customerId}</Table.Cell>
                <Table.Cell collapsing>
                    <Icon name="pencil" />
                </Table.Cell>
            </Table.Row>
        );
    });

    return invoiceList;
};

const generateFilterForm = () => {
    return (
        <Form>
            <Form.Field>
                <label>Invoice No</label>
                <input />
            </Form.Field>
            <Form.Field>
                <label>Plate No</label>
                <input />
            </Form.Field>
            <Form.Field>
                <label>Customer</label>
                <input placeholder="name or phone" />
            </Form.Field>
            <Form.Field>
                <label>Date</label>
                <input type="date" placeholder="invoice date" defaultValue={getToDay()} />
            </Form.Field>
            <Button type="submit">Filter</Button>
        </Form>
    );
};

const InvoiceComp: React.FC = () => {
    return (
        <Container fluid>
            <HeaderLine label='Invoices'>
                <Button type='button' primary>
                    Create Invoice
                </Button>
            </HeaderLine>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={12}>
                        <Table celled selectable striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No</Table.HeaderCell>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Plate No</Table.HeaderCell>
                                    <Table.HeaderCell>Customer</Table.HeaderCell>
                                    <Table.HeaderCell>Phone</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>{generateInvoices()}</Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={4}>{generateFilterForm()}</Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default InvoiceComp;
