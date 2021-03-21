import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, Grid, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import {LoaderSpinner} from '../components/LoaderSpinner';
import { Invoice } from '../types/invoice';
import { loadInvoices } from './actions';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { User } from '../components/users/types';
import { RootState } from '../types/root-state';


interface InvoicePageDispatchProps {
    actions: {
      loadInvoices: (pageRequest: PageRequest) => void
    };
  }


interface InvoicePageStateProps {
    user: User,
    invoices: PageResponse<Invoice>
}

type Props = InvoicePageStateProps & InvoicePageDispatchProps;

const InvoicePageComp: React.FC<Props> = (props) => {
    const {user, invoices, actions} = props;

    const pageRequest: PageRequest = {
        PageNumber: 1,
        PageSize: 10,
    };

    useEffect(() => {
        actions.loadInvoices(pageRequest);
    }, [])

    
    const renderInvoices = () => {
        if (!invoices || invoices.data.length === 0) return null;

        const invoiceList = invoices.data.map((inv) => {
            return (
                <Table.Row key={inv.invoiceId}>
                    <Table.Cell>{inv.invoiceNo}</Table.Cell>
                    <Table.Cell>{moment(inv.invoiceDateTime).format('DD/MM/YYYY')}</Table.Cell>
                    <Table.Cell>{inv.car != null ? inv.car.plateNo : ''}</Table.Cell>
                    <Table.Cell>{inv.fullName}</Table.Cell>
                    <Table.Cell>{inv.phone}</Table.Cell>
                    <Table.Cell>
                        <Button basic icon='pencil' as={Link} to={`/invoice/edit/${inv.invoiceId}`} title={'Edit Invoice'} />
                    </Table.Cell>
                </Table.Row>
            );
        });
    
        return invoiceList;
    };
    
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
                <Button type='button' primary as={Link} to='/invoice/new'>
                    Create Invoice
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
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
                        <Table.Body>{invoices != null && renderInvoices()}</Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={4}>{renderFilterForm()}</Grid.Column>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state: RootState): InvoicePageStateProps => {
    return {
        user: state.user,
        invoices: state.invoiceState.invoices
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoicePageDispatchProps => ({
    actions: {
        loadInvoices: bindActionCreators(loadInvoices, dispatch)
    }
});

export const InvoicePage = connect(mapStateToProps, mapDispatchToProps )(InvoicePageComp);
