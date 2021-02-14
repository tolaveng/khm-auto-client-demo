import moment from 'moment';
import React from 'react';
import { Container, Form, Grid} from 'semantic-ui-react';
import { HeaderLine } from '../components/header-line';

export const InvoiceEdit: React.FC = () => {
    return (
        <Container fluid>
            <HeaderLine label="Invoices" />
            <Grid columns={2} relaxed="very">
                <Grid.Column width={12}>
                    <Form>
                        <Form.Field>
                            <label>Invoice Date</label>
                            <input type="date" defaultValue={moment().format('YYYY-MM-DD')} />
                        </Form.Field>
                    </Form>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};
