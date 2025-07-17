import React from 'react';
import { Col, Label, Row } from 'reactstrap';
import SearchControl from '../../EngineForms/SearchControl';
import BasePropertyController from '../../Engine/BasePropertyController';
import BasePropertyDefinition from '../PropertySection/BasePropertyDefinition';
import BasePropertyList from '../PropertySection/BasePropertyList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const ClassPropertyControl = ({ data, changeData }) => {
    const onDelete=(property)=>{
        let index = data.properties.findIndex(x => x.ID === property.ID)
        let newdata = { ...data };
        newdata.properties.splice(index, 1);
        changeData(newdata);
    }
    const onChange = async (property) => {
        if (changeData && data.properties.findIndex(x => x.ID === property.id) < 0) {
            let newdata = { ...data };
            let completeProp = await BasePropertyController.LoadAsync(property.id);
            newdata.properties = [...newdata.properties, completeProp]
            changeData(newdata);
        }
    }
    const handleOnDragEnd = dargedItem => {
        let newdata = { ...data };
        let item = newdata.properties.find(x => x.ID === dargedItem.draggableId)
        newdata.properties.splice(dargedItem.source.index, 1);
        newdata.properties.splice(dargedItem.destination.index, 0, item)
        changeData(newdata);
    }
    return (
        <Row>
            <Col lg={6}>
                
                <Label>Search property</Label>
                <SearchControl onChange={onChange} type='PROPERTY' />
                <h5 className='m-2'>Properties</h5>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='propertyList'>
                        {(provided) => (
                            <div ref={provided.innerRef}
                                {...provided.droppableProps}>
                                <BasePropertyList handleOnDragEnd={handleOnDragEnd} onDelete={onDelete} data={data} changeData={changeData} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                
            </Col>
            <Col lg={6}>
                <BasePropertyDefinition changeData={changeData} data={data} />
            </Col>
        </Row>
    );
};

export default ClassPropertyControl;