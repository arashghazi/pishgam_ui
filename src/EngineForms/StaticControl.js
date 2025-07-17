import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {  Label, ListGroupItem } from 'reactstrap';
import uuid from 'uuid/v1'
const StaticControl = ({title,Index}) => {
    return (
        <Draggable draggableId={title} index={Index} >
            {(provided) => (
                <div className='list-group-item'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                //onDoubleClick={onClick}
                //value={value}
                >
            <Label>{title}</Label>
            </div>
            )}
        </Draggable>
    );
};

export default StaticControl;