import React, { Component } from 'react';
import { Modal,Button, FormGroup, Label, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { SearchObject } from '../Engine/Common';
import { InstanceController } from '../Engine/InstanceController';
import ComboBox from '../Forms/SimpleControl/ComboBox';
import { ConstIdes, PropConstIdes, StaticCondition } from './ConstIdes';

export default class ModalSampleSelector extends Component {
    state = {
        IsOpen: true,
        Years: [],
        Periods: [],
        Sample: [],
        Value: null
    }
    async componentDidMount() {
        let years = await SearchObject(' ',ConstIdes.Year,'<>');
        if (years.length > 0) {
            this.setState({
                ...this.state,
                Years: years
            })
        }
    }
    async YearChanged(value,objvalue) {
        let condition = StaticCondition.periodOfYear.replace('#' + PropConstIdes.Year, value);
        let periods = await SearchObject(condition, 'WHERE', '');
            this.setState({
                ...this.state,
                Periods: periods
            })
    }
    PeriodChanged(value, objvalue) {
        this.setState({
            ...this.state,
            Value: objvalue
        })
    }
    SampleChanged() {

    }
    closeBtn() {
        this.setState({
            ...this.state,
            IsOpen: false
        })
    }
    SelectedChanged() {
        if (this.props.onChanged !== undefined)
            this.props.onChanged(this.state.Value);
        this.closeBtn();
    }
    render() {
        return (
            <Modal isOpen={this.state.IsOpen} >
                <ModalHeader >{this.props.Mode === 1 ? 'انتخاب نمونه' : 'انتخاب دوره'}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="year" >سال</Label>
                        <ComboBox id='year' Source={this.state.Years} onChanged={this.YearChanged.bind(this)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="period" >دوره</Label>
                        <ComboBox id='period' Source={this.state.Periods} onChanged={this.PeriodChanged.bind(this)} />
                    </FormGroup>
                    {
                        this.props.Mode === 1 ?
                            <FormGroup>
                                <Label for="sample" >نمونه</Label>
                                <ComboBox id='sample' Source={this.state.Sample} onChanged={this.SampleChanged.bind(this)} />
                            </FormGroup> : null
                    }
                    
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeBtn.bind(this)}>انصراف</Button>
                    <Button color="primary" onClick={this.SelectedChanged.bind(this)}>انتخاب</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
