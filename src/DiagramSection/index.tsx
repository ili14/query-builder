import {
    addEdge,
    Background,
    BackgroundVariant,
    OnConnect,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import React, {useCallback, useEffect} from "react";
import {Box, Button} from "@mui/material";
import '@xyflow/react/dist/style.css';
import DiagramNode from "./DiagramNode";
import {Column, TableWithColumns} from "../App";

export interface MyNode {
    id: string,
    position: { x: number, y: number },
    type: 'DiagramNode',
    data: { TableName: string, columns?: Column[], }
}

const initialNodes: MyNode[] = [
    {
        id: '1', position: {x: 0, y: 0},
        type: 'DiagramNode', data: {TableName: '14', columns: []}
    },
    {
        id: '2', position: {x: 0, y: 100},
        type: 'DiagramNode', data: {TableName: '12', columns: []}
    },
];

interface MyEdge {
    id: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
}

const initialEdges: MyEdge[] = [{id: 'e1-2', source: '2', target: '1', sourceHandle: 'a', targetHandle: 'b'}];


interface DiagramSectionProps {
    tables: TableWithColumns[]
}

const nodeTypes = {
    DiagramNode: DiagramNode
}

export default function DiagramSection({tables}: DiagramSectionProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
        const myNodes: MyNode[] = tables.map((table => {
            const foundNode = nodes.find((node) => node.id === table.name);
            const position = {
                x: foundNode?.position.x ?? (Math.random() * 50),
                y: foundNode?.position.y ?? (Math.random() * 50)
            };

            return ({
                id: table.name,
                position: position,
                type: "DiagramNode",
                data: {TableName: table.name, columns: table.columns},
            }) as MyNode
        }));
        const newEdges: MyEdge[] = tables.flatMap((table) => {
            return table?.columns?.flatMap((column) => (column.relationship?.flatMap((rel) => {
                return {
                    id: `${table.name}-${column.name}`,
                    source: table.name,
                    target: rel.targetTable,
                    sourceHandle: column.name,
                    targetHandle: rel.targetColumn,
                    animated: true
                }
            }) ?? []) ?? []) ?? []
        });
        console.log("diagrams", newEdges);
        setNodes(myNodes);
        setEdges(newEdges);

    }, [ tables]);

    return <Box height={"100%"}>
        <Button onClick={() => {
            const t = initialEdges.map((edge) => ({...edge, source: '1', target: '2'}));
            console.log(t)
            setEdges(t)
        }}>
            addNode
        </Button>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={{DiagramNode}}
            // onConnect={onConnect}
        >
            <Background variant={BackgroundVariant.Lines}/>
        </ReactFlow>
    </Box>
}
