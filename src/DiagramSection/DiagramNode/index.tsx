import React from 'react'
import {Handle, Position} from "@xyflow/react";

type Column = {
    name: string,
    type?: string,
    [key: string]: any
}

interface DiagramNodeProps {
    data: { title: string, columns: Column[], [key: string]: any };
    isConnectable: boolean
}

const DiagramNode: React.FC<DiagramNodeProps> = ({data, isConnectable}) => {

    return (
        <div className='bg-white rounded-md ring-2 pb-2 '>
            <div className=" flex flex-col gap-2 w-20 ">
                {data.title}
                {/*
                ! remember to read columns from data.columns to generate columns
                ! every column have bellow tag item in wrapped in !COLUMN comment for easier understanding
                */}
                {/*
                ! COLUMN
                  */}
                <div className="column relative bg-blue-500">
                    <Handle
                        type="target"
                        id="a"
                        position={Position.Left}
                        // style={{top: 40}}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        id="a"
                        position={Position.Left}
                        isConnectable={isConnectable}
                    />
                    id
                </div>
                {/*
                ! COLUMN
                  */}
                <div className="relative bg-blue-500">

                    <Handle
                        type="source"
                        id="b"
                        position={Position.Left}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="target"
                        id="b"
                        position={Position.Left}
                        // style={{top: 50}}
                        isConnectable={isConnectable}
                    />
                    name
                </div>
            </div>
        </div>
    )
}

export default DiagramNode;