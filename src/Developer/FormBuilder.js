import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Col, Row } from 'reactstrap';
import InstanceControlBuilder from '../Forms/Design/InstanceControlBuilder';
import ObjectClassHandler from './ObjectClassHandler';
import Flex from '../components/common/Flex';
import InstancePresentaionDesigner from './InstancePresentaionDesigner';

export default class FormBuilder extends Component {
    state = {
        source: '', classid:''}
    OCH = {}
    ICB = {}
    onDragEnd = result => {
        this.OCH.onDragEnd(result);
        this.ICB.onDragEnd(result);
    }
    onChangeSource(classid,type) {
        this.setState({
            ...this.state,
            classid: classid
        })
        //if (this.ICB !== undefined && this.ICB !== null && this.ICB.SourceChanged !== undefined) {
        //    this.ICB.SourceChanged(classid, type)
        //}
    }
    Update(datamodel = { Data: '' }) {
        let FormData = datamodel.Data;
        this.setState({
            ...this.state,
            Form: FormData
        });
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Row>
                    <Col md="3" style={{ height:'88vh', overflowY: 'scroll' }}>
                        <ObjectClassHandler onRef={ref => (this.OCH = ref)}  ChangeSource={this.onChangeSource.bind(this)} />
                    </Col>
                    <Col md="9">
                        {
                            // (this.state.classid !== '' ? <InstanceControlBuilder onRef={ref => (this.ICB = ref)} />
                            (this.state.classid !== '' ? <InstancePresentaionDesigner ClassId={this.state.classid}
                                onRef={ref => (this.ICB = ref)} />
                                : <Flex justify="center" align="center" ><h5>یک کلاس انتخاب یا تعریف نمایید</h5></Flex>)
                        }
                    </Col>
                </Row>
            </DragDropContext>
        );
    }
}
