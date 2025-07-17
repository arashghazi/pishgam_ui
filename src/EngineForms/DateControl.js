import { uniqueId } from 'lodash';
import React, { Component } from 'react';
import { DatePicker } from "jalali-react-datepicker";
import DatePicker1 from "react-datepicker";
import { settings } from '../Engine/BaseSetting';
import "react-datepicker/dist/react-datepicker.css";
import { Label } from 'reactstrap';
import { Utility } from '../Engine/Common';
import moment from 'moment';
export default class DateControl extends Component {
    state = {
        value: undefined
    }
    async componentDidMount() {
        if (this.props.PValue)
            this.setState({
                ...this.state,
                value: moment(this.props.PValue)
            })
        if (this.props.control && this.props.control.DIPV) {
            let value = (await Utility.GetNow()).toString;
            this.props.onChange(value.date, value.hour);
            this.setState({
                ...this.state,
                value: value.date
            })
        }


    }
    componentDidUpdate() {
        if (this.props.prop !== this.state.prop) {
            let Prop = this.props.prop;
            if (Prop && Prop.IPV !== this.state.value) {
                let value = '';
                value = Prop.IPV;

                this.setState({
                    ...this.state,
                    prop: this.props.prop,
                    value: moment(value, 'MM/DD/YYYY')
                })
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
    onChange1(value) {
        this.props.onChange(value.getMonth() + '/' + value.getDate() + '/' + value.getFullYear(), value.getHours() + ':' + value.getMinutes());
        this.setState({
            ...this.state,
            value: value
        })
    }
    render() {
        let IsReadOnly = false;
        let id = uniqueId();
        if (this.props.Instance !== undefined) {
            id = this.props.Instance.ID + this.props.PID;
        }
        if (this.props.Control !== undefined) {
            IsReadOnly = this.props.Control.IsReadOnly ?? false;
        }
        let lang = settings.lang[0] === 'fa-IR';
        let temp = undefined;
        if (this.state.value)
            temp = moment(this.state.value, 'jYYYY/jM/jD')
        return (
            <div id={this.props.id}>
                {lang ?
                    //this.props.Mode === "TempData" || !IsReadOnly ?
                    <DatePicker onClickSubmitButton={this.onChange.bind(this)} id={id} className={"h-100"} label={this.props.title}
                        bsSize="sm" placeholder={this.props.title} timePicker={this.props.timePicker}
                        value={ this.state.value} /> 
                    : <><Label>{this.props.title}</Label>
                        <DatePicker1
                            selected={this.state.value} bsSize="sm"
                            onChange={(date) => this.onChange1(date)}
                            formatWeekDay={day => day.slice(0, 3)}
                            className='form-control'
                            placeholderText={this.props.title}
                        /></>
                }
            </div>
        );
    };
}