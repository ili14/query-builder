import React from "react";

export type CheckSingleColumnHandler = (tableName: string, columnName: string, checked: boolean) => void;
export type CheckEntireTableColumnsHandler = (tableName: string,  checked: boolean) => void;

interface EntireDiagramContext {
    onCheckSingleColumn: (tableName: string, columnName: string, checked: boolean) => void;
    onCheckEntireTableColumns: (tableName: string, checked: boolean) => void;
}

export const EntireDiagramSectionContext = React.createContext<EntireDiagramContext>({onCheckSingleColumn(){}, onCheckEntireTableColumns(){}});