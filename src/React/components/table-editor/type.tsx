import { CSSProperties } from "react";


export interface TableEditorDataColumn {
    name: string;
    style?: CSSProperties;
    type?: string;
    required?: boolean;
    maxLength?: number;
    readOnly?: boolean;
    default?: any;
    autoCompletData?: string[];
}

export interface TableEditorDataRow {
    id?: number;
    cells: any[] | null;
    isNew?: boolean;
}
