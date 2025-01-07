import React from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { TableWithColumns } from '../App'

interface SelectedTablesProps {
    tableWithColumns: TableWithColumns | null;
}

const Index: React.FC<SelectedTablesProps> = ({ tableWithColumns }) => {
    return (
        <Paper elevation={0}>
            <Box className="bg-blue-100">
                <Typography sx={{ p: 1 }} variant={'h6'} fontSize={14} color={'gray'}>
                    Columns of <b className={'font-bold text-blue-400'}>{tableWithColumns?.name}</b> Table
                </Typography>
                <Divider />
            </Box>
            <Box className="flex flex-col gap-1 pt-1 p-2">
                {tableWithColumns?.columns?.map((column, index) => (
                    <>
                        <Box display="flex" justifyContent="space-between">
                            {column.name} {column.description ? <><Divider  flexItem orientation="vertical" />
                            <Box>{column.description}</Box></> : undefined}
                        </Box>
                        <Divider className="last:hidden" />
                    </>
                ))}
                {!tableWithColumns && <Box className={'animate-pulse'}>No table selected</Box>}
            </Box>
        </Paper>
    )
}
export default Index
