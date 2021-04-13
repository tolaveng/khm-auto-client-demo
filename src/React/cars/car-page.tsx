import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Form, Grid, Icon, Pagination, PaginationProps, Table } from 'semantic-ui-react';
import { PageResponse } from '../types/page-response';
import { Car } from '../types/car';
import { PageRequest } from '../types/page-request';
import { HeaderLine } from '../components/HeaderLine';
import { RootState } from 'src/React/types/root-state';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { loadCars } from './actions';
import { Link } from 'react-router-dom';


interface IStateProps {
    cars: PageResponse<Car>
}

interface IDispatchProps {
    actions: {
        loadCars: (pageRequest: PageRequest, filter?: any) => void
    };
}

const CarPageComp: React.FC<IStateProps & IDispatchProps> = (props) => {
    const { cars, actions } = props;

    const [filter, setFilter] = useState({
        carNo: '',
        sortBy: '',
        sortDir: '',
        shouldUpdate: true
    });

    const setSortBy = (columnName: string) => {
        if (filter && filter.sortBy === columnName) {
            setFilter({ ...filter, sortDir: filter.sortDir == 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setFilter({ ...filter, sortBy: columnName, sortDir: 'ASC' });
        }
    }

    const [pageRequest, setPageRequest] = useState<PageRequest>({ PageNumber: 1, PageSize: 50, });

    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
        setFilter({ ...filter, shouldUpdate: true });
        setPageRequest({ ...pageRequest, PageNumber: Number(activePage) })
    }

    useEffect(() => {
        if (filter.shouldUpdate) {
            actions.loadCars(pageRequest, filter);
        }
    }, [pageRequest, filter])


    const setFilterValue = (evt: ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        setFilter({ ...filter, carNo: val, shouldUpdate: false });
    };

    const filterHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setFilter({ ...filter, shouldUpdate: true });
        setPageRequest({ ...pageRequest, PageNumber: 1 })
    };


    const renderCars = () => {
        if (!cars || cars.data.length == 0) return null;

        const carList = cars.data.map((car, i) => {
            return (
                <Table.Row key={car.carNo + i}>
                    <Table.Cell>{car.carNo}</Table.Cell>
                    <Table.Cell>{car.carMake}</Table.Cell>
                    <Table.Cell>{car.carModel}</Table.Cell>
                    <Table.Cell>{car.carYear}</Table.Cell>
                    <Table.Cell>{car.odo}</Table.Cell>
                    <Table.Cell>
                        <Button basic icon='search' as={Link} to={`/invoice/?carNo=${car.carNo}`} title={'Find Invoices'} />
                    </Table.Cell>
                </Table.Row>
            );
        });

        return carList;
    };


    const renderFilterForm = () => {
        return (
            <Form onSubmit={filterHandler} autoComplete='false'>
                <Form.Field>
                    <label>Reg.No</label>
                    <input name='txtCarNo' value={filter.carNo} onChange={setFilterValue} />
                </Form.Field>
                <Button type='submit' basic color='blue' icon labelPosition='left'>
                    <Icon name='filter' />
                    Filter
                </Button>
            </Form>
        );
    }

    return (
        <Container fluid>
            <HeaderLine label='Cars' />
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    <Table color='grey' sortable celled selectable striped className='table-sticky'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={filter.sortBy === 'CarNo' && filter.sortDir === 'ASC' ? 'ascending' : 'descending'}
                                    onClick={() => setSortBy('CarNo')}>Car Reg. No</Table.HeaderCell>
                                <Table.HeaderCell>Make</Table.HeaderCell>
                                <Table.HeaderCell>Model</Table.HeaderCell>
                                <Table.HeaderCell>Year</Table.HeaderCell>
                                <Table.HeaderCell>ODO</Table.HeaderCell>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{renderCars()}</Table.Body>
                    </Table>
                    <Pagination
                        activePage={pageRequest.PageNumber}
                        onPageChange={handlePaginationChange}
                        totalPages={cars.totalCount > 0 ? Math.ceil(cars.totalCount / cars.pageSize) : 1}
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
    )
}


const mapStateToProps = (state: RootState): IStateProps => {
    return {
        cars: state.carState
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IDispatchProps => ({
    actions: {
        loadCars: bindActionCreators(loadCars, dispatch)
    }
});

export const CarPage = connect(mapStateToProps, mapDispatchToProps)(CarPageComp);