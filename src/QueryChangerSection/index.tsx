import React, { useEffect, useMemo, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TableWithColumns } from '../App'
import { Checkbox, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material'

const rows = [
    { id: 1, name: 'Snow', alias: 'Jon', sortingType: 35, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 2, name: 'Lannister', alias: 'Cersei', sortingType: 42, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 3, name: 'Lannister', alias: 'Jaime', sortingType: 45, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 4, name: 'Stark', alias: 'Arya', sortingType: 16, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 5, name: 'Targaryen', alias: 'Daenerys', sortingType: null, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 6, name: 'Melisandre', alias: null, sortingType: 150, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 7, name: 'Clifford', alias: 'Ferrara', sortingType: 44, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 8, name: 'Frances', alias: 'Rossini', sortingType: 36, sortOrder: 0, GroupBy: true, Aggregate: '' },
    { id: 9, name: 'Roxie', alias: 'Harvey', sortingType: 65, sortOrder: 0, GroupBy: true, Aggregate: '' },
]

enum SORTING_TYPES {
    ASC = 'Ascending', DESC = 'Descending', UNSORTED = 'Unsorted'
}

enum AGGREGATE_TYPES {
    NONE = 'none',
    COUNT = 'Count',
    MAX = 'MAX',
    MIN = 'MIN',
    AVG = 'AVG',
    SUM = 'SUM',
    COUNT_DISTINCT = 'Count Distinct',
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

export interface RelationshipForQuery {
    sourceTable: string,
    sourceColumn: string,
    targetTable: string,
    targetColumn: string,
    joinType?: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'  // Added support for join types
}

function queryBuilder(configurableColumns: ConfigurableColumnProperties[],
                      relationship?: RelationshipForQuery[]): string {
    const selectColumns: { column: string, sortOrder: number }[] = []
    const selectAggregateColumns: { column: string, sortOrder: number }[] = []
    const groupByColumns: string[] = []
    const AggregateByColumns: string[] = []
    const orderByClauses: { column: string, sortOrder: number, direction: string }[] = []
    let fromTables: Set<string> = new Set()
    let joinClauses: string[] = []

    configurableColumns.forEach(column => {
        // Keep track of all tables referenced
        fromTables.add(column.tableName)

        let columnExpression = `${column.tableName}.${column.columnName}`
        let columnAggregateExpression = `${column.tableName}.${column.columnName}`

        // Handle Aggregates
        if (column.Aggregate && column.Aggregate !== AGGREGATE_TYPES.NONE) {
            const aggregateFunction = column.Aggregate
            columnAggregateExpression = `${aggregateFunction}(${columnExpression})`
            AggregateByColumns.push(columnAggregateExpression)
        }

        // Handle Grouping
        if (column.GroupBy) {
            groupByColumns.push(columnExpression)
        }

        // Handle Sorting: collect sorting columns and their respective sortOrder
        if (column.sortingType) {
            const sortDirection = column.sortingType === SORTING_TYPES.ASC ? 'ASC' :
                column.sortingType === SORTING_TYPES.DESC ? 'DESC' : ''
            orderByClauses.push({
                column: columnExpression,
                sortOrder: column.sortOrder ?? 0,
                direction: sortDirection,
            })
        }

        // Handle Alias
        if (column.alias) {
            columnExpression = `${columnExpression} AS "${column.alias}"`
            columnAggregateExpression = `${columnAggregateExpression} AS ${column.alias}`
        }

        // Add the column expression and its sortOrder to selectColumns
        selectColumns.push({ column: columnExpression, sortOrder: column.sortOrder ?? 0 })
        selectAggregateColumns.push({ column: columnAggregateExpression, sortOrder: column.sortOrder ?? 0 })

    })

    if (relationship && relationship.length > 0) {
        relationship.forEach(rel => {
            // Ensure both tables involved in the relationship are included in the FROM clause
            fromTables.add(rel.targetTable)

            // Set the default join type to INNER if not specified
            const joinType = rel.joinType ? rel.joinType : 'INNER'

            // Construct the JOIN clause with the specified join type (INNER, LEFT, etc.)
            const joinClause = `${joinType} JOIN ${rel.targetTable} ON ${rel.sourceTable}.${rel.sourceColumn} = ${rel.targetTable}.${rel.targetColumn}`
            joinClauses.push(joinClause)
        })
    }

    // Sort selectColumns by sortOrder (ascending order)
    selectColumns.sort((a, b) => a.sortOrder - b.sortOrder)
    selectAggregateColumns.sort((a, b) => a.sortOrder - b.sortOrder)

    // Construct the SELECT clause with sorted selectColumns
    const selectClause = `SELECT ${selectAggregateColumns.map(col => col.column).join(', ')}`

    // Construct the FROM clause (this will include all tables from `fromTables`)
    const fromClause = `FROM ${Array.from(fromTables).join(', ')}`

    // Construct the JOIN clauses (if any)
    const joinClause = joinClauses.length > 0 ? joinClauses.join(' ') : ''

    // Construct the GROUP BY clause if applicable
    const groupByClause = groupByColumns.length > 0 ? `GROUP BY ${groupByColumns.join(', ')}` : ''

    // Construct the ORDER BY clause if applicable
    const orderByClause = orderByClauses.length > 0 ? `ORDER BY ${orderByClauses.map(order => `${order.column} ${order.direction}`).join(', ')}` : ''

    // Combine everything to build the full query
    let query = `${selectClause} ${fromClause} ${joinClause} ${groupByClause} ${orderByClause}`

    return query.trim()
}


interface QueryChangerSectionProps {
    tablesWithColumns?: TableWithColumns[];
    onChangeQuery: (query: string) => void;
    relationships?: RelationshipForQuery[]
}

const paginationModel = { page: 0, pageSize: 5 }

const Index: React.FC<QueryChangerSectionProps> = ({ tablesWithColumns, onChangeQuery, relationships }) => {
    const [configurableColumns, setConfigurableColumns] = useState<ConfigurableColumnProperties[]>([])

    useEffect(() => {
        if (tablesWithColumns) {
            const newConfigurableColumns: ConfigurableColumnProperties[] = tablesWithColumns?.flatMap((table) => {
                return table.columns?.flatMap(column => {
                    const foundColumnOfTable = configurableColumns.find((co) => co.tableName === table.name && co.columnName === column.name)

                    if (!foundColumnOfTable) {
                        return {
                            tableName: table.name,
                            columnName: column.name,
                            type: column.type,
                            relationship: column.relationship,
                        } as ConfigurableColumnProperties
                    } else return foundColumnOfTable
                }) ?? []
            })
            setConfigurableColumns(newConfigurableColumns)
        }
    }, [tablesWithColumns])


    const columns: GridColDef[] = useMemo(() => ([
        { field: 'tableName', headerName: 'Table', width: 130 },
        { field: 'columnName', headerName: 'Column', width: 130 },

        {
            field: 'alias', headerName: 'Alias', width: 130, type: 'string',
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties
                return <div className="p-1  flex items-center h-full">
                    <FormControl className={'w-full '} size="small">
                        <Input placeholder="Alias" value={row.alias} onChange={(event) => {
                            const value = (event.target.value)
                            const newConfigurableColumns = configurableColumns.map((col) => {
                                if (col.tableName === row.tableName && col.columnName === row.columnName)
                                    return { ...col, alias: value } as ConfigurableColumnProperties
                                return col
                            })
                            setConfigurableColumns(newConfigurableColumns)
                        }} />
                    </FormControl>
                </div>
            },
        },
        {
            field: 'sortingType', headerName: 'Sorting Type', width: 200, type: 'number',
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties
                return <div className="p-1  flex items-center h-full">
                    <FormControl className={'w-full '} size="small">
                        <InputLabel id="demo-simple-select-label">Sorting Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className={'h-full'}
                            id="demo-simple-select"
                            value={row.sortingType}
                            label="Sorting Type"
                            onChange={(event, child) => {
                                const value = event.target.value as SORTING_TYPES
                                const newConfigurableColumns = configurableColumns.map((col) => {
                                    if (col.tableName === row.tableName && col.columnName === row.columnName)
                                        return { ...col, sortingType: value } as ConfigurableColumnProperties
                                    return col
                                })
                                setConfigurableColumns(newConfigurableColumns)
                            }}
                        >
                            {Object.values(SORTING_TYPES).map(type => <MenuItem value={type}>{type}</MenuItem>)}

                        </Select>
                    </FormControl>
                </div>
            },
        },
        {
            field: 'sortOrder',
            headerName: 'Sort Order',
            type: 'number',
            width: 200,
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties
                return <div className="p-1  flex items-center h-full">
                    <FormControl className={'w-full '} size="small">
                        <TextField placeholder="Sort Order" variant="outlined" size="small" aria-valuemin={1}
                                   type="number" value={row.sortOrder} onChange={(event) => {
                            const value = Number(event.target.value) as number
                            const newConfigurableColumns = configurableColumns.map((col) => {
                                if (col.tableName === row.tableName && col.columnName === row.columnName)
                                    return { ...col, sortOrder: value } as ConfigurableColumnProperties
                                return col
                            })
                            setConfigurableColumns(newConfigurableColumns)
                        }} />
                    </FormControl>
                </div>
            },
        },
        {
            field: 'groupBy',
            headerName: 'Group By',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties


                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = (event.target.checked) as boolean
                    const newConfigurableColumns = configurableColumns.map((col) => {
                        if (col.tableName === row.tableName && col.columnName === row.columnName)
                            return { ...col, GroupBy: value } as ConfigurableColumnProperties
                        return col
                    })
                    setConfigurableColumns(newConfigurableColumns)
                }

                return <div className="p-1  flex items-center h-full">
                    <FormControl className={'w-full '} size="small">
                        <Checkbox onChange={handleChange} />
                    </FormControl>
                </div>
            },
        },

        {
            field: 'Aggregate',
            headerName: 'Aggregate',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 300,
            renderCell: (value) => {
                const row = value.row as ConfigurableColumnProperties


                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = (event.target.checked) as boolean
                    const newConfigurableColumns = configurableColumns.map((col) => {
                        if (col.tableName === row.tableName && col.columnName === row.columnName)
                            return { ...col, GroupBy: value } as ConfigurableColumnProperties
                        return col
                    })
                    setConfigurableColumns(newConfigurableColumns)
                }

                return <div className="p-1  flex items-center h-full">
                    <FormControl className={'w-full '} size="small">
                        <InputLabel id="demo-simple-select-label">Sorting Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className={'h-full'}
                            id="demo-simple-select"
                            value={row.Aggregate}
                            label="Sorting Type"
                            onChange={(event, child) => {
                                const value = event.target.value as AGGREGATE_TYPES
                                const newConfigurableColumns = configurableColumns.map((col) => {
                                    if (col.tableName === row.tableName && col.columnName === row.columnName)
                                        return {
                                            ...col,
                                            Aggregate: value,
                                        } as ConfigurableColumnProperties
                                    return col
                                })
                                setConfigurableColumns(newConfigurableColumns)
                            }}
                        >
                            {Object.values(AGGREGATE_TYPES).map(type => <MenuItem value={type}>{type}</MenuItem>)}

                        </Select>
                    </FormControl>
                </div>
            },
        },
    ]), [configurableColumns])

    const query = useMemo(() => {
        const query = queryBuilder(configurableColumns, relationships)
        if (onChangeQuery) onChangeQuery(query)

        return query
    }, [configurableColumns])


    return (
        <>
            <DataGrid
                rows={configurableColumns}
                columns={columns}
                // onStateChange={(test) => console.log(test.rows)}
                rowHeight={56}
                getRowId={(row) => row.columnName + row.tableName}
                // initialState={{ pagination: { paginationModel } }}
                // pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
            />
        </>
    )
}
export default Index
