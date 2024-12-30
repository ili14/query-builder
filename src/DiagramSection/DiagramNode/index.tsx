import React, {HTMLAttributes} from 'react'
import {Handle, Position} from "@xyflow/react";
import {Column} from "../../App";


interface DiagramNodeProps {
    data: { TableName: string, columns?: Column[], onCheck: (isCheck: boolean) => void, [key: string]: any };
    isConnectable: boolean
}

const DiagramNode: React.FC<DiagramNodeProps> = ({data, isConnectable}) => {

    return (
        <div className='bg-white rounded-md ring-2 pb-2 '>
            <div className=" flex flex-col gap-2 min-w-20  px-1">
                {data.TableName}
                {/*
                ! remember to read columns from data.columns to generate columns
                ! every column have bellow tag item in wrapped in !COLUMN comment for easier understanding
                */}
                {/*
                ! COLUMN
                  */}
                {data?.columns?.map((column, index) => {
                    return (
                        <div className="column relative flex items-center" key={index}>
                            <MyCheckbox checked={column.checked}/>
                            {column.name}
                            <Handle
                                type="target"
                                id={column.name}
                                position={Position.Left}
                                isConnectable={isConnectable}
                            />
                            <Handle
                                type="source"
                                id={column.name}
                                position={Position.Right}
                                isConnectable={isConnectable}
                            />
                        </div>)
                })}
                {/*
                ! COLUMN
                  */}
                {/*<div className="relative bg-blue-500">*/}

                {/*    <Handle*/}
                {/*        type="source"*/}
                {/*        id="b"*/}
                {/*        position={Position.Left}*/}
                {/*        isConnectable={isConnectable}*/}
                {/*    />*/}
                {/*    <Handle*/}
                {/*        type="target"*/}
                {/*        id="b"*/}
                {/*        position={Position.Left}*/}
                {/*        // style={{top: 50}}*/}
                {/*        isConnectable={isConnectable}*/}
                {/*    />*/}
                {/*    name*/}
                {/*</div>*/}
            </div>
        </div>
    )
}


export default DiagramNode;

interface MyCheckboxProps extends HTMLAttributes<HTMLInputElement> {
    checked?: boolean;
}

const MyCheckbox: React.FC<MyCheckboxProps> = ({checked, onChange, ...rest}) => {

    return <label className="inline-flex items-center space-x-2">
        <input type="checkbox" id="checkbox" className="hidden peer" {...rest} />
        <div
            className="w-5 h-5 border-2 border-gray-300 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600"></div>
        <span className="text-gray-700">{rest.children}</span>
    </label>
}