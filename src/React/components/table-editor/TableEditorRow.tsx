import React from 'react';
import { Button, ButtonGroup, Input, Table, TextArea } from 'semantic-ui-react';
import { TableEditorDataColumn, TableEditorDataRow } from './type';
import CSS from 'csstype';

interface TableEditorRowProp {
    columns: TableEditorDataColumn[];
    row: TableEditorDataRow;
    isNew?: boolean;
    onRowAdded?: (row: TableEditorDataRow) => void;
    onRowSaved?: (row: TableEditorDataRow) => void;
    onRowDeleted?: (rowId: number) => void;
}

interface TableEditorCell {
    data: any;
    isInValid?: boolean;
    isRequired?: boolean;
    error?: string;
}

interface TableEditorRowState {
    rowId: number;
    rowState: number;
    cells: TableEditorCell[];
}


const RowState = { New: 1, Edit: 2, View: 3 };
const InitState: TableEditorRowState = {
    rowId: 0,
    rowState: RowState.View,
    cells: [],
};

export class TableEditorRow extends React.PureComponent<TableEditorRowProp, TableEditorRowState> {
    constructor(props: TableEditorRowProp) {
        super(props);
        this.state = InitState;

        this.initState = this.initState.bind(this);
        this.cellInputValueChange = this.cellInputValueChange.bind(this);
        this.cellInputKeyPress = this.cellInputKeyPress.bind(this);
        this.validateRequiredCells = this.validateRequiredCells.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.editRow = this.editRow.bind(this);
        this.resetRow = this.resetRow.bind(this);
        this.saveRow = this.saveRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);

        this.renderRow = this.renderRow.bind(this);
        this.renderNewRow = this.renderNewRow.bind(this);
        this.renderEditRow = this.renderEditRow.bind(this);
        this.renderInputType = this.renderInputType.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);
        this.renderDataCell = this.renderDataCell.bind(this);
    }

    initState() {
        const { isNew, row, columns } = this.props;
        const id = row.id ? row.id : (-1 * Date.now());
        const cells: TableEditorCell[] = new Array(columns.length);
        columns.forEach((c, i) => {
            if (row.cells && row.cells[i]) {
                cells[i] = { data: row.cells[i] };
            } else {
                cells[i] = { data: '' };
            }
        });

        this.setState({
            rowId: id,
            rowState: isNew ? RowState.New : RowState.View,
            cells: cells,
        });
    }

    cellInputValueChange(evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cellIndex: number) {
        const { columns } = this.props;
        const { cells } = this.state;
        const cellValue = evt.currentTarget.value;

        if (columns[cellIndex].maxLength && cellValue.length > columns[cellIndex].maxLength!) {
            return;
        }

        const updateCells = cells.map((cell, i) => {
            if (i === cellIndex) cell.data = cellValue;
            return cell;
        });

        if (columns[cellIndex].required && cellValue === '') {
            updateCells[cellIndex].isRequired = true;
            updateCells[cellIndex].isInValid = true;
            updateCells[cellIndex].error = 'Field is required';
        } else {
            updateCells[cellIndex].isInValid = false;
            updateCells[cellIndex].error = '';
        }

        this.setState({
            ...this.state,
            cells: updateCells,
        });
    }

    cellInputKeyPress(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, cellIndex: number) {
        if (!evt.shiftKey && evt.key === 'Enter') {
            console.log('enter press');
            evt.preventDefault();
            this.addNewRow();
        }
    }

    validateRequiredCells(): boolean {
        const { cells } = this.state;
        const { columns } = this.props;
        let isValid = true;

        const updateCells = cells.map((cell, i) => {
            if (columns[i].required && (!cell.data || cell.data === '')) {
                cell.isInValid = true;
                cell.isRequired = true;
                cell.error = 'Field is required';
                isValid = false;
                console.log('invalid cell', i);
            } else {
                cell.isInValid = false;
                cell.error = '';
            }
            return cell;
        });

        this.setState({
            ...this.state,
            cells: updateCells,
        });
        return isValid;
    }

    addNewRow() {
        const { onRowAdded } = this.props;
        const { rowId, rowState, cells } = this.state;
        if (!this.validateRequiredCells()) {
            console.log('invalid');
            return;
        }
        if (onRowAdded) {
            const cellData = cells.map(c => c.data);
            onRowAdded({ id: rowId, cells: cellData });
        }
        this.initState();
    }

    
    editRow() {
        this.setState({
            ...this.state, rowState: RowState.Edit
        });
    }

    deleteRow() {
        const { onRowDeleted } = this.props;
        if (onRowDeleted) {
            onRowDeleted(this.state.rowId);
        }
    }


    saveRow() {
        const { onRowSaved } = this.props;
        const { rowId, rowState, cells } = this.state;
        if (!this.validateRequiredCells()) {
            console.log('invalid');
            return;
        }
        if (onRowSaved) {
            console.log('call row save');
            onRowSaved({ id: rowId, cells });
        }
        console.log('saved');
        this.setState({
            ...this.state,
            rowState: RowState.View
        })
    }


    resetRow() {
        this.initState();
    }

    componentDidMount() {
        this.initState();
    }

    renderDataRow() {
        const { columns } = this.props;
        const { rowId, cells } = this.state;
        return (
            <Table.Row key={`row_${rowId}`} onDoubleClick={this.editRow}>
                {cells.map((cell, index) => this.renderDataCell(rowId, cell, index))}
                <Table.Cell key={`${rowId}_${columns.length}`}>
                    <ButtonGroup>
                        <Button basic icon='pencil' onClick={this.editRow}></Button>
                        <Button basic icon='trash' onClick={this.deleteRow}></Button>
                    </ButtonGroup>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderDataCell(rowId: number, cell: TableEditorCell, cellIndex: number) {
        const { columns } = this.props;
        const column = columns[cellIndex];
        const align = column.textAlign ? column.textAlign! : 'left';

        return (
            <Table.Cell key={`${rowId}_${cellIndex}`} style={{ textAlign: align, padding: 8}}>
                {cell.data}
            </Table.Cell>
        );
    }

    renderNewRow() {
        const { columns } = this.props;
        const { cells } = this.state;
        const rowId = -1;

        return (
            <Table.Row key={`new_row_${rowId}`}>
                {cells.map((cell, index) => (
                    <Table.Cell key={`new_cell_${rowId}_${index}`}>
                        {this.renderInputType(rowId, cell, index)}
                    </Table.Cell>
                ))}
                <Table.Cell key={`${rowId}_${columns.length}`}>
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
        const { rowId, cells } = this.state;

        return (
            <Table.Row key={`edit_row_${rowId}`}>
                {cells.map((cell, index) => (
                    <Table.Cell key={`edit_${rowId}_${index}`}>
                        {this.renderInputType(rowId, cell, index)}
                    </Table.Cell>
                ))}
                <Table.Cell key={rowId + columns.length}>
                    <ButtonGroup>
                        <Button basic icon='save' onClick={this.saveRow}></Button>
                        <Button basic icon='cancel' onClick={this.resetRow}></Button>
                    </ButtonGroup>
                </Table.Cell>
            </Table.Row>
        );
    }

    renderInputType(rowId: number, cell: TableEditorCell, cellIndex: number) {
        const { columns } = this.props;
        const column = columns[cellIndex];

        const cellName = `cell_${rowId}_${cellIndex}`;
        const align = column.textAlign && column.textAlign === 'right' ? 'right' : 'left';
        
        switch (column.type) {
            case 'textarea':
                return (
                    <TextArea
                        value={cell.data}
                        name={cellName}
                        key={cellName}
                        onChange={(e) => this.cellInputValueChange(e, cellIndex)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                            this.cellInputKeyPress(e, cellIndex)
                        }
                        rows={1}
                        autoComplete='off'
                        className='table-editor-input'
                    />
                );
            default:
                return (
                    <Input
                        type={column.type}
                        name={cellName}
                        key={cellName}
                        value={cell.data}
                        onChange={(e) => this.cellInputValueChange(e, cellIndex)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => this.cellInputKeyPress(e, cellIndex)}
                        maxLength={column.maxLength}
                        style={{ padding: 0, textAlign: align }}
                        error={cell.isInValid}
                        autoComplete='off'
                        readOnly={column.readOnly}
                        className='table-editor-input'
                    />
                );
        }
    }

    renderRow() {
        const { rowState } = this.state;
        if (rowState === RowState.New) {
            return this.renderNewRow();
        } else if (rowState === RowState.Edit) {
            return this.renderEditRow();
        }else{
            return this.renderDataRow();
        }
    }

    render() {
        return <>{this.renderRow()}</>;
    }
}
