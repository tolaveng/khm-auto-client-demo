import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Table } from 'semantic-ui-react';
import { HeaderLine } from './components/header-line';

const tempPage : React.FC = () => {
    return (
        <Container fluid>
            <HeaderLine label="Invoices">
                <Button type="button" primary as={Link} to="invoice/invoice-edit">
                    Create Invoice
                </Button>
            </HeaderLine>
            <Grid columns={2} relaxed="very">
                <Grid.Column width={12}>
                    <Table celled selectable striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Plate No</Table.HeaderCell>
                                <Table.HeaderCell>Customer</Table.HeaderCell>
                                <Table.HeaderCell>Phone</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>test</Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};
