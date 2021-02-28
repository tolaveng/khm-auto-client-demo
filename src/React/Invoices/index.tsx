import { observer, PropTypes } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container, Form, Grid, Icon, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';
import Loading from '../components/loading';
import { useStore } from '../stores';
import { Invoice } from '../stores/types/invoice';


const InvoicePage: React.FC = (props) => {
    const {invoiceStore} = useStore();
    const history = useHistory();

    const pageRequest: PageRequest = {
        PageNumber: 1,
        PageSize: 10,
    };

    useEffect(() => {
        invoiceStore.fetchInvoices(pageRequest);
    }, [invoiceStore]);


    const renderInvoices = () => {
        if (!invoiceStore.invoices || invoiceStore.invoices.length === 0) return null;

        var invoiceList = invoiceStore.invoices.map((inv) => {
            return (
                <Table.Row key={inv.invoiceId}>
                    <Table.Cell>{inv.invoiceNo}</Table.Cell>
                    <Table.Cell>{moment(inv.invoiceDateTime).format('DD/MM/YYYY')}</Table.Cell>
                    <Table.Cell>{inv.car != null ? inv.car.plateNo : ''}</Table.Cell>
                    <Table.Cell>{inv.customer != null ? inv.customer.fullName : ''}</Table.Cell>
                    <Table.Cell>{inv.customer != null ? inv.customer.phone : ''}</Table.Cell>
                    <Table.Cell>
                        <Button basic icon='pencil' onClick={() => goToEditInvoice(inv.invoiceId)} title={'Edit Invoice'} />
                    </Table.Cell>
                </Table.Row>
            );
        });
    
        return invoiceList;
    };
    
    const goToEditInvoice = (invoiceId: number) => {
        history.push(`/invoice-edit?id:${invoiceId}`);
    }

    const renderFilterForm = () => {
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
                    <input placeholder='name or phone' />
                </Form.Field>
                <Form.Field>
                    <label>Date</label>
                    <ReactDatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={invoiceDate}
                        onChange={(date) => setInvoiceDate(date as Date)}
                    />
                </Form.Field>
                <Button type='button' basic color='blue'>
                    Filter
                </Button>
            </Form>
        );
    };

    return (
        <Container fluid>
            <HeaderLine label='Invoices'>
                <Button type='button' primary as={Link} to='invoice/invoice-edit'>
                    Create Invoice
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    {invoiceStore.isLoading && <Loading />}
                    <Table celled selectable striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell collapsing>No</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Date</Table.HeaderCell>
                                <Table.HeaderCell>Plate No</Table.HeaderCell>
                                <Table.HeaderCell>Customer</Table.HeaderCell>
                                <Table.HeaderCell>Phone</Table.HeaderCell>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{invoiceStore.invoices != null && renderInvoices()}</Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={4}>{renderFilterForm()}</Grid.Column>
            </Grid>
        </Container>
    );
};

export default observer(InvoicePage);
