import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Container, Form, Grid } from 'semantic-ui-react';
import { HeaderLine } from '../common/headerline';
import { getToDay } from '../common/helper';


const filterForm = () => {
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
            <input placeholder='name or phone'/>
        </Form.Field>
        <Form.Field>
            <label>Date</label>
            <input type='date' placeholder='invoice date' defaultValue={getToDay()}/>
        </Form.Field>
            <Button type='submit'>Filter</Button>
    </Form>
    );
};


const Invoice = () => {
  return (
    <Container fluid>
        <HeaderLine label='Invoices'>
            <Button type='button' primary>Create New Invoice</Button>
        </HeaderLine>
        <Grid>
            <Grid.Row>
                <Grid.Column width={12}>
                    {'test'}
                </Grid.Column>
                <Grid.Column width={4}>
                    {filterForm()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
  );
}

export default Invoice;