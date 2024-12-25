import "./App.css";
import React, {useState} from "react";
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
import 'beautiful-react-diagrams/styles.css';
import {createSchema, Diagram, useSchema} from "beautiful-react-diagrams";
import {} from "beautiful-react-diagrams"
import {PortAlignment} from "beautiful-react-diagrams/@types/DiagramSchema";


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
                            <DiagramSection/>
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


const initialSchema = createSchema({
    nodes: [
        {
            id: 'node-1',
            content: 'Start',
            coordinates: [100, 150],
            outputs: [
                {id: 'port-1', alignment: 'right'},
                {id: 'port-2', alignment: 'right'},
            ],
            disableDrag: true,
            data: {
                foo: 'bar',
                count: 0,
            }
        },
        {
            id: 'node-2',
            content: 'Middle',
            coordinates: [300, 150],
            inputs: [
                {id: 'port-3', alignment: 'left'},
                {id: 'port-4', alignment: 'left'},
            ],
            outputs: [
                {id: 'port-5', alignment: 'right'},
                {id: 'port-6', alignment: 'right'},
            ],
            data: {
                bar: 'foo',
            }
        },
        {
            id: 'node-3',
            content: 'End',
            render: DiagramNode,
            coordinates: [600, 150],
            inputs: [
                {id: 'port-7', alignment: 'left',},
                {id: 'port-8', alignment: 'left'},
            ],

            data: {
                foo: true,
                bar: false,
                some: {
                    deep: {
                        object: true,
                    }
                },
            }
        },
    ],

    links: [
        {
            input: 'port-1', readonly: true
            , output: 'port-4'
        },
    ],

});

interface DiagramSectionProps {
}

function DiagramSection({}: DiagramSectionProps) {
    // create diagrams schema
    const [schema, {onChange, addNode}] = useSchema(initialSchema);

    return <Box height={"100%"}>
        <Button onClick={() => {
            // addNode({})
        }}>
            addNode
        </Button>
        {/*
        // @ts-ignore */}
        <Diagram schema={schema} onChange={onChange}/>
    </Box>
}


export type Port = {
    id: string;
    canLink?: Function;
    alignment?: PortAlignment;
};

interface DiagramNodeProps {
    inputs?: Port[],
    data?: any
}

function DiagramNode({inputs, data}: DiagramNodeProps) {

    console.log(data);

    return <div className="ring-1">
        test
        <div style={{marginTop: '20px'}}>

            {inputs?.map((Port) => {

                return <>
                    {/*
                    //@ts-ignore*/}
                    {React.cloneElement(Port, {
                        style: {width: '50px', height: '25px', background: '#1B263B'},
                        children: <>name</>,
                        onMouseDown(e){
                            e.preventDefault();
                            e.preventDefault();
                        }
                    })}
                </>
            })}
        </div>
        {/*{inputs?.map(input => input)}*/}
    </div>
}

export default App;
