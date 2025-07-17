import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Col, Row } from 'reactstrap';
import { NewPanel } from '../../Engine/Common';
import { BuildManager } from '../BuildManager';
import PanleList from '../PanelBuilder/PanleList';
import DesignTools from './DesignTools';
import FormDesigner from './FormDesigner';

class FormBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = { builder: new BuildManager(this),isPanle:false }
    }
    state = {}
    setIsPanel(){
        let DM=this.state.builder.DM;
        DM.MainFormID = 'PanelF3';
        DM.FormStructuer = { ...NewPanel, FormID: 'Panel'};
        DM.ChangeForm();
        this.setState({
            ...this.state,
            isPanle:!this.state.isPanle
        })
    }
    UpdateForm = (formId) => {
        this.setState({
            ...this.state,
            formId
        });
    }
    handleOnDragEnd = ({ destination, draggableId, source }) => {
        let form = this.state.builder.DM.formStructuer;
        console.log(destination, draggableId, source)
        if (source.droppableId === 'Tools') {
            let row = destination.droppableId.split('-')[0];
            let col = destination.droppableId.split('-')[1];
            let baseProperty = this.state.builder.ObjectClass.properties.find(p => p.ID === draggableId);
            form.rows[row].controls[col].pid = baseProperty.ID;
            form.rows[row].controls[col].controlType = baseProperty.StyleW2.Control;
            form.rows[row].controls[col].title = baseProperty.Name;
        }
        else if (source.droppableId.includes('-')) {
            let row1 = destination.droppableId.split('-')[0];
            let col1 = destination.droppableId.split('-')[1];
            let row2 = source.droppableId.split('-')[0];
            let col2 = source.droppableId.split('-')[1];
            let temp = form.rows[row1].controls[col1];
            form.rows[row1].controls[col1]=form.rows[row2].controls[col2];
            form.rows[row2].controls[col2]=temp;
        }else if (source.droppableId==='PanelGround'){
            let temprow = form.rows[destination.index];
            form.rows[destination.index] = form.rows[source.index]
            form.rows[source.index]=temprow;
        }
        this.state.builder.DM.ChangeForm(form);
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                <Row >
                    <Col lg={'9'}>
                        <FormDesigner builder={this.state.builder}
                            formId={this.state?.formId} isPanle={this.state.isPanle}
                            setIsPanel={this.setIsPanel.bind(this)}
                            title='Form Designer' />
                    </Col>
                    <Col lg='3'>
                    {!this.state.isPanle?
                        <DesignTools builder={this.state.builder} style={{ height: '85vh' }} />
                        :<PanleList builder={this.state.builder} />
                        }
                    </Col>
                </Row>
            </DragDropContext>
        );
    }
};

export default FormBuilder;

