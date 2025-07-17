import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card, CardBody, Col, Input, Label, Row } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import ComboBox from '../../EngineForms/ComboBox';
import DroppableArea from '../../EngineForms/DroppableArea';
import SearchControl from '../../EngineForms/SearchControl';
import StaticControl from '../../EngineForms/StaticControl';
import { ThemeCardHeader, ThemeDivider } from '../../EngineForms/ThemeControl';
import BasePropertyList from '../PropertySection/BasePropertyList'
import FormFinder from './FormFinder';
const DesignTools = ({ builder, ...rest }) => {
    const [selForm, setSelForm] = useState();
    const [oc, setOC] = useState();
    const onFormChanged = (value, objvalue) => {
        setSelForm(value)
        builder.ChangeForm(value)
    }
    const onClassChanged=async(oc)=>{
        builder.ObjectClass = await ObjectClassController.LoadAsync(oc.id);
        setOC(builder.ObjectClass)
    }
    
    return (
        <Card {...rest}>
            <ThemeCardHeader title='Tools' />
            <CardBody>
                <Row>
                    <Col>
                        <FormFinder onFormChanged={onFormChanged} onClassChanged={onClassChanged} addNew />
                        <ThemeDivider>Static Control</ThemeDivider>
                        <DroppableArea droppableId={'Statics'}>

                            <StaticControl title='Date Time' Index={1} />
                            <StaticControl title='Static Text' Index={2} />
                            <StaticControl title='Image' Index={3} />
                        </DroppableArea>
                    </Col>
                </Row>
                <ThemeDivider>Properties</ThemeDivider>

                <DroppableArea droppableId={'Tools'}>
                    <Row style={{ height: '280px', overflowY: 'auto' }}>
                        <Col>
                            <BasePropertyList data={oc} />
                        </Col>
                    </Row>
                </DroppableArea>
            </CardBody>
        </Card>
    );
};

export default DesignTools;
