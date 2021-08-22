import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, FormGroup, Grid, Icon, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { Invoice } from '../types/invoice';
import { clearInvoiceFilter, loadInvoices, setInvoiceFilter } from './actions';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { User } from '../components/users/types';
import { RootState } from '../types/root-state';
import { InvoiceFilter } from '../types/invoice-filter';
import { Field, Formik, FormikProps } from 'formik';


interface InvoicePageDispatchProps {
    actions: {
        loadInvoices: (pageRequest: PageRequest, filter?: InvoiceFilter) => void,
        setInvoiceFilter: (filter: InvoiceFilter) => void,
        clearInvoiceFilter: () => void,
    };
}


interface InvoicePageStateProps {
    user: User,
    invoices: PageResponse<Invoice>,
    invoiceFilter: InvoiceFilter,
}

type Props = InvoicePageStateProps & InvoicePageDispatchProps;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const InvoicePageComp: React.FC<Props> = (props) => {
    const { user, invoices, actions, invoiceFilter } = props;

    const query = useQuery();
    let queryCarNo = '';
    if (query && query.get('carNo')) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryCarNo = query.get('carNo')!;
    }

    const [pageRequest, setPageRequest] = useState<PageRequest>({ PageNumber: 1, PageSize: 50, });
    
    useEffect(() => {
        actions.loadInvoices(pageRequest, invoiceFilter);
    }, [pageRequest]);

    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
        setPageRequest({ ...pageRequest, PageNumber: Number(activePage) })
    }

    const clearInvoiceFilter = (form: FormikProps<InvoiceFilter>) => {
        actions.clearInvoiceFilter();
        setPageRequest({ ...pageRequest, PageNumber: 1 });
        form.resetForm();
    }

    const filterHandler = (formValues: InvoiceFilter) => {
        actions.setInvoiceFilter({...invoiceFilter,
            InvoiceNo: formValues.InvoiceNo,
            CarNo: formValues.CarNo,
            Customer: formValues.Customer,
            InvoiceDate: formValues.InvoiceDate ? moment(formValues.InvoiceDate).format('YYYY-MM-DD') : '',
         });
        setPageRequest({ ...pageRequest, PageNumber: 1 });
    };

    const sortBy = (columnName: string) => {
        if (invoiceFilter && invoiceFilter.SortBy === columnName) {
            actions.setInvoiceFilter({ ...invoiceFilter, SortDir: invoiceFilter.SortDir == 'ASC' ? 'DESC' : 'ASC' });
        } else {
            actions.setInvoiceFilter({ ...invoiceFilter, SortBy: columnName, SortDir: 'ASC' });
        }
        setPageRequest({ ...pageRequest, PageNumber: 1 })
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
                        <Button.Group>
                            <Button basic icon='pencil' as={Link} to={`/invoice/edit/${inv.invoiceId}`} title={'Edit Invoice'} />
                            <span style={{borderLeft: '2px solid #CCCCCC', height:'20px', marginTop: '8px'}}></span>
                            <Button basic icon='copy' as={Link} to={`/invoice/copy/${inv.invoiceId}`} title={'Copy Invoice'} />
                            </Button.Group>
                    </Table.Cell>
                </Table.Row>
            );
        });

        return invoiceList;
    };

    const renderFilterForm = () => {

        return (
            <Segment>
                <Formik initialValues={invoiceFilter} onSubmit={filterHandler} enableReinitialize>
                    {formik => (
                        <Form onSubmit={formik.handleSubmit} autoComplete='false'>
                        <Form.Field>
                            <label>Invoice No</label>
                            <Field name='InvoiceNo' />
                        </Form.Field>
                        <Form.Field>
                            <label>Plate No</label>
                            <Field name='CarNo' />
                        </Form.Field>
                        <Form.Field>
                            <label>Customer</label>
                            <Field name='Customer' />
                        </Form.Field>
                        <Form.Field>
                            <label>Date</label>
                            <Field name='InvoiceDate' component={ReactDatePicker}
                                dateFormat='dd/MM/yyyy'
                                selected={formik.values.InvoiceDate ? moment(formik.values.InvoiceDate, 'YYYY-MM-DD').toDate() : null}
                                onChange={(date: any) => formik.setFieldValue('InvoiceDate', date as Date)}
                            />
                        </Form.Field>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button type='submit' basic color='blue' icon labelPosition='left'>
                            <Icon name='search' />
                            <span>Find</span>
                        </Button>
                        <Button type='button' basic color='blue' icon labelPosition='left' style={{alignSelf: 'flex-end'}}
                            onClick={() => clearInvoiceFilter(formik)}
                        >
                            <Icon name='redo' />
                            <span>Clear</span>
                        </Button>
                        </div>
                    </Form>
                    )}
                </Formik>
            </Segment>
        );
    };

    return (
        <Container fluid>
            <HeaderLine label='Invoices'>
                <Button type='button' primary as={Link} to='/invoice/new' icon labelPosition='left'>
                    <Icon name='add' />
                    <span>Create Invoice</span>
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    <Table color='grey' sortable celled selectable striped className='table-sticky'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell collapsing
                                    sorted={invoiceFilter.SortBy === 'InvoiceNo' && invoiceFilter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('InvoiceNo')}>No</Table.HeaderCell>
                                <Table.HeaderCell collapsing
                                    sorted={invoiceFilter.SortBy === 'InvoiceDate' && invoiceFilter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('InvoiceDate')}>Date</Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={invoiceFilter.SortBy === 'CarNo' && invoiceFilter.SortDir === 'ASC' ? 'ascending' : 'descending'}
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
                        totalPages={invoices.totalCount > 0 ? Math.ceil(invoices.totalCount / invoices.pageSize) : 1}
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
        invoices: state.invoiceState.invoices,
        invoiceFilter: state.invoiceState.invoiceFilter,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoicePageDispatchProps => ({
    actions: {
        loadInvoices: bindActionCreators(loadInvoices, dispatch),
        setInvoiceFilter: bindActionCreators(setInvoiceFilter, dispatch),
        clearInvoiceFilter: bindActionCreators(clearInvoiceFilter, dispatch),
    }
});

export const InvoicePage = connect(mapStateToProps, mapDispatchToProps)(InvoicePageComp);
