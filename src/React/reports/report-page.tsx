import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, Grid, Icon, Message, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { SummaryReport } from '../types/summary-report';
import { RootState } from '../types/root-state';
import { downloadSummaryReport, loadSummaryReport } from './actions';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import { SummaryReportFilter } from '../types/summary-report-filter';


interface IStateProps {
    summaryReports: PageResponse<SummaryReport>
}

interface IDispatchProps {
    actions: {
        loadSummaryReport: (pageRequest: PageRequest, filter: SummaryReportFilter) => void,
        downloadSummaryReport: (filter: SummaryReportFilter) => void
    };
}

const ReportPageComp: React.FC<IStateProps & IDispatchProps> = (props) => {
    const { actions, summaryReports } = props;

    const now = new Date();
    const firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [filter, setFilter] = useState({
        fromDate: moment(firstDate).format('YYYY-MM-DD'),
        toDate: moment(lastDate).format('YYYY-MM-DD'),
        sortBy: 'InvoiceDate',
        sortDir: 'ASC',
        shouldUpdate: true
    });

    const setSortBy = (columnName: string) => {
        if (filter && filter.sortBy === columnName) {
            setFilter({ ...filter, sortDir: filter.sortDir == 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setFilter({ ...filter, sortBy: columnName, sortDir: 'ASC' });
        }
    }

    const setFilterDate = (dateType: string, date: Date) => {
        if (dateType == 'fromDate' && date) {
            setFilter({ ...filter, shouldUpdate: false, fromDate: moment(date).format('YYYY-MM-DD') });
        }
        if (dateType == 'toDate' && date) {
            setFilter({ ...filter, shouldUpdate: false, toDate: moment(date).format('YYYY-MM-DD') });
        }
    }

    const [pageRequest, setPageRequest] = useState<PageRequest>({ PageNumber: 1, PageSize: 50, });

    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
        setFilter({ ...filter, shouldUpdate: true });
        setPageRequest({ ...pageRequest, PageNumber: Number(activePage) })
    }

    useEffect(() => {
        if (filter.shouldUpdate) {
            actions.loadSummaryReport(pageRequest, filter);
        }
    }, [pageRequest, filter])


    const filterHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setFilter({ ...filter, shouldUpdate: true });
        setPageRequest({ ...pageRequest, PageNumber: 1 })
    };

    const downloadHandler = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        evt.preventDefault();
        setFilter({ ...filter, shouldUpdate: true });
        actions.downloadSummaryReport(filter);
    };

    const renderReports = () => {
        if (!summaryReports || summaryReports.data.length == 0) return null;

        const reportList = summaryReports.data.map((report, i) => {
            return (
                <Table.Row key={report.invoiceNo + '_' + i}>
                    <Table.Cell>{report.invoiceNo}</Table.Cell>
                    <Table.Cell>{report.invoiceDate}</Table.Cell>
                    <Table.Cell>
                        {
                            report.services.substr(0, 100).split('\n').map((item, key) => {
                                return <span key={key}>{item}<br /></span>
                            })
                        }
                        </Table.Cell>
                    <Table.Cell textAlign='right'>{report.subTotal.toFixed(2)}</Table.Cell>
                    <Table.Cell textAlign='right'>{report.discount.toFixed(2)}</Table.Cell>
                    <Table.Cell textAlign='right' style={{ fontWeight: 'bold' }}>{report.amountTotal.toFixed(2)}</Table.Cell>
                    <Table.Cell textAlign='right' style={{ fontWeight: 'bold' }}>{report.gstTotal.toFixed(2)}</Table.Cell>
                    <Table.Cell textAlign='right' style={{ fontWeight: 'bold' }}>{(report.amountTotal - report.gstTotal).toFixed(2)}</Table.Cell>
                </Table.Row>
            );
        });

        return reportList;
    }

    const renderFilterForm = () => {
        return (
            <Segment>
                <Form onSubmit={filterHandler} autoComplete='false'>
                    <Form.Field>
                        <label>From Date</label>
                        <ReactDatePicker
                            dateFormat='dd/MM/yyyy'
                            selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                            onChange={(date) => setFilterDate('fromDate', date as Date)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>To Date</label>
                        <ReactDatePicker
                            dateFormat='dd/MM/yyyy'
                            selected={filter.toDate ? moment(filter.toDate, 'YYYY-MM-DD').toDate() : null}
                            onChange={(date) => setFilterDate('toDate', date as Date)}
                        />
                    </Form.Field>
                    <div>
                        <Button type='submit' basic color='blue' icon labelPosition='left'>
                            <Icon name='search' />
                            <span>Filter</span>
                        </Button>
                        <Button type='button' color='blue' icon labelPosition='left' style={{ float: 'right' }}
                         onClick={downloadHandler}
                          loading={summaryReports.isDownloading}
                          disabled={summaryReports.isDownloading}>
                            <Icon name='share' />
                            <span>Export</span>
                        </Button>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                </Form>
            </Segment>
        );
    }

    return (
        <Container fluid>
            <HeaderLine label='Summary Report' />
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    {summaryReports.error && <Message negative color='red' attached='bottom'>
                        <Icon name='exclamation' />
                        Error: {summaryReports.error}
                    </Message>
                    }
                    <Table color='grey' sortable celled selectable striped className='table-sticky'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell collapsing
                                    sorted={filter.sortBy === 'InvoiceNo' && filter.sortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => setSortBy('InvoiceNo')}>Invoice No</Table.HeaderCell>
                                <Table.HeaderCell collapsing
                                    sorted={filter.sortBy === 'InvoiceDate' && filter.sortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => setSortBy('InvoiceDate')}>Invoice Date</Table.HeaderCell>
                                <Table.HeaderCell>Services</Table.HeaderCell>
                                <Table.HeaderCell collapsing>SubTotal</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Discount</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Total (in GST)</Table.HeaderCell>
                                <Table.HeaderCell collapsing>GST</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Total (ex GST)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{renderReports()}</Table.Body>
                    </Table>
                    <Pagination
                        activePage={pageRequest.PageNumber}
                        onPageChange={handlePaginationChange}
                        totalPages={1}
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
}

const mapStateToProps = (state: RootState): IStateProps => {
    return {
        summaryReports: state.summaryReports
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IDispatchProps => ({
    actions: {
        loadSummaryReport: bindActionCreators(loadSummaryReport, dispatch),
        downloadSummaryReport: bindActionCreators(downloadSummaryReport, dispatch)
    }
});

export const ReportPage = connect(mapStateToProps, mapDispatchToProps)(ReportPageComp);