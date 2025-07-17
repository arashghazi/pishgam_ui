import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Row, Col, Table, ListGroup, ListGroupItem, Label, ListGroupItemHeading, ListGroupItemText, Badge, CardHeader, CardTitle, Card } from 'reactstrap';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import ObjectClassController from '../../Engine/ObjectClassController';
import Flex from '../../components/common/Flex';
import ComboBox from '../SimpleControl/ComboBox';

export default class PanelSetting extends Component {
    state = {
        propIsopen: false,
        source: '',
    }
    toggle() {
        this.props.Close(this.props.Modal.source, null);
    }
    async selectionChanged(selectedvalue) {
        await ObjectClassController.LoadAsync(selectedvalue.id, this);
    }
    Update(datamodel = { Data: '' }) {
        let source = datamodel.Data;
        if (source !== null) {
            this.setState({
                ...this.state,
                Forms: source.Forms
            })
        }
    }
    async componentDidMount() {
        if (this.state.Panels === null) {
            let forms = await ObjectClassController.GetPanelListAsync()
            this.setState({
                ...this.state,
                Panels: forms
            })
        }
    }
    onChange(event) {
        this.props.source.title = event.target.value
        this.setState({
            ...this.state,
            source: {
                ...this.state.source,
                title: event.target.value
            }
        })
    }

    closeBtn = <button className="close" onClick={this.toggle.bind(this)}>&times;</button>;

    render() {
        this.state.source = this.props.source
        return (
            <Modal isOpen={this.props.Modal.isOpen} style={{ width: '1000px' }}>
                <ModalHeader toggle={this.toggle.bind(this)} close={this.closeBtn}>تنظیمات پنل</ModalHeader>
                <ModalBody>
                    
                    <Row>
                        <Card>
                            <CardTitle>ارتباطات بین فرمها</CardTitle>
                            <Row>
                                <ComboBox></ComboBox>
                                <Col></Col>
                            </Row>
                        <ListGroup>
                            {this.props.source.Connectors.map((con) => (
                                <ListGroupItem>
                                    <Col>
                                        <Label>منبع: </Label>
                                        <Badge color='soft-success'>{con.BF}</Badge>
                                        <Badge color='soft-light' >{con.BP}</Badge>
                                    </Col>
                                    <Col>
                                        <Label>مقصد: </Label>
                                        <Badge color='soft-success'>{con.SF}</Badge>
                                        <Badge color='soft-light'>{con.SP}</Badge>
                                    </Col>
                                </ListGroupItem>
                            ))}
                            </ListGroup>
                        </Card>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle.bind(this)}>انصراف</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
