import React from 'react';
import PropTypes from 'prop-types';
import {Input, FormGroup, Label } from "reactstrap";
import uuid from 'react-uuid'

export default class JoiMultiLanInput extends React.Component {

    onChange(event) {
        let context = this.props.Contexts.find(x => x.Lan === 'fa-IR');
        context.Context = event.currentTarget.value;
        this.props.onChange(context)
    }
    render() {

        let id = uuid();
        let context = '';
        if (this.props.Contexts.length > 0)
            context = this.props.Contexts.find(x=>x.Lan==='fa-IR').Context;
        return (
            <FormGroup>
                <Label htmlFor={id}>{this.props.Title}</Label>
                <Input id={id} placeholder={this.props.placeholder} value={context} onChange={this.onChange.bind(this) } />
            </FormGroup>
        );
    };
}
  JoiMultiLanInput.propTypes = {
    sourceid: PropTypes.string,
    destination: PropTypes.object,
    oprator: PropTypes.string,
    Title: PropTypes.string
  };
  
  JoiMultiLanInput.defaultProps = {
    oprator: '=',
    Title: 'بی نام'
  };

  