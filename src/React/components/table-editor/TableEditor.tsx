import React, { createRef } from 'react';
import { TableEditorRow } from '.';
import { TableEditorDataColumn, TableEditorDataRow } from './type';
import './TableEditorStyles.css';

export interface TableEditorProp {
    columns: TableEditorDataColumn[];
    rows?: TableEditorDataRow[];
    readonly?: boolean;

    onChange?: (rowId: number, columnId: number, value: any) => void;
    onRowUpdated?: (row: TableEditorDataRow) => void;
    onRowDeleted?: (rowId: number) => void;
}

interface TableEditorState {
    shouldAutoFocus: boolean;
}

export class TableEditor extends React.Component<TableEditorProp, TableEditorState> {
    private itemRefs: any[] = [];
    //private newRowRef = createRef<TableEditorRow>();
    
    constructor(props: TableEditorProp) {
        super(props);

        this.renderColumnHeader = this.renderColumnHeader.bind(this);
        this.renderNewRow = this.renderNewRow.bind(this);
        this.renderDataRow = this.renderDataRow.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.state = {shouldAutoFocus: false};

    }

    handleKeyPress(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, rowIndex: number) {
        // enter key to set focus on next row
        if (!evt.shiftKey && evt.key === 'Enter') {
            this.setState({...this.state, shouldAutoFocus: true})
            const nextRowIndex = rowIndex + 1;
            if (this.itemRefs[nextRowIndex]
                && this.itemRefs[nextRowIndex].inputRefs[0]
                && this.itemRefs[nextRowIndex].inputRefs[0].inputRef
            ) {
                this.itemRefs[nextRowIndex].inputRefs[0].inputRef.current.focus();
            }
        } else {
            this.setState({...this.state, shouldAutoFocus: false});
        }
    }


    renderColumnHeader() {
        const { columns } = this.props;
        if (columns.length == 0) {
            return null;
        }
        const tableColumns = columns.map((column, index) => (
            <th key={index} style={{ ...column.style, textAlign: 'center' }}>
                {column.name}
            </th>
        ));

        return (
            <thead>
                <tr>
                    {tableColumns}
                    <th key='action' style={{ width: '24px' }}>
                        &nbsp;
                    </th>
                </tr>
            </thead>
        );
    }

    renderNewRow() {
        const { readonly, rows, columns, onRowUpdated, onChange } = this.props;
        if (readonly) return null;
        const rowIndex = rows && rows.length ? rows.length : 1;
        return <TableEditorRow key={-1} isNew={true} row={{ cells: null }} columns={columns}
            rowIndex={rowIndex}
            ref={el => this.itemRefs[rowIndex] = el}
            autoFocus = {this.state.shouldAutoFocus}
            onRowUpdated={onRowUpdated}
            onChange={onChange}
            onKeyPress={this.handleKeyPress} />;
    }

    renderDataRow() {
        const { rows, columns, onRowUpdated, onRowDeleted, onChange } = this.props;
        if (!rows || !Array.isArray(rows)) {
            return <tr><td>Rows property must be an array.</td></tr>
        }
        if (rows.length === 0) return null;
        return rows.map((row, index) => {
            return (<TableEditorRow key={`${row.id}_${index}`} row={row} columns={columns}
            rowIndex={index}
            ref={el => this.itemRefs[index] = el}
            onRowUpdated={onRowUpdated}
            onRowDeleted={onRowDeleted}
            onChange={onChange}
            onKeyPress={this.handleKeyPress} />)
        });
    }


    render() {
        return (
            <table className='table-editor'>
                {this.renderColumnHeader()}
                <tbody>
                    {this.renderDataRow()}
                    {this.renderNewRow()}
                </tbody>
            </table>
        );
    }
}
