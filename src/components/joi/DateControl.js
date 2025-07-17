import { uniqueId } from 'lodash';
import React, { Component } from 'react';
import { Input, Label } from "reactstrap";
import { DatePicker } from "jalali-react-datepicker";

export default class DateControl extends Component {
    state = {
        value: ''
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            value: this.props.PValue
        })
    }
    componentDidUpdate() {
        if (this.props.Instance !== undefined && this.props.Instance.Prop !== undefined) {
            let Prop = this.props.Instance.Prop.find(x => x.PID === this.props.PID);
            if (Prop !== undefined) {
                if (Prop.IPV !== this.state.value) {
                    let value = '';
                    value = Prop.IPV;

                    this.setState({
                        ...this.state,
                        value: value
                    })
                }
            }
            else if (this.state.value !== '') {
                this.setState({
                    ...this.state,
                    value: ''
                })
            }
        }
    }
    
    onChange({ value }) {
        this.props.onChange(value.format('MM/DD/YYYY'), value.format('HH:mm'));
        this.setState({
            ...this.state,
            value: value.format('MM/DD/YYYY')
        })
    }
    render() {
        let id = uniqueId();
        if (this.props.Instance !== undefined) {
            id = this.props.Instance.ID + this.props.PID;
        }
        let IsReadOnly = false;
        if (this.props.Control !== undefined) {
            IsReadOnly = this.props.Control.IsReadOnly !== undefined ? this.props.Control.IsReadOnly : false;
        }
        return (
            <>
                {
                    //this.props.Mode === "TempData" || !IsReadOnly ?
                    <DatePicker onClickSubmitButton={this.onChange.bind(this)} id={id} className={"h-100"} label={this.props.title}
                        bsSize="sm" placeholder={this.props.title} timePicker={this.props.timePicker}
                        value11={this.state.value} />
                        //: <Label>{this.state.value}</Label>
                }
            </>
        );
    };
}