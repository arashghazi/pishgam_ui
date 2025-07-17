import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableItem = ({children,draggableId,index}) => {
    return (
        <Draggable draggableId={draggableId} index={index} >
            {(provided) => (
                <div className='list-group-item'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {children}
                    </div>)}
        </Draggable>
    );
};

export default DraggableItem;