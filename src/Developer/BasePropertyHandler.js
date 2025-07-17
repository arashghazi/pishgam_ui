import React, { Component } from 'react';
import { FormGroup, Col, Label, Row,Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';
import BasePropertyController from '../Engine/BasePropertyController';
import JoiComboBox from '../components/joi/JoiComboBox';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import { Utility } from '../Engine/Common';
const dataTypeList = [
    {
        id: "Double", display: "Double"
    },
    {
        id: "String", display: "String"
    },
    {
        id: "Boolean", display: "Boolean"
    },
    {
        id: "DateTime", display: "DateTime"
    },
    {
        id: "Time", display: "Time"
    },
    {
        id: "BaseProperty", display: "BaseProperty"
    },
    {
        id: "Entity", display: "Entity"
    },
    {
        id: "ObjectClass", display: "ObjectClass"
    },
    {
        id: "Instance", display: "Instance"
    },
    { id: "AnyInstance", display: "AnyInstance" },
    { id: "Group", display: "Group" },
    { id: "ObjectClassList", display: "ObjectClassList" },
    { id: "User", display: "User" },
    { id: "Date", display: "Date" },
    { id: "File", display: "File" },
    { id: "Role", display: "Role" },
    { id: "Json", display: "Json" },
    {
        id: "TimeSpan", display: "TimeSpan"
    },
    {
        id: "NewInstance", display: "NewInstance"
    }
];
const ControlType = [
    { display: "None", id: "None" },
    { display: "AITextBox", id: "AITextBox"},
    { display: "MultiLang_TextBox", id: "MultiLang_TextBox"},
    { display: "ComboBox", id: "ComboBox"},
    { display: "CheckBox", id: "CheckBox"},
    { display: "Slider_CheckBox", id: "Slider_CheckBox"},
    { display: "TreeView", id: "TreeView"},
    { display: "SearchControl", id: "SearchControl"},
    { display: "InstanceControl", id: "InstanceControl"},
    { display: "UserBox", id: "UserBox"},
    { display: "Weight", id: "Weight"},
    { display: "RaidoButton", id: "RaidoButton"},
    { display: "MultiLineText", id: "MultiLineText"},
    { display: "TimePeriod", id: "TimePeriod"}]

export default class BasePropertyHandler extends Component {
    state = { ...BasePropertyController.New(), errors: [], pervisid: 'NEWBASEPROPERTY' };
    async UNSAFE_componentWillUpdate(prevProps, prevState) {
        if (prevProps.Modal.source !== prevState.pervisid) {
            
            let state = { ...BasePropertyController.New(), errors: [], pervisid: prevProps.Modal.source };
            if (prevProps.Modal.source !== '' && prevProps.Modal.source !== 'NEWBASEPROPERTY') {
                state = await BasePropertyController.LoadAsync(prevProps.Modal.source);
                state = { ...state,errors: [], pervisid: prevProps.Modal.source}
            }
            else if (prevProps.Modal.source === '')
                state = { ...state, PSource: '', errors: [], pervisid: '' }
            this.setState({
                ...state
            })
        }
    }
    
    toggle() {
        this.props.Close(this.props.Modal.source, null);
    }
    async Save() {
        if (this.Validation()) {
            console.log(this.state)
            this.state.pervisid=await BasePropertyController.SaveAsync(this.state.ID, this.state);
            this.props.Close(this.props.Modal.source, this.state.pervisid);;
        }
    }
    Validation() {
        let errors = []
        if (this.state.Contexts[0].Context.trim() === "") {
            errors = [...errors, { id: 'Context', text: ' نمیتواند خالی باشد' }]
            this.setState({
                ...this.state,
                errors: errors
            })
            return false;
        }
        return true;
    }
    onChange(event) {
        this.setState({
            ...this.state,
            Contexts: [{ Lan: "fa-IR", Context: event.currentTarget.value }],
        })
    }
    onChangeDataType(event) {
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                DataType: event
            },
        })
    }
    onChangeControlType(event) {
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                Control: event
            },
        })
    }
    PSourceChanged(selectedclass) {
        console.log(selectedclass)
        this.setState({
            ...this.state,
            PSource: selectedclass
        })
    }
    onMinChange(event) {
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                Min: event.currentTarget.value
            },
        })
    }
    onMaxChange(event) {
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                Max: event.currentTarget.value
            },
        })
    }
    onValueLenghChange(event) {
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                ValueLengh: event.currentTarget.value
            },
        })
    }
    onMultiValueChange(event) {
        console.log(event.currentTarget.defaultChecked, this.state)
        this.setState({
            ...this.state,
            StyleW2: {
                ...this.state.StyleW2,
                MultiValue: !this.state.StyleW2.MultiValue
            },
        })
    }
    closeBtn = <button className="close" onClick={this.toggle.bind(this)}>&times;</button>;

    render() {

        return (
            <Modal isOpen={this.props.Modal.isOpen} >
                <ModalHeader toggle={this.toggle.bind(this)} close={this.closeBtn}>تعریف مشخصه {this.state.ID}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor='Context'>نام مشخصه</Label>
                                <span style={{ color: "red" }}>{this.state.errors.find(x => x.id === 'Context') ? this.state.errors.find(x => x.id === 'Context').text:''}</span>
                                <Input id='Context' placeholder={this.props.placeHolder} aria-label="Search"
                                     value={this.state.Contexts[0].Context} onChange={this.onChange.bind(this)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <JoiComboBox id={'DataType'} Title={'نوع داده'} source={dataTypeList} value={this.state.StyleW2.DataType} onChange={this.onChangeDataType.bind(this)} />
                        </Col>
                        <Col>
                            <JoiSearchBox placeHolder=" کلاس" type='CLASS' value={this.state.PSource} ReadOnly={this.state.StyleW2.DataType !== "Instance"} onChange={this.PSourceChanged.bind(this)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <JoiComboBox id={'Control'} Title={'نوع کنترل'} value={this.state.StyleW2.Control} source={ControlType} onChange={this.onChangeControlType.bind(this)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor='Min'>کمینه</Label>
                                <Input id='Min' placeholder={this.props.placeHolder} aria-label="Search"
                                    value={this.state.StyleW2.Min} onChange={this.onMinChange.bind(this)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor='Max'>بیشینه</Label>
                                <Input id='Max' placeholder={this.props.placeHolder} aria-label="Search"
                                    value={this.state.StyleW2.Max} onChange={this.onMaxChange.bind(this)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor='ValueLengh'>تعداد مقادیر</Label>
                                <Input id='ValueLengh' placeholder={this.props.placeHolder} aria-label="Search"
                                    value={this.state.StyleW2.ValueLengh} onChange={this.onValueLenghChange.bind(this)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="pl-3">
                                <Input id='MultiValue' placeholder={this.props.placeHolder} type='checkbox' 
                                    defaultChecked={this.state.StyleW2.MultiValue} onChange={this.onMultiValueChange.bind(this)} />
                                <Label htmlFor='MultiValue'>چند مقداره</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle.bind(this)}>انصراف</Button>
                    <Button color="primary" disabled={Utility.IsSystemPropertyID(this.state.ID)} onClick={this.Save.bind(this)}>ذخیره</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
