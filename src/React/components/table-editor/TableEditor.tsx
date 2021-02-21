import React from 'react';
import { Button, ButtonGroup, Icon, Table } from 'semantic-ui-react';
import { TableEditorRow } from '.';
import { TableEditorDataColumn, TableEditorDataRow } from './@type';

export interface TableEditorProp {
    columns: TableEditorDataColumn[];
    rows?: TableEditorDataRow[];
    readonly?: boolean;
    onAddNewRow?: (newRow: TableEditorDataRow) => void;
}

export class TableEditor extends React.Component<TableEditorProp> {
    constructor(props: TableEditorProp) {
        super(props);

        this.addNewRow = this.addNewRow.bind(this);

        this.renderColumnHeader = this.renderColumnHeader.bind(this);
        this.renderNewRow = this.renderNewRow.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);

        this.generateDataCell = this.generateDataCell.bind(this);
    }

    addNewRow(newRow: TableEditorDataRow) {
        const { onAddNewRow } = this.props;
        if (onAddNewRow) {
            onAddNewRow(newRow);
        }
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
        const { readonly, columns } = this.props;
        if (readonly) return null;
        return <TableEditorRow isNew={true} row={{ cells: null }} columns={columns} onAddNewRow={this.addNewRow} />;
    }

    renderDataRow() {
        const { rows, columns } = this.props;
        if (!rows || rows.length === 0) return null;

        return rows.map((row, index) => <TableEditorRow key={index} row={row} columns={columns} />);
    }

    generateDataCell(cells: any[], rowId: number) {
        const { columns } = this.props;
        return cells.map((cell, index) => {
            const textalign = columns[index].textAlign ? columns[index].textAlign! : 'left';
            return (
                <Table.Cell key={rowId + index} style={{ textAlign: textalign }}>
                    {cell}
                </Table.Cell>
            );
        });
    }

    render() {
        return (
            <Table celled color='grey'>
                {this.renderColumnHeader()}
                <Table.Body>
                    {this.renderDataRow()}
                    {this.renderNewRow()}
                </Table.Body>
            </Table>
        );
    }
}
