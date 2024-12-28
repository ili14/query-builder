import {useSchema} from "beautiful-react-diagrams";
import {
    addEdge,
    Background,
    OnConnect,
    ReactFlow,
    useEdgesState,
    useNodesState,
    BackgroundVariant
} from "@xyflow/react";
import React, {useCallback} from "react";
import {Box, Button} from "@mui/material";
import '@xyflow/react/dist/style.css';
import DiagramNode from "./DiagramNode";

const initialNodes = [
    {
        id: '1', position: {x: 0, y: 0},
        type: 'DiagramNode', data: {label: '5', title: '14'}
    },
    {
        id: '2', position: {x: 0, y: 100},
        type: 'DiagramNode', data: {label: '6', title: '12'}
    },
];
const initialEdges = [{id: 'e1-2', source: '1', target: '5', sourceHandle: 'a', targetHandle: 'a'}];


interface DiagramSectionProps {
}

const nodeTypes = {
    DiagramNode: DiagramNode
}

export default function DiagramSection({}: DiagramSectionProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

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
            onConnect={onConnect}
        >
            <Background variant={BackgroundVariant.Lines}/>
        </ReactFlow>
    </Box>
}
