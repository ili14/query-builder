import "./App.css";
import React, {useCallback, useState} from "react";
import {
    Box,
    Button,
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



function App(): JSX.Element {

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
                        <Card variant={"outlined"} className='w-full h-full overflow-hidden'><TableListSection/></Card>
                    </Grid>
                    <Grid className="cell" size={6}>
                        <Card variant={"outlined"} className='w-full h-full'>
                            <DiagramSection />
                        </Card>
                    </Grid>
                    <Grid className="cell" size={3}>
                        <Card variant={"outlined"} className='w-full h-full'><MyEditor/></Card>
                    </Grid>
                </Grid>
                <Grid container spacing={2} height={'40%'}>
                    <Grid className="cell" size={3}>
                        <Card variant={"outlined"} className='w-full h-full'>bottom-left</Card>
                    </Grid>
                    <Grid className="cell" size={9}>
                        <Card variant={"outlined"} className='w-full h-full'>bottom-left</Card>
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

function TableListSection() {
    return <>
        <List sx={{maxHeight: '100%'}} className={'!overflow-auto'} subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                Tables
            </ListSubheader>
        }>
            {listOfTables.map((table) => {

                return (
                    <ListItem draggable disablePadding
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

}

function MyEditor({}: MyEditorProps) {
    const [code, setCode] = useState<string | undefined>('SELECT * FROM users WHERE id > 10 AND email LIKE "%example.com%"');
    return <Box height={"100%"}>
        <Editor className="h-full" onChange={(value) => (setCode(value))} options={{wordWrap: "on",}}
                defaultLanguage="sql" defaultValue="// some comment" value={code}/>
    </Box>
}

export default App;
