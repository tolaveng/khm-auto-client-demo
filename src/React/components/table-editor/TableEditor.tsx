import React from 'react';
import { Table } from 'semantic-ui-react';
import { TableEditorRow } from '.';
import { TableEditorDataColumn, TableEditorDataRow } from './type';
import './TableEditorStyles.css';

export interface TableEditorProp {
    columns: TableEditorDataColumn[];
    rows?: TableEditorDataRow[];
    readonly?: boolean;

    onRowUpdated?: (row: TableEditorDataRow) => void;
    onRowDeleted?: (rowId: number) => void;
}

export class TableEditor extends React.Component<TableEditorProp> {
    constructor(props: TableEditorProp) {
        super(props);

        this.renderColumnHeader = this.renderColumnHeader.bind(this);
        this.renderNewRow = this.renderNewRow.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);
    }

    renderColumnHeader() {
        const { columns } = this.props;
        if (columns.length == 0) {
            return null;
        }
        const tableColumns = columns.map((column, index) => (
            <Table.HeaderCell key={index} collapsing={column.collapse}>
                {column.name}
            </Table.HeaderCell>
        ));

        return (
            <Table.Header>
                <Table.Row>
                    {tableColumns}
                    <Table.HeaderCell key='action' collapsing={true}>
                        &nbsp;
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        );
    }

    renderNewRow() {
        const { readonly, columns, onRowUpdated } = this.props;
        if (readonly) return null;
        return <TableEditorRow key={(-1 * Date.now())} isNew={true} row={{ cells: null }} columns={columns} onRowUpdated={onRowUpdated} />;
    }

    renderDataRow() {
        const { rows, columns, onRowUpdated, onRowDeleted } = this.props;
        if (!rows || !Array.isArray(rows) ) {
            return <Table.Row><Table.Cell error>Rows property must be an array.</Table.Cell></Table.Row>
        }
        if (rows.length === 0) return null;
        return rows.map((row, index) => <TableEditorRow key={`${row.id}_${index}`} row={row} columns={columns} onRowUpdated={onRowUpdated} onRowDeleted={onRowDeleted} />);
    }


    render() {
        return (
            <Table celled color='grey' className='table-editor'>
                {this.renderColumnHeader()}
                <Table.Body>
                    {this.renderDataRow()}
                    {this.renderNewRow()}
                </Table.Body>
            </Table>
        );
    }
}
