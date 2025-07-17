import React, { Component } from 'react';
import { Badge, CustomInput, Row } from 'reactstrap';
import Flex from '../common/Flex';
import { Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/v1';
export default class JoiBaseProperty extends Component {
    state = { Name: '', controlType: '', dataType: '', select: true };
    render() {
        return (
            <Draggable draggableId={this.props.property.ID} index={this.props.index} >
                {(provided) => (
                    <div className='list-group-item'
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        onDoubleClick={this.props.onClick.bind(this)}
                        value={this.props.value}
                    >
                        <Flex justify="between" align="end">
                            <Row>
                                <CustomInput
                                    type="checkbox"
                                    id={uuid()}
                                    checked={this.props.IsShowProp}
                                    label={this.props.property.Name}
                                    className="mb-0"
                                    onChange={() => (this.props.ShowProp(this.props.property.ID))}
                                />
                            </Row>
                            <Row>
                                <Badge style={{ fontSize: 8 }} color={'soft-primary'} pill> {this.props.property.StyleW2.Control}</Badge>
                                <Badge style={{ fontSize: 8 }} color={'soft-secondary'} pill> {this.props.property.StyleW2.DataType}</Badge>
                                <Badge style={{ fontSize: 8 }} onClick={() => (this.props.ChangedKey(this.props.property.ID))}
                                    color={ this.props.IsKey ? 'warning' : 'light'} pill>Key</Badge>
                            </Row>
                        </Flex>
                    </div>
                )}
            </Draggable>
        );
    }
}
