import React, {useEffect, useMemo, useState} from 'react'
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {TableWithColumns} from "../App";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const rows = [
    {id: 1, name: 'Snow', alias: 'Jon', sortingType: 35, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 2, name: 'Lannister', alias: 'Cersei', sortingType: 42, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 3, name: 'Lannister', alias: 'Jaime', sortingType: 45, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 4, name: 'Stark', alias: 'Arya', sortingType: 16, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 5, name: 'Targaryen', alias: 'Daenerys', sortingType: null, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 6, name: 'Melisandre', alias: null, sortingType: 150, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 7, name: 'Clifford', alias: 'Ferrara', sortingType: 44, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 8, name: 'Frances', alias: 'Rossini', sortingType: 36, sortOrder: 0, GroupBy: true, Aggregate: ''},
    {id: 9, name: 'Roxie', alias: 'Harvey', sortingType: 65, sortOrder: 0, GroupBy: true, Aggregate: ''},
];

enum SORTING_TYPES {
    ASC = "Ascending", DESC = "Descending", UNSORTED = "Unsorted"
}

//12
enum AGGREGATE_TYPES {
    NONE = "none",
    COUNT = "Count",
    MAX = 'MAX',
    MIN = 'MIN',
    AVG = 'AVG',
    SUM = 'SUM',
    COUNT_DISTINCT = "Count Distinct",
    AVG_DISTINCT = 'Avg Distinct',
    SUM_DISTINCT = 'Sum Distinct',
}

interface ConfigurableColumnProperties {
    tableName: string;
    columnName: string;
    type?: string;
    alias?: string;
    sortingType?: SORTING_TYPES;
    sortOrder?: number;
    GroupBy?: boolean;
    Aggregate?: AGGREGATE_TYPES;
}

interface QueryChangerSectionProps {
    tablesWithColumns?: TableWithColumns[]
}

const paginationModel = {page: 0, pageSize: 5};

const Index: React.FC<QueryChangerSectionProps> = ({tablesWithColumns}) => {
    const [configurableColumns, setConfigurableColumns] = useState<ConfigurableColumnProperties[]>([]);

    useEffect(() => {
        if (tablesWithColumns) {
            const newConfigurableColumns: ConfigurableColumnProperties[] = tablesWithColumns?.flatMap((table) => {
                return table.columns?.flatMap(column => {
                    const foundColumnOfTable = configurableColumns.find((co) => co.tableName === table.name && co.columnName === column.name);
                    if (!foundColumnOfTable)
                        return {
                            tableName: table.name,
                            columnName: column.name,
                            type: column.type
                        } as ConfigurableColumnProperties;
                    else return foundColumnOfTable;
                }) ?? [];
            });
            setConfigurableColumns(newConfigurableColumns);
        }
    }, [tablesWithColumns]);


    const columns: GridColDef[] = useMemo(() => ([
        {field: 'tableName', headerName: 'Table', width: 70},
        {field: 'columnName', headerName: 'Column', width: 70},
        {field: 'alias', headerName: 'Alias', width: 130, type: 'string'},
        {
            field: 'sortingType', headerName: 'Sorting Type', width: 200 , type: 'number',
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties;
                return <div className='p-1  flex items-center h-full'>
                    <FormControl className={'w-full '} size="small">
                        <InputLabel id="demo-simple-select-label">Sorting Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className={'h-full'}
                            id="demo-simple-select"
                            value={row.sortingType}
                            label="Sorting Type"
                            onChange={(event, child) => {
                                const value = event.target.value as SORTING_TYPES;
                                alert(value)
                                console.log(row)
                                const newConfigurableColumns = configurableColumns.map((col) => {
                                    return {...col, sortingType: value} as ConfigurableColumnProperties;
                                });
                                setConfigurableColumns(newConfigurableColumns);
                            }}
                        >
                            {Object.values(SORTING_TYPES).map(type => <MenuItem value={type}>{type}</MenuItem>)}

                        </Select>
                    </FormControl>
                </div>
            }
        },
        {
            field: 'sortOrder',
            headerName: 'Sort Order',
            type: 'number',
            width: 90,
        },
        {
            field: 'groupBy',
            headerName: 'Group By',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
    ]), [configurableColumns]);


    return (
        <>
            <DataGrid
                rows={configurableColumns}
                columns={columns}
                onStateChange={(test) => console.log(test.rows)}
                rowHeight={56}
                // initialState={{ pagination: { paginationModel } }}
                // pageSizeOptions={[5, 10]}
                sx={{border: 0}}
            />
        </>
    )
}
export default Index
