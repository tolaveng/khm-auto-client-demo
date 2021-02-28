

export interface TableEditorDataColumn {
    name: string;
    collapse?: boolean;
    type?: string;
    required?: boolean;
    textAlign?: string;
    maxLength?: number;
    readOnly?: boolean;
    default?: any;
}

export interface TableEditorDataRow {
    id?: number;
    cells: any[] | null;
}
