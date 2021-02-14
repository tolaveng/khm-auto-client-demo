import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { Button, Container, Dimmer, Form, Grid, Icon, Loader, Table } from 'semantic-ui-react';
import agent from '../api/agent';
import { HeaderLine } from '../components/header-line';
import { Invoice } from '../models/invoice';

const generateInvoices = (invoices: Invoice[]) => {
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
    const [invoiceDate, setInvoiceDate] = useState(new Date());
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
                <ReactDatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={invoiceDate}
                    onChange={(date) => setInvoiceDate(date as Date)}
                />
            </Form.Field>
            <Button type="button" basic color="blue">
                Filter
            </Button>
        </Form>
    );
};

const InvoicePage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const pageRequest = {
        PageNumber: 1,
        PageSize: 10,
    };

    useEffect(() => {
        agent.Invoices.listPaged(pageRequest).then((response) => {
            console.log('response',response);
            setInvoices(response.data);
            setLoading(false);
        });
    }, []);

    return (
        <Container fluid>
            <HeaderLine label="Invoices">
                <Button type="button" primary as={Link} to="invoice/invoice-edit">
                    Create Invoice
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed="very">
                <Grid.Column width={12}>
                    {loading && (
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                    )}
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
                        <Table.Body>{invoices != null && generateInvoices(invoices!)}</Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={4}>{generateFilterForm()}</Grid.Column>
            </Grid>
        </Container>
    );
};

export default InvoicePage;