import { Formik } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, Container, Form, Grid, Icon, Modal, Pagination, PaginationProps, Segment, Table, TextArea } from 'semantic-ui-react';
import { filter } from 'webpack.config';
import { HeaderLine } from '../components/HeaderLine';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { RootState } from '../types/root-state';
import { ServiceIndex } from '../types/service-index';
import { deleteServiceIndex, loadServiceIndexes, saveServiceIndex } from './serviceIndexAction';

interface IStateProps {
    serviceIndexes: PageResponse<ServiceIndex>
}

interface IDispatchProps {
    actions: {
        loadServiceIndexes: (pageRequest: PageRequest, serviceName: string) => void,
        deleteServiceIndex: (id: number, callback: () => void) => void,
        saveServiceIndex: (serviceIndex: ServiceIndex, callback: () => void) => void
    };
}

const ServiceIndexPageComp: React.FC<IStateProps & IDispatchProps> = (props) => {
    const { serviceIndexes, actions } = props;
    const [pageRequest, setPageRequest] = useState<PageRequest>({ PageNumber: 1, PageSize: 50, });
    const [filter, setFilter] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState(0);
    const [editingService, setEditingService] = useState<ServiceIndex | null>(null);

    useEffect(() => {
        if (shouldUpdate) {
            actions.loadServiceIndexes(pageRequest, filter);
        }
    }, [pageRequest, filter])

    const handlePaginationChange = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
        setShouldUpdate(true);
        setPageRequest({ ...pageRequest, PageNumber: Number(activePage) })
    }

    const setFilterValue = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target.value;
        setFilter(val);
        setShouldUpdate(false);
    };

    const filterHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setShouldUpdate(true);
        setPageRequest({ ...pageRequest, PageNumber: 1 })
    };

    const deleteServiceIndex = (id?: number) => {
        if (!id) return;
        setConfirmDeleteId(id);
    };

    const handleDelete = () => {
        if (!confirmDeleteId) return;
        actions.deleteServiceIndex(confirmDeleteId, () => {
            actions.loadServiceIndexes(pageRequest, filter);
        });
        setConfirmDeleteId(0);
    }

    const handleSave = () => {
        if (!editingService || !editingService.serviceIndexId) return;
        actions.saveServiceIndex(editingService, () => {
            actions.loadServiceIndexes(pageRequest, filter);
        });
        setEditingService(null);
    }

    const renderServiceIndexes = () => {
        if (!serviceIndexes || !serviceIndexes.data || serviceIndexes.data.length == 0) {
            return (
                <Table.Row key={0}>
                    <Table.Cell>Search by service name. No result found.</Table.Cell>
                    <Table.Cell></Table.Cell>
                </Table.Row>
            );
        }

        const list = serviceIndexes.data.map((data) => {
            return (
                <Table.Row key={data.serviceIndexId}>
                    <Table.Cell>{data.serviceName}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button basic icon='pencil' title={'Edit'} onClick={() => setEditingService(data)} />
                            <span style={{ borderLeft: '2px solid #CCCCCC', height: '20px', marginTop: '8px' }}></span>
                            <Button basic icon='trash' title={'Delete'} onClick={() => deleteServiceIndex(data.serviceIndexId)} />
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            );
        });

        return list;
    };

    const renderFilterForm = () => {
        return (
            <Segment>
                <Form onSubmit={filterHandler} autoComplete='false'>
                    <Form.Field>
                        <label>Service Name</label>
                        <textarea name='txtServiceName' rows={2} value={filter} onChange={setFilterValue} />
                    </Form.Field>
                    <Button type='submit' basic color='blue' icon labelPosition='left'>
                        <Icon name='search' />
                        <span>Find</span>
                    </Button>
                </Form>
            </Segment>
        );
    }

    const renderDeleteModal = () => {
        return (<Modal
            onClose={() => setConfirmDeleteId(0)}
            open={confirmDeleteId !== 0}
        >
            <Modal.Header>Delete Service Name</Modal.Header>
            <Modal.Content>
                <Modal.Description style={{overflow:'auto', maxHeight: '320px'}}>
                    <span>Are you sure to delete this service name?</span>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => handleDelete()} negative color='red'>DELETE</Button>
                <Button onClick={() => setConfirmDeleteId(0)}>No</Button>
            </Modal.Actions>
        </Modal>);
    }

    const editingServiceNameOnChange = (serviceName: string) => {
        if (!editingService) return;
        setEditingService({...editingService, serviceName});
    };

    const renderEditingModal = () => {
        return (<Modal
            onClose={() => setEditingService(null)}
            open={!!editingService}
            closeOnDimmerClick={false}
            closeOnDocumentClick={false}
        >
            <Modal.Header>Edit Service Name</Modal.Header>
            <Modal.Content>
                <Modal.Description style={{overflow:'auto', minHeight: '320px'}}>
                    <TextArea style={{width: '100%', minHeight: '300px'}}
                    value={editingService?.serviceName}
                    onChange={(e) => editingServiceNameOnChange(e.target.value)} ></TextArea>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => handleSave()} color='green'>Save</Button>
                <Button onClick={() => setEditingService(null)}>Cancel</Button>
            </Modal.Actions>
        </Modal>);
    }

    return (
        <Container fluid>
            <HeaderLine label='Service Auto Complete' />
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={12}>
                    <Table color='grey' celled selectable striped className='table-sticky'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Service Name</Table.HeaderCell>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{renderServiceIndexes()}</Table.Body>
                    </Table>
                    <Pagination
                        activePage={pageRequest.PageNumber}
                        onPageChange={handlePaginationChange}
                        totalPages={serviceIndexes.totalCount > 0 ? Math.ceil(serviceIndexes.totalCount / serviceIndexes.pageSize) : 1}
                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                    />
                </Grid.Column>
                <Grid.Column width={4}>{renderFilterForm()}</Grid.Column>
            </Grid>

            {editingService && renderEditingModal()}
            {confirmDeleteId !== 0 && renderDeleteModal()}
        </Container>
    )

}

const mapStateToProps = (state: RootState): IStateProps => {
    return {
        serviceIndexes: state.serviceIndexState
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IDispatchProps => ({
    actions: {
        loadServiceIndexes: bindActionCreators(loadServiceIndexes, dispatch),
        deleteServiceIndex: bindActionCreators(deleteServiceIndex, dispatch),
        saveServiceIndex: bindActionCreators(saveServiceIndex, dispatch),
    }
});

export const ServiceIndexPage = connect(mapStateToProps, mapDispatchToProps)(ServiceIndexPageComp);