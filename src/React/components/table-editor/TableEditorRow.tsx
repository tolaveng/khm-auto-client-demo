import React from 'react';
import { Button, ButtonGroup, Table } from 'semantic-ui-react';
import { TableEditorDataColumn, TableEditorDataRow } from './@type';

interface TableEditorRowProp {
    columns: TableEditorDataColumn[];
    row: TableEditorDataRow;
    isNew?: boolean;
    onAddNewRow?: (newRow: TableEditorDataRow) => void;
}

interface TableEditorRowState {
    id: number;
    rowState: number;
    cells: any[];
}

const RowState = { New: 1, Edit: 2, Data: 3 };
const InitState = {
    id: 0,
    rowState: RowState.Data,
    cells: [],
};

export class TableEditorRow extends React.PureComponent<TableEditorRowProp, TableEditorRowState> {
    constructor(props: TableEditorRowProp) {
        super(props);
        this.state = InitState;

        this.initState = this.initState.bind(this);
        this.setCellValue = this.setCellValue.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.resetRow = this.resetRow.bind(this);

        this.renderRow = this.renderRow.bind(this);
        this.renderNewRow = this.renderNewRow.bind(this);
        this.renderEditRow = this.renderEditRow.bind(this);
        this.renderInputType = this.renderInputType.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);
        this.renderDataCell = this.renderDataCell.bind(this);
    }

    initState() {
        const { isNew, row, columns } = this.props;
        const cells = new Array(columns.length);
        columns.forEach((c, i) => {
            if (row.cells && row.cells[i]) {
                cells[i] = row.cells[i];
            } else {
                cells[i] = '';
            }
        });
        const id = row.id ? row.id : 0;
        this.setState({
            id: id,
            rowState: isNew ? RowState.New : RowState.Data,
            cells: cells,
        });
    }

    setCellValue(evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cellIndex: number) {
        const { columns } = this.props;
        const { cells } = this.state;
        const cellValue = evt.currentTarget.value;

        if (columns[cellIndex].maxLength && cellValue.length > columns[cellIndex].maxLength!) {
            return;
        }

        const newCells = cells.map((cell, i) => (i === cellIndex ? cellValue : cell));

        this.setState({
            ...this.state,
            cells: newCells,
        });
    }

    addNewRow() {
        const { onAddNewRow } = this.props;
        const { id, rowState, cells } = this.state;
        if (onAddNewRow) {
            onAddNewRow({ id, cells });
        }
        this.initState();
    }

    resetRow() {
        this.initState();
    }

    componentDidMount() {
        this.initState();
    }

    renderDataRow() {
        const { row, columns } = this.props;
        const { cells } = this.state;
        const rowId = row.id ? row.id : Math.floor(Date.now() * Math.random());
        return (
            <Table.Row key={`row_${rowId}`}>
                {cells.map((cell, index) => this.renderDataCell(rowId, cell, index))}
                <Table.Cell key={rowId + columns.length}>
                    <ButtonGroup>
                        <Button basic icon='pencil'></Button>
                        <Button basic icon='trash'></Button>
                    </ButtonGroup>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderDataCell(rowId: number, cell: any, cellIndex: number) {
        const { columns } = this.props;
        const column = columns[cellIndex];
        const align = column.textAlign ? column.textAlign! : 'left';

        return (
            <Table.Cell key={rowId + cellIndex} style={{ padding: 4, textAlign: align }}>
                {cell}
            </Table.Cell>
        );
    }

    renderNewRow() {
        const { row, columns } = this.props;
        const { cells } = this.state;
        const rowId = row.id ? row.id : 0;

        return (
            <Table.Row key={`new_row_${rowId}`}>
                {cells.map((cell, index) => (
                    <Table.Cell key={rowId + index} style={{ padding: 4 }}>
                        {this.renderInputType(rowId, cell, index)}
                    </Table.Cell>
                ))}
                <Table.Cell key={rowId + columns.length}>
                    <ButtonGroup>
                        <Button basic icon='add' onClick={this.addNewRow}></Button>
                        <Button basic icon='cancel' onClick={this.resetRow}></Button>
                    </ButtonGroup>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderEditRow() {
        const { row, columns } = this.props;

        const rowId = row.id ? row.id : 0;
        const cells = columns.map((column, index) => (
            <Table.Cell key={rowId + index} style={{ padding: 4 }}>
                {this.renderInputType(rowId, column, index)}
            </Table.Cell>
        ));

        return (
            <Table.Row key={`edit_row_${rowId}`}>
                {cells}
                <Table.Cell key={rowId + columns.length}>
                    <ButtonGroup>
                        <Button basic icon='add'></Button>
                        <Button basic icon='cancel'></Button>
                    </ButtonGroup>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderInputType(rowId: number, cell: any, cellIndex: number) {
        const { row, columns } = this.props;
        const column = columns[cellIndex];

        const cellName = `${rowId}_${cellIndex}`;
        const isRequired = column.required;
        const align = column.textAlign && column.textAlign === 'right' ? 'right' : 'left';
        switch (column.type) {
            case 'textarea':
                return (
                    <textarea
                        value={cell}
                        name={cellName}
                        key={cellName}
                        onChange={(e) => this.setCellValue(e, cellIndex)}
                        style={{ padding: 4 }}
                        rows={1}
                        required= {isRequired}
                    />
                );
            default:
                return (
                    <input
                        type={column.type}
                        name={cellName}
                        key={cellName}
                        value={cell}
                        onChange={(e) => this.setCellValue(e, cellIndex)}
                        maxLength={column.maxLength}
                        required={isRequired}
                        style={{ padding: 4, textAlign: align }}
                    />
                );
        }
    }

    renderRow() {
        const { rowState } = this.state;
        if (rowState === RowState.New) {
            return this.renderNewRow();
        } else if (rowState === RowState.Data) {
            return this.renderDataRow();
        }
    }

    render() {
        return <>{this.renderRow()}</>;
    }
}
