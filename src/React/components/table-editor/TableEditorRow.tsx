import React, { createRef } from 'react';
import { Button, ButtonGroup, Input, Ref, Table } from 'semantic-ui-react';
import { TableEditorTextArea } from './TableEditorTextArea';
import { TableEditorDataColumn, TableEditorDataRow } from './type';

interface TableEditorRowProp {
    columns: TableEditorDataColumn[];
    row: TableEditorDataRow;
    isNew?: boolean;
    onRowUpdated?: (row: TableEditorDataRow) => void;
    onRowDeleted?: (rowId: number) => void;
    onChange?: (rowId: number, columnId: number, value: any) => void;
}

interface TableEditorCell {
    data: any;
    type: string;
    isInValid?: boolean;
    isRequired?: boolean;
    error?: string;
    maxLength?: number;
}

interface TableEditorRowState {
    rowId: number;
    rowState: number;
    cells: TableEditorCell[];
    isNew: boolean;
    isChanged: boolean;
}

const RowState = { Edit: 1, View: 2 };
const InitState: TableEditorRowState = {
    rowId: 0,
    rowState: RowState.View,
    cells: [],
    isNew: true,
    isChanged: false
};

export class TableEditorRow extends React.Component<TableEditorRowProp, TableEditorRowState> {
    private tableRowRef = createRef<HTMLElement>();

    constructor(props: TableEditorRowProp) {
        super(props);
        this.state = InitState;

        this.initState = this.initState.bind(this);
        this.cellInputValueChange = this.cellInputValueChange.bind(this);
        this.cellInputKeyPress = this.cellInputKeyPress.bind(this);
        this.validateRequiredCells = this.validateRequiredCells.bind(this);
        this.editRow = this.editRow.bind(this);
        this.resetRow = this.resetRow.bind(this);
        this.saveRow = this.saveRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);

        this.renderRow = this.renderRow.bind(this);
        this.renderEditRow = this.renderEditRow.bind(this);
        this.renderInputType = this.renderInputType.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);
        this.renderDataCell = this.renderDataCell.bind(this);

        this.clickOutsideHandler = this.clickOutsideHandler.bind(this);
    }

    static deriveDataCellsFromProps(props: TableEditorRowProp): TableEditorCell[] {
        const { columns, row } = props;
        const cells: TableEditorCell[] = new Array(columns.length);
        columns.forEach((c, i) => {
            if (row.cells && row.cells[i]) {
                cells[i] = {
                    data: row.cells[i],
                    type: c.type ?? 'text',

                };
            } else {
                cells[i] = {
                    data: c.default ?? '',
                    type: c.type ?? 'text',
                };
            }
            cells[i].maxLength = c.maxLength;
            cells[i].isRequired = c.required;
        });
        return cells;
    }

    initState() {
        const { isNew, row, columns } = this.props;
        const id = row.id ? row.id : (-1 * Date.now());
        const cells = TableEditorRow.deriveDataCellsFromProps(this.props);

        this.setState({
            rowId: id,
            isNew: isNew ? isNew : false,
            rowState: isNew ? RowState.Edit : RowState.View,
            cells: cells,
        });
    }

    cellInputValueChange(evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined, value: string, cellIndex: number) {
        if (evt) {
            evt.preventDefault();
        }
        const { columns, row, onChange } = this.props;
        const { cells } = this.state;
        const cellValue = value;

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
            rowState: RowState.Edit,
            isChanged: true,
        }, function () {
            if (onChange) {
                onChange(row.id ? row.id : -1, cellIndex, cellValue)
            }
        });
    }

    cellInputKeyPress(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, cellIndex: number): void {
        const { rowState } = this.state;
        if (!evt.shiftKey && evt.key === 'Enter') {
            evt.preventDefault();
            if (rowState == RowState.Edit) this.saveRow();
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



    deleteRow(evt?: React.MouseEvent) {
        if (evt) evt.preventDefault();
        
        const { onRowDeleted } = this.props;
        if (onRowDeleted) {
            onRowDeleted(this.state.rowId);
        }
    }

    saveRow() {
        const { onRowUpdated } = this.props;
        const { rowId, cells, rowState, isNew, isChanged } = this.state;

        if (rowState != RowState.Edit) return;
        if (!isChanged) return;
        if (!this.validateRequiredCells()) return;

        this.setState({
            ...this.state,
            rowState: RowState.View,
            isNew: false,
            isChanged: false
        });


        if (onRowUpdated) {
            const cellData = cells.map((c) => c.data);
            onRowUpdated({ id: rowId, isNew: isNew, cells: cellData });
        }
    }

    resetRow(e: React.MouseEvent) {
        e.preventDefault();
        this.initState();
    }

    editRow() {
        if (this.state.rowState == RowState.Edit) return;
        this.setState({
            ...this.state,
            rowState: RowState.Edit,
            isChanged: true
            //isRowFocus: true
        });
    }

    static getDerivedStateFromProps(props: TableEditorRowProp, state: TableEditorRowState) {
        // Reset new row state after parent props changed (parent re-render)
        if (props.isNew && !state.isNew) {
            const id = props.row.id ? props.row.id : (-1 * Date.now());
            const cells = TableEditorRow.deriveDataCellsFromProps(props);
    
            return {
                rowId: id,
                isNew: props.isNew,
                rowState: props.isNew ? RowState.Edit : RowState.View,
                cells: cells,
            };
        }

        // Update state in data view, after finish editing
        if (!props.isNew && props.row.id === state.rowId && state.rowState == RowState.View) {
            const cells = TableEditorRow.deriveDataCellsFromProps(props);
            let shouldUpdate = false;
            for (let i = 0; i < cells.length; i++) {
                if (cells[i] !== state.cells[i]) {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                return {
                    cells
                };
            }
        }

        return null;
    }

    // static getDerivedStateFromProps(props: TableEditorRowProp, state: TableEditorRowState) {
    //     debugger;
    //     if (props.isNew != state.isNew) {
    //         const cells = TableEditorRow.deriveDataCellsFromProps(props);
    //         return {
    //             rowId: props.row.id ? props.row.id : (-1 * Date.now()),
    //             rowState: props.isNew ? RowState.Edit : state.rowState,
    //             cells,
    //             isNew: props.isNew
    //         };
    //     }

    //     // should update data in view state
    //     if (!state.isNew && props.row.id === state.rowId && state.rowState == RowState.View) {
    //         const cells = TableEditorRow.deriveDataCellsFromProps(props);
    //         let shouldUpdate = false;
    //         for (let i = 0; i < cells.length; i++) {
    //             if (cells[i] !== state.cells[i]) {
    //                 shouldUpdate = true;
    //                 break;
    //             }
    //         }
    //         if (shouldUpdate) {
    //             return {
    //                 cells
    //             };
    //         }
    //     }
    //     return null;
    // }


    componentDidMount() {
        this.initState();
        document.addEventListener('click', this.clickOutsideHandler, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.clickOutsideHandler, true);
    }

    clickOutsideHandler(evt) {
        if (!evt) return;

        const node = this.tableRowRef.current;
        if (node && !node.contains(evt.target)) {
            this.saveRow();
        }
    }

    renderDataRow() {
        const { columns } = this.props;
        const { rowId, cells } = this.state;
        return (
            <Table.Row key={`row_${rowId}`}>
                {cells.map((cell, index) => this.renderDataCell(rowId, cell, index))}
                <Table.Cell key={`${rowId}_${columns.length}`}>
                    <ButtonGroup>
                        <Button type='button' basic icon='trash' onClick={this.deleteRow} title={'Delete' + rowId}></Button>
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
            <Table.Cell key={`${rowId}_${cellIndex}`} style={{ textAlign: align }} onClick={this.editRow}>
                {cell.data}
            </Table.Cell>
        );
    }


    renderEditRow() {
        const { row, columns } = this.props;
        const { rowId, cells } = this.state;
        const key = rowId ? rowId : -1;
        return (
            <Ref innerRef={this.tableRowRef}>
                <Table.Row key={`edit_row_${rowId}`} className='table-editor-row-edit'>
                    {cells.map((cell, index) => (
                        <Table.Cell key={`edit_${rowId}_${index}`} className='table-editor-cell-edit'>{this.renderInputType(rowId, cell, index)}</Table.Cell>
                    ))}
                    <Table.Cell key={rowId + columns.length}>
                        <ButtonGroup>
                            <Button type='button' basic icon='cancel' onClick={this.resetRow} title={'Cancel' + rowId}></Button>
                        </ButtonGroup>
                    </Table.Cell>
                </Table.Row>
            </Ref>
        );
    }

    renderInputType(rowId: number, cell: TableEditorCell, cellIndex: number) {
        const { columns } = this.props;
        const column = columns[cellIndex];
        const autoCompletData = column.autoCompletData ? column.autoCompletData : [];
        const cellName = `cell_${rowId}_${cellIndex}`;
        const align = column.textAlign && column.textAlign === 'right' ? 'right' : 'left';

        switch (column.type) {
            case 'textarea':
                return (
                    <TableEditorTextArea
                        value={cell.data}
                        name={cellName}
                        key={cellName}
                        onTextChange={(e, val) => this.cellInputValueChange(e, val, cellIndex)}
                        onKeyPress={(e) => this.cellInputKeyPress(e, cellIndex)}
                        rows={3}
                        className={`table-editor-input ${cell.isInValid ? 'table-editor-input-error' : ''}`}
                        autoCompleteData={autoCompletData}
                    
                    />
                );
            default:
                return (
                    <Input
                        type={column.type}
                        name={cellName}
                        key={cellName}
                        value={cell.data}
                        onChange={(e) => this.cellInputValueChange(e, e.target.value, cellIndex)}
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
        if (rowState === RowState.Edit) {
            return this.renderEditRow();
        } else {
            return this.renderDataRow();
        }
    }

    render() {
        return <>{this.renderRow()}</>;
    }
}
