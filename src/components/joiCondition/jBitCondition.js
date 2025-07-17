import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Label } from "reactstrap";
import uuid from 'react-uuid'

export default class jBitCondition extends React.Component {
    state = {...defualtState}
    onChange() {

    }
    render() {
        let id = uuid();
        return (
            <FormGroup>
                <Label htmlFor={id}>{this.props.title}</Label>
                <Input id={id} placeholder={this.props.placeHolder} aria-label="Search"
                    className="search-input" value={this.state.Contexts[0].Context} onChange={this.onChange.bind(this)} />
            </FormGroup>
        );
    };
}
jBitCondition.propTypes = {
    PID: PropTypes.string,
    PRA: PropTypes.string,
    IPV: PropTypes.string,
    NLC: PropTypes.string,
    SRC: PropTypes.string,
};

jBitCondition.defaultProps = {
    PID: '',
    PRA: '',
    IPV: '',
    NLC: '',
    SRC: ''
};

