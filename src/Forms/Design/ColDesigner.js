import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button, CardBody, CardTitle, Col, Dropdown, DropdownMenu, DropdownToggle, FormGroup, Input, Label } from 'reactstrap';
import Flex from '../../components/common/Flex';
import InstanceCell from '../InstanceForm/InstanceCell';

const controlTypes = ['None', 'AITextBox', 'MultiLang_TextBox', 'ComboBox', 'CheckBox'
    , 'TreeView', 'SearchControl', 'InstanceControl', 'UserBox','RaidoButton'];
export default class ColDesigner extends Component {
    state = {
        mousein: false, OpenSetting: false,
        control: {
            col: "12",
            pid: "",
            controlType: "",
            title: "", IsReadOnly: false,
            actiontype: ""
        }
    }
    MouseEnter() {
        this.setState({
            ...this.state,
            mousein: true
        })
    }
    MouseLeave() {
        this.setState({
            ...this.state,
            mousein: false
        })
    }
    componentDidMount() {
        this.initialize();
    }
    componentDidUpdate() {
        this.initialize();
    }
    initialize() {
        if (this.props.control.pid !== this.state.control.pid) {
            let control = { ...this.props.control };
            if (this.props.control.IsReadOnly === undefined)
                control.IsReadOnly = false;
            this.setState({
                ...this.state,
                control: control
            });
        }
    }
    OpenSetting() {
        this.setState({
            ...this.state,
            OpenSetting: true,
        })
    }
    titleCanged(event) {
        this.setState({
            ...this.state,
            control: {
                ...this.state.control,
                title: event.target.value
            }
        })
    }
    render() {
        let id = this.props.rowindex + '-' + this.props.colindex;
        return (<>
            <Col className='p-0' xs={this.state.control.col} onClick={this.OpenSetting.bind(this)} >
                <div className="border-dashed p-2"
                    onMouseLeave={this.MouseLeave.bind(this)} onMouseEnter={this.MouseEnter.bind(this)}
                    style={{ backgroundColor: this.state.mousein ? 'lightblue' : 'white' }}
                >
                    <Col className='p-0'>
                        <Droppable droppableId={id}>
                            {(provided) => (
                                <div ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    {this.state.control.pid !== '' ?
                                        <InstanceCell Mode='TempData' key={this.state.control.pid} Control={this.state.control} />
                                        : (<div >
                                            <Label style={{ color: 'lightgray', fontSize: 9 }}>{'مشخصه را اینجا رها کنید'}</Label>
                                        </div>
                                        )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Col>
                </div>
                <Dropdown isOpen={this.state.OpenSetting} toggle={() => this.setState({ ...this.state, OpenSetting: !this.state.OpenSetting })} className="nopadding" >
                <DropdownToggle
                    tag="div"
                    data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}
                >
                </DropdownToggle>
                <DropdownMenu >
                    {
                        <>
                            <CardTitle>
                                <Flex className="p-1" justify="between" align="end">
                                    <div>{"تنظیمات مشخصه"}</div>
                                </Flex>
                            </CardTitle>
                            <CardBody>
                                    <FormGroup row>
                                        <Label for='title' sm={2}>عنوان </Label>
                                        <Col sm={10}>
                                            <Input id='title' bsSize="sm" value={this.state.control.title} onChange={this.titleCanged.bind(this)} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for='controlType' sm={2}>کنترل </Label>
                                        <Col sm={10}>
                                            <Input bsSize='sm'
                                                value={this.state.control.controlType}
                                                type="select"
                                                name="controlType"
                                                onChange={(event) => {
                                                    this.setState({
                                                        ...this.state,
                                                        control: {
                                                            ...this.state.control,
                                                            controlType: event.target.value
                                                        }
                                                    }) }}
                                                id="controlType">
                                                {controlTypes.map((ctrl) => (
                                                    <option key={ctrl}>{ctrl}</option>
                                                ))
                                                }
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input type="checkbox"
                                                id="required"
                                                checked={this.state.control.actiontype === "required"}
                                                onChange={() => {
                                                    let actiontype = '';
                                                    this.state.control.actiontype === '' ? actiontype = 'required' : actiontype = ''
                                                    this.setState({
                                                        ...this.state,
                                                        control: {
                                                            ...this.state.control,
                                                            actiontype: actiontype
                                                        }
                                                    })
                                                }
                                                }
                                            /> اجباری
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input type="checkbox"
                                                id="IsReadOnly"
                                                checked={this.state.control.IsReadOnly}
                                                onChange={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        control: {
                                                            ...this.state.control,
                                                            IsReadOnly: !this.state.control.IsReadOnly
                                                        }
                                                    })
                                                }
                                                }
                                            /> فقط خواندنی
                                        </Label>
                                    </FormGroup>
                                    <Button onClick={() => {
                                        this.props.ControlUpdate(this.props.rowindex, this.props.colindex, this.state.control)
                                        this.setState({
                                            ...this.state,
                                            OpenSetting: false,
                                        })

                                    }} >بروزرسانی</Button>
                            </CardBody>
                        </>
                    }
                </DropdownMenu>
            </Dropdown>
            </Col>
            </>
        );
    }
}
