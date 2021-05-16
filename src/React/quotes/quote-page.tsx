import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, Grid, Icon, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { Quote } from '../types/quote';
import { loadQuotes } from './actions';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { User } from '../components/users/types';
import { RootState } from '../types/root-state';
import { QuoteFilter } from '../types/quote-filter';


interface QuotePageDispatchProps {
    actions: {
        loadQuotes: (pageRequest: PageRequest, filter?: QuoteFilter) => void
    };
}


interface QuotePageStateProps {
    user: User,
    quotes: PageResponse<Quote>
}

type Props = QuotePageStateProps & QuotePageDispatchProps;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const QuotePageComp: React.FC<Props> = (props) => {
    const { user, quotes, actions } = props;

    const query = useQuery();
    let queryCarNo = '';
    if (query && query.get('carNo')) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryCarNo = query.get('carNo')!;
    }

    const [pageRequest, setPageRequest] = useState<PageRequest>({ PageNumber: 1, PageSize: 50, });

    const initFilter: QuoteFilter = {
        QuoteId: '',
        CarNo: queryCarNo,
        Customer: '',
        QuoteDate: '',
        SortBy: 'QuoteId',
        SortDir: 'DESC',
    }
    const [filter, setFilter] = useState<QuoteFilter>(initFilter);
    const [shouldUpdate, setShouldUpdate] = useState(true);

    useEffect(() => {
        if (shouldUpdate) {
            actions.loadQuotes(pageRequest, filter);
        }
    }, [pageRequest, filter, shouldUpdate]);

    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
        setShouldUpdate(true);
        setPageRequest({ ...pageRequest, PageNumber: Number(activePage) })
    }

    const filterHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setShouldUpdate(true);
        setPageRequest({ ...pageRequest, PageNumber: 1 })
    };

    const setQuoteDate = (date: Date) => {
        setShouldUpdate(false);
        if (date) {
            setFilter({ ...filter, QuoteDate: moment(date).format('YYYY-MM-DD') });
        } else {
            setFilter({ ...filter, QuoteDate: '' });
        }
    }

    const setFilterValue = (evt: ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        setShouldUpdate(false);
        switch (evt.target.name) {
            case 'txtQuoteId':
                setFilter({ ...filter, QuoteId: val });
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

    const renderQuotes = () => {
        if (!quotes || quotes.data.length === 0) return null;

        const quoteList = quotes.data.map((inv) => {
            return (
                <Table.Row key={inv.quoteId}>
                    <Table.Cell>{inv.quoteId}</Table.Cell>
                    <Table.Cell>{moment(inv.quoteDate).format('DD/MM/YYYY')}</Table.Cell>
                    <Table.Cell>{inv.car != null ? inv.car.carNo : ''}</Table.Cell>
                    <Table.Cell>{inv.fullName}</Table.Cell>
                    <Table.Cell>{inv.phone}</Table.Cell>
                    <Table.Cell>
                        <Button basic icon='pencil' as={Link} to={`/quote/edit/${inv.quoteId}`} title={'Edit Quote'} />
                    </Table.Cell>
                </Table.Row>
            );
        });

        return quoteList;
    };

    const renderFilterForm = () => {

        return (
            <Segment>
                <Form onSubmit={filterHandler} autoComplete='false'>
                    <Form.Field>
                        <label>Quote No</label>
                        <input name='txtQuoteId' value={filter.QuoteId} onChange={setFilterValue} />
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
                            selected={filter.QuoteDate ? moment(filter.QuoteDate, 'YYYY-MM-DD').toDate() : null}
                            onChange={(date) => setQuoteDate(date as Date)}
                        />
                    </Form.Field>
                    <Button type='submit' basic color='blue' icon labelPosition='left'>
                        <Icon name='search' />
                        <span>Find</span>
                    </Button>
                </Form>
            </Segment>
        );
    };

    return (
        <Container fluid>
            <HeaderLine label='Quotes'>
                <Button type='button' primary as={Link} to='/quote/new' icon labelPosition='left'>
                    <Icon name='add' />
                    <span>Create Quote</span>
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    <Table color='grey' sortable celled selectable striped className='table-sticky'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell collapsing
                                    sorted={filter.SortBy === 'QuoteId' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('QuoteId')}>No</Table.HeaderCell>
                                <Table.HeaderCell collapsing
                                    sorted={filter.SortBy === 'QuoteDate' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('QuoteDate')}>Date</Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={filter.SortBy === 'CarNo' && filter.SortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => sortBy('CarNo')}>Plate No</Table.HeaderCell>
                                <Table.HeaderCell>Customer</Table.HeaderCell>
                                <Table.HeaderCell>Phone</Table.HeaderCell>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{quotes != null && renderQuotes()}</Table.Body>
                    </Table>
                    <Pagination
                        activePage={pageRequest.PageNumber}
                        onPageChange={handlePaginationChange}
                        totalPages={quotes.totalCount > 0 ? Math.ceil(quotes.totalCount / quotes.pageSize) : 1}
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

const mapStateToProps = (state: RootState): QuotePageStateProps => {
    return {
        user: state.user,
        quotes: state.quoteState.quotes
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): QuotePageDispatchProps => ({
    actions: {
        loadQuotes: bindActionCreators(loadQuotes, dispatch)
    }
});

export const QuotePage = connect(mapStateToProps, mapDispatchToProps)(QuotePageComp);
