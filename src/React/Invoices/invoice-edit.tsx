import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, ButtonGroup, Container, Form, Grid, Tab, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';
import { TableEditor, TableEditorRow } from '../components/table-editor';
import { TableEditorDataColumn, TableEditorDataRow } from '../components/table-editor/type';


export const InvoiceEdit: React.FC = () => {
    const serviceTableColumns: TableEditorDataColumn[] = [
        {
            name: 'Service Description', type: 'textarea'
        },
        {
            name: 'Price',
            collapse: true,
            type: 'number',
            textAlign: 'right',
            required: true
        },
        {
            name: 'Qty',
            collapse: true,
            type: 'number',
            textAlign: 'right',
            maxLength: 2,
            required: true
        },
        {
            name: 'Total',
            collapse: true,
            type: 'number',
            textAlign: 'right',
            readOnly: true
        },
    ];

    const serviceRawData: TableEditorDataRow[] = [
        {
            id: 1,
            cells: ['test 1', 11, 11, 111]
        },
        {
            id: 2,
            cells: ['test 2', 22, 2222, 222]
        },
        {
            id: 3,
            cells: ['test 3', 33, 33, 3]
        }
    ];

    const [serviceData, setServiceData] = useState(serviceRawData);

    function addNew (row: TableEditorDataRow) {
        const cells = row.cells!;
        cells[3] = cells[1] * cells[2];
        setServiceData([...serviceData, row])
    }

    function saveRow (row: TableEditorDataRow) {
        console.log('save Row', row)
    }

    function deleteRow (rowId: number) {
        console.log('delete row', rowId);
    }

    return (
        <Container fluid>
            <HeaderLine label='New Invoice' />
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <Form autoComplete='none'>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>Invoice Date</label>
                                <DatePicker onChange={() => {}} />
                            </Form.Field>
                            <Form.Field />
                            <Form.Field />
                        </Form.Group>
                        <fieldset>
                            <legend>Customer</legend>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Full name'
                                    icon={{ name: 'search', circular: true, link: true }}
                                    autoComplete='off'
                                />
                                <Form.Input fluid label='Phone number' autoComplete='off' />
                                <Form.Input fluid label='Email' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Company' />
                                <Form.Input fluid label='ABN' />
                            </Form.Group>
                            <Form.Input fluid label='Address' />
                        </fieldset>
                        <fieldset>
                            <legend>Car</legend>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Reg. No'
                                    icon={{ name: 'search', circular: true, link: true }}
                                />
                                <Form.Input fluid label='ODO' type='number' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Make' />
                                <Form.Input fluid label='Model' />
                                <Form.Input fluid label='Year' type='number' />
                            </Form.Group>
                        </fieldset>
                        <fieldset style={{ minHeight: 200 }}>
                            <legend>Services</legend>
                            <TableEditor columns={serviceTableColumns} rows={serviceData} onRowAdded={addNew} onRowSaved={saveRow} onRowDeleted={deleteRow}/>
                        </fieldset>

                        <Grid columns='2'>
                            <Grid.Column>
                                <Form.TextArea label='Note' rows='2' />
                                <fieldset>
                                    <legend>Payment</legend>
                                    <Form.Group inline>
                                        <Form.Field>
                                            <input type='radio' id='paymentMethodCash' name='paymentmethod' value='cash' defaultChecked />
                                            <label htmlFor='paymentMethodCash'>Cash</label>
                                        </Form.Field>
                                        <span>&nbsp; &nbsp; &nbsp;</span>
                                        <Form.Field>
                                            <input type='radio'  id='paymentMethodCard' name='paymentmethod' value='card' />
                                            <label htmlFor='paymentMethodCard'>Card</label>
                                        </Form.Field>
                                        <span>&nbsp; &nbsp; &nbsp;</span>
                                        <Form.Field>
                                            <input type='radio'  id='paymentMethodUnpaid' name='paymentmethod' value='notpay' />
                                            <label htmlFor='paymentMethodUnpaid'>UnPaid</label>
                                        </Form.Field>
                                    </Form.Group>
                                </fieldset>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                <Form.Field inline>
                                    <label>Sub Total</label>
                                    <input type='number' readOnly placeholder='0' style={{ textAlign: 'right' }} />
                                </Form.Field>
                                <Form.Field inline>
                                    <label>GST</label>
                                    <input type='number' readOnly placeholder='0' style={{ textAlign: 'right' }} />
                                </Form.Field>
                                <Form.Field inline>
                                    <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Total (incl.GST)</label>
                                    <input
                                        type='number'
                                        readOnly
                                        placeholder='0'
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                        <div style={{ textAlign: 'right' }}>
                            <Button primary className='action-button'>
                                Print
                            </Button>
                            <Button basic color='blue' className='action-button'>
                                Save
                            </Button>
                            <Button basic color='blue' className='action-button'>
                                Close
                            </Button>
                        </div>
                    </Form>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};
