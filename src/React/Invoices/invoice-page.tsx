import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, Grid, Icon, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { Invoice } from '../types/invoice';
import { loadInvoices } from './actions';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { User } from '../components/users/types';
import { RootState } from '../types/root-state';
import { InvoiceFilter } from '../types/invoice-filter';


interface InvoicePageDispatchProps {
    actions: {
        loadInvoices: (pageRequest: PageRequest, filter?: InvoiceFilter) => void
    };
}


interface InvoicePageStateProps {
    user: User,
    invoices: PageResponse<Invoice>
}

type Props = InvoicePageStateProps & InvoicePageDispatchProps;

const InvoicePageComp: React.FC<Props> = (props) => {
    const { user, invoices, actions } = props;

    const [pageRequest, setPageRequest] = useState<PageRequest>({PageNumber: 1, PageSize: 50,});

    const initFilter: InvoiceFilter = {
        InvoiceNo: '',
        CarNo: '',
        Customer: '',
        InvoiceDate: '',
        SortBy: '',
        SortDir: '',
    }
    const [filter, setFilter] = useState<InvoiceFilter>(initFilter);
    const [shouldUpdate, setShouldUpdate] = useState(true);
   
    useEffect(() => {
        if (shouldUpdate) {
            actions.loadInvoices(pageRequest, filter);
        }
    }, [pageRequest, filter, shouldUpdate]);
    
    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, {activePage}: PaginationProps) => {
        setShouldUpdate(true);
        setPageRequest({...pageRequest, PageNumber: Number(activePage)})
    }

    const filterHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setShouldUpdate(true);
        setPageRequest({...pageRequest, PageNumber: 1})
    };

    const setInvoiceDate = (date: Date) => {
        setShouldUpdate(false);
        if (date) {
            setFilter({ ...filter, InvoiceDate: moment(date).format('YYYY-MM-DD') });
        } else {
            setFilter({ ...filter, InvoiceDate: '' });
        }
    }

    const setFilterValue = (evt: ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        setShouldUpdate(false);
        switch (evt.target.name) {
            case 'txtInvoiceNo':
                setFilter({ ...filter, InvoiceNo: val });
                break;

            case 'txtCarNo':
                setFilter({ ...filter, CarNo: val });
                break;

            case 'txtCustomer':
                setFilter({ ...filter, Customer: val });
                break;
        }
    };

    const sortBy = (columnName: string) => {
        setShouldUpdate(true);
        if (filter && filter.SortBy === columnName) {
            setFilter({ ...filter, SortDir: filter.SortDir == 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setFilter({ ...filter, SortBy: columnName, SortDir: 'ASC' });
        }
    }

    const renderInvoices = () => {
        if (!invoices || invoices.data.length === 0) return null;

        const invoiceList = invoices.data.map((inv) => {
            return (
                <Table.Row key={inv.invoiceId}>
                    <Table.Cell>{inv.invoiceNo}</Table.Cell>
                    <Table.Cell>{moment(inv.invoiceDate).format('DD/MM/YYYY')}</Table.Cell>
                    <Table.Cell>{inv.car != null ? inv.car.carNo : ''}</Table.Cell>
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

        return (
            <Form onSubmit={filterHandler} autoComplete='false'>
                <Form.Field>
                    <label>Invoice No</label>
                    <input name='txtInvoiceNo' value={filter.InvoiceNo} onChange={setFilterValue} />
                </Form.Field>
                <Form.Field>
                    <label>Plate No</label>
                    <input name='txtCarNo' value={filter.CarNo} onChange={setFilterValue} />
                </Form.Field>
                <Form.Field>
                    <label>Customer</label>
                    <input name='txtCustomer' value={filter.Customer} onChange={setFilterValue} />
                </Form.Field>
                <Form.Field>
                    <label>Date</label>
                    <ReactDatePicker
                        dateFormat='dd/MM/yyyy'
                        selected={filter.InvoiceDate ? moment(filter.InvoiceDate, 'YYYY-MM-DD').toDate() : null}
                        onChange={(date) => setInvoiceDate(date as Date)}
                    />
                </Form.Field>
                <Button type='submit' basic color='blue'>
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
                        <Table color='grey' sortable celled selectable striped className='table-sticky'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell collapsing
                                        sorted={filter.SortBy === 'InvoiceNo' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                        onClick={() => sortBy('InvoiceNo')}>No</Table.HeaderCell>
                                    <Table.HeaderCell collapsing
                                        sorted={filter.SortBy === 'InvoiceDate' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                        onClick={() => sortBy('InvoiceDate')}>Date</Table.HeaderCell>
                                    <Table.HeaderCell
                                    sorted={filter.SortBy === 'CarNo' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('CarNo')}>Plate No</Table.HeaderCell>
                                    <Table.HeaderCell>Customer</Table.HeaderCell>
                                    <Table.HeaderCell>Phone</Table.HeaderCell>
                                    <Table.HeaderCell collapsing></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>{invoices != null && renderInvoices()}</Table.Body>
                        </Table>
                    <Pagination
                        activePage={pageRequest.PageNumber}
                        onPageChange={handlePaginationChange}
                        totalPages={Math.ceil(invoices.totalCount/invoices.pageSize)}
                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                    />
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

export const InvoicePage = connect(mapStateToProps, mapDispatchToProps)(InvoicePageComp);
