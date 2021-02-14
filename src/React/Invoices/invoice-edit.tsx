import React from 'react';
import DatePicker from 'react-datepicker';
import { Container, Form, Grid } from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';

export const InvoiceEdit: React.FC = () => {
    return (
        <Container fluid>
            <HeaderLine label='New Invoice' />
            <Grid columns={2} relaxed='very'>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <Form>
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
                            <Form.Input fluid label='Full name' />
                            <Form.Input fluid label='Phone number' />
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
                            <Form.Input fluid label='Reg. No' />
                            <Form.Input fluid label='ODO' type='number' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='Make' />
                            <Form.Input fluid label='Model' />
                            <Form.Input fluid label='Year' type='number' />
                        </Form.Group>
                        </fieldset>
                    </Form>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};
