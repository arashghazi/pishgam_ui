import React, { Component } from 'react';
import Flex from '../common/Flex';
import { Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid'
export default class JoiSortableList extends Component {
    state = { List };
    render() {
        let id = uuid();
        return (
            <Droppable droppableId={id}>
                {(provided) => (
                    <div ref={provided.innerRef}
                        {...provided.droppableProps}>
                        {this.props.List.map((item, index) => (
                            <Draggable draggableId={item.id} index={index} >
                                {(provided) => (
                                    <div className="list-group-item"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        <Flex justify="between" align="end">
                                            <div>
                                                {item.display}
                                            </div>
                                        </Flex>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }
}
