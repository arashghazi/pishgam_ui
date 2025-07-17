import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DroppableArea = ({children,droppableId}) => {
    return (
        <Droppable droppableId={droppableId}>
            {(provided) => (
                <div ref={provided.innerRef}
                    {...provided.droppableProps}>
                        {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default DroppableArea;