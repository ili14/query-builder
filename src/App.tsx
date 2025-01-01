import "./App.css";
import React, {useCallback, useMemo, useState} from "react";
import {
    Box,
    Card,
    Grid2 as Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {PiFileSqlFill} from "react-icons/pi";
import {FaTable} from "react-icons/fa";
import {Editor} from "@monaco-editor/react";
import DiagramSection from "./DiagramSection";
import SelectedTableSection from "./SelectedTableSection";
import QueryChangerSection from "./QueryChangerSection";
import {Context} from "react-zoom-pan-pinch";
import {
    CheckEntireTableColumnsHandler,
    CheckSingleColumnHandler,
    EntireDiagramSectionContext
} from "./Contexts/DiagramSectionContext";

// ! this array is simulate of table with columns comes from server
const listOfTablesWithColumns: TableWithColumns[] = [
    {
        id: 0,
        name: "users",
        columns: [
            {name: "id"},
            {name: "name"},
            {name: "email"}, // example additional column
            {name: "createdAt"} // example additional column
        ]
    },
    {
        id: 1,
        name: "images",
        columns: [
            {name: "id"},
            {name: "imageName"},
            {name: "userId", relationship: [{targetColumn: 'id', targetTable: "users"}]}, // userId references users table
            {name: "imageUrl"} // example additional column
        ]
    },
    {
        id: 2,
        name: "admins",
        columns: [
            {name: "id"},
            {name: "adminName"},
            {name: "email"},
            {name: "role"} // example additional column
        ]
    },
    {
        id: 3,
        name: "categories",
        columns: [
            {name: "id"},
            {name: "categoryName"},
            {name: "description"} // example additional column
        ]
    },
    {
        id: 4,
        name: "tags",
        columns: [
            {name: "id"},
            {name: "tagName"}
        ]
    },
    {
        id: 5,
        name: "products",
        columns: [
            {name: "id"},
            {name: "productName"},
            {name: "categoryId", relationship: [{targetColumn: 'id', targetTable: "categories"}]}, // categoryId references categories table
            {name: "price"},
            {name: "stock"}
        ]
    },
    {
        id: 6,
        name: "notifications",
        columns: [
            {name: "id"},
            {name: "message"},
            {name: "userId", relationship: [{targetColumn: 'id', targetTable: "users"}]},
            {name: "timestamp"}
        ]
    },
    {
        id: 7,
        name: "addresses",
        columns: [
            {name: "id"},
            {name: "userId", relationship: [{targetColumn: 'id', targetTable: "users"}]},
            {name: "address"}
        ]
    },
    {
        id: 8,
        name: "payments",
        columns: [
            {name: "id"},
            {name: "orderId", relationship: [{targetColumn: 'id', targetTable: "orders"}]}, // orderId references orders table
            {name: "paymentStatus"},
            {name: "amount"}
        ]
    },
    {
        id: 9,
        name: "orders",
        columns: [
            {name: "id"},
            {name: "userId", relationship: [{targetColumn: 'id', targetTable: "users"}]},
            {name: "totalAmount"},
            {name: "status"}
        ]
    },
    {
        id: 10,
        name: "wishlists",
        columns: [
            {name: "id"},
            {name: "userId", relationship: [{targetColumn: 'id', targetTable: "users"}]},
            {name: "productId", relationship: [{targetColumn: 'id', targetTable: "products"}]}, // productId references products table
        ]
    },
];

// ! this array is simulate of tables without columns comes from server
const listOfTables: Table[] = [
    {
        id: 0,
        name: "users",
    },
    {
        id: 1,
        name: "images",
    },
    {
        id: 2,
        name: "admins",
    },
    {
        id: 3,
        name: "categories",
    },
    {
        id: 4,
        name: "tags",
    },
    {
        id: 5,
        name: "products",
    },
    {
        id: 4,
        name: "notifications",
    },
    {
        id: 4,
        name: "addresses",
    },
    {
        id: 4,
        name: "payments",
    },
    {
        id: 4,
        name: "orders",
    },
    {
        id: 4,
        name: "wishlists",
    },
]


function App(): JSX.Element {
    const [tables, setTables] = useState<Table[]>(listOfTables);
    const [diagramsTable, setDiagramsTable] = useState<TableWithColumns[]>([]);
    const [lastTableWithColumnsSelected, setLastTableWithColumnsSelected] = useState<Table | null>(null);
    const [builtQuery, setbuiltQuery] = useState<string>('');

    const draggingTableWithColumnsRef = React.useRef<TableWithColumns>(undefined);

    const queryingColumnsTables = useMemo(() => {
        return diagramsTable.map((table) => {
            return {...table, name: table.name, columns: table?.columns?.filter((column) => column.checked)}
        });
    }, [diagramsTable]);

    const handleCheckSingleColumn: CheckSingleColumnHandler = useCallback((tableName, columnName, checked) => {
        console.log('checked', tableName, columnName, checked);
        setDiagramsTable(() => {
            const newTables = diagramsTable.map((table) => {
                if (table.name === tableName) {
                    const newColumns = table?.columns?.map((column) => {
                        if (column.name === columnName) {
                            return {...column, checked};
                        }
                        return column;
                    });
                    return {...table, columns: newColumns};
                }
                return table;
            });
            return newTables;
        });
    }, [diagramsTable]);

    const handleCheckEntireTableColumns: CheckEntireTableColumnsHandler = useCallback((tableName, checked) => {
        console.log('checked', tableName, checked);
        setDiagramsTable(() => {
            const newTables = diagramsTable.map((table) => {
                if (table.name === tableName) {
                    const newColumns = table?.columns?.map((column) => {

                        return {...column, checked};

                    });
                    return {...table, columns: newColumns};
                }
                return table;
            });
            return newTables;
        });
    }, [diagramsTable]);

    const handleQueryChange = useCallback((query: string) => {
        setbuiltQuery(query);
    }, []);

    const getTableWithColumns = useCallback((table: Table) => {
        // Todo replace bellow line must be replaced with api call and get Table from server
        const newTableWithColumns = listOfTablesWithColumns.find((t) => t.name === table.name);
        return newTableWithColumns;
    }, []);

    const updateDiagramWithTableWithColumns = useCallback((tableWithColumns?: TableWithColumns) => {
        if (tableWithColumns) {
            setLastTableWithColumnsSelected(tableWithColumns);
            if (diagramsTable.some((t) => t.name === tableWithColumns.name)) {
                const newTables = diagramsTable.filter((t) => t.name !== tableWithColumns.name);
                setDiagramsTable(newTables);
            } else {
                const newTables = [...diagramsTable, tableWithColumns];
                setDiagramsTable(newTables);
            }
        } else {
            alert('table not found');
        }
    }, [diagramsTable]);

    const handleTablesSectionDragStart = useCallback((table: Table) => {
        const newTableWithColumns = getTableWithColumns(table);
        if (newTableWithColumns)
            draggingTableWithColumnsRef.current = newTableWithColumns;
    }, [getTableWithColumns]);

    const handleDiagramSectionDrop = useCallback(() => {
        if (draggingTableWithColumnsRef?.current)
            updateDiagramWithTableWithColumns(draggingTableWithColumnsRef.current)
    }, [updateDiagramWithTableWithColumns]);

    return (
        <Box>
            <Typography variant="h4" display={'flex'} alignItems={'center'} gap={2} p={1}
                        height={'60px'}>
                <PiFileSqlFill/>
                Query Builder
            </Typography>
            <Box gap={2}
                 p={1}
                 className="[&_.cell]:bg-red-500 [&_.cell]:rounded-xl h-[calc(100vh_-_60px)] flex flex-col "
            >
                <Grid container spacing={2} height={'60%'}>
                    <Grid className="cell h-full" size={3}>
                        <Card variant={"outlined"} className='w-full h-full overflow-hidden'>
                            <TableListSection
                                tables={tables}
                                onClickTable={(table) => {
                                    const newTableWithColumns = listOfTablesWithColumns.find((t) => t.name === table.name);
                                    if (newTableWithColumns) {
                                        setLastTableWithColumnsSelected(newTableWithColumns);
                                    }
                                }}
                                onDragItemStart={handleTablesSectionDragStart}
                                onDoubleClickTable={(table) => {
                                    const newTableWithColumns = getTableWithColumns(table);
                                    if (newTableWithColumns) {
                                        setLastTableWithColumnsSelected(newTableWithColumns);
                                        updateDiagramWithTableWithColumns(newTableWithColumns);
                                    }
                                }}/>
                        </Card>
                    </Grid>
                    <Grid className="cell" size={6}>
                        <Card variant={"outlined"} className='w-full h-full'>
                            <EntireDiagramSectionContext.Provider
                                value={{
                                    onCheckSingleColumn: handleCheckSingleColumn,
                                    onCheckEntireTableColumns: handleCheckEntireTableColumns
                                }}>
                                <DiagramSection onDrop={handleDiagramSectionDrop} tables={diagramsTable}/>
                            </EntireDiagramSectionContext.Provider>
                        </Card>
                    </Grid>
                    <Grid className="cell" size={3}>
                        <Card variant={"outlined"} className='w-full h-full'><MyEditor value2={builtQuery}/></Card>
                    </Grid>
                </Grid>
                <Grid container spacing={2} height={'39%'}>
                    <Grid className="cell h-full" size={3}>
                        <Card variant={"outlined"} className='w-full h-full'><SelectedTableSection
                            tableWithColumns={lastTableWithColumnsSelected}/></Card>
                    </Grid>
                    <Grid className="cell h-full" size={9}>
                        <Card variant={"outlined"} className='w-full h-full'><QueryChangerSection
                            onChangeQuery={handleQueryChange}
                            tablesWithColumns={queryingColumnsTables}/></Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

interface Table {
    id: number;
    name: string;
}

export interface TableWithColumns extends Table {
    columns?: Column[]
}

export type Column = {
    name: string,
    type?: string,
    checked?: boolean,
    relationship?: {
        targetTable: string,
        targetColumn: string
    }[],
    // [key: string]: any
}


interface TableListSectionProps {
    onClickTable?: (table: Table) => void;
    onDoubleClickTable?: (table: Table) => void;
    onDragItemStart?: (table: Table) => void;
    tables?: Table[];
}

function TableListSection({onClickTable, onDoubleClickTable, onDragItemStart, tables}: TableListSectionProps) {
    return <>
        <List sx={{maxHeight: '100%'}} className={'!overflow-auto'} subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                Tables
            </ListSubheader>
        }>
            {tables?.map((table, index) => {

                return (
                    <ListItem
                        key={index}
                        onDragStart={() => {
                            if (onDragItemStart)
                                onDragItemStart(table)
                        }}
                        onDoubleClick={() => {
                            if (onDoubleClickTable)
                                onDoubleClickTable(table);
                        }}
                        onClick={() => {
                            if (onClickTable)
                                onClickTable(table);
                        }}
                        draggable
                        disablePadding
                        className={'relative [&:last-child>.line]:hidden bg-transparent active:bg-blue-50'}>
                        <ListItemButton>
                            <ListItemIcon className="!text-blue-500 ">
                                <FaTable/>
                            </ListItemIcon>
                            <ListItemText primary={table.name}/>
                        </ListItemButton>
                        <div className="h-[1px] bg-blue-500 absolute bottom-0 left-4 right-4 opacity-20 line"></div>
                    </ListItem>
                );
            })}

        </List>
    </>

}

interface MyEditorProps {
    value2?: string
}

function MyEditor({value2}: MyEditorProps) {
    const [code, setCode] = useState<string | undefined>('SELECT * FROM users WHERE id > 10 AND email LIKE "%example.com%"');
    return <Box height={"100%"}>
        <Editor className="h-full" options={{wordWrap: "on",}}
                defaultLanguage="sql" defaultValue="// some comment" value={value2}/>
    </Box>
}

export default App;
