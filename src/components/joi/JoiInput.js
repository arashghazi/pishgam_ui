import { uniqueId } from 'lodash';
import React, { Component } from 'react';
import { Input, Label } from "reactstrap";

export default class JoiInput extends Component {
    state = {
        value: ''
    }
    onChange(event) {
        event.preventDefault();
        this.props.onChange(event.target.value);
        this.setState({
            ...this.state,
            value: event.target.value
        })
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
    render() {
        let id = uniqueId();
        if (this.props.Instance !== undefined) {
            id = this.props.Instance.ID + this.props.PID;
        }
        let controltype = "AITextBox";
        if (this.props.Control !== undefined)
            controltype = this.props.Control?.controlType;
        let IsReadOnly = this.props.Control?.IsReadOnly ?? false;
        if (!IsReadOnly)
            IsReadOnly = this.props.disable ?? false;
        return (
        <>
                {this.props.TitleFree ? null : <Label className='text-truncate' htmlFor={id}>{this.props.Title}</Label>}
                {
                    /* this.props.Mode === "TempData" || !IsReadOnly ?*/
                    <Input readOnly={IsReadOnly} id={id} className={controltype === "AITextBox" ? "" : "h-100"}
                        bsSize="sm" type={controltype === "AITextBox" ? "text" : "textarea"}
                            placeholder={this.props.Title} value={this.state.value || ''}
                            onChange={this.onChange.bind(this)} ></Input>
                        //: <Label>{this.state.value}</Label>
                }
                </>
        );
    };
}
//<FormGroup>
//    {this.props.TitleFree ? null : <Label htmlFor={id}>{this.props.Title}</Label>}
//    <Input placeholder={this.props.Title} value={this.props.PValue} onChange={this.onChange.bind(this)} />
//</FormGroup>