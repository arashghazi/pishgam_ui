import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Label } from "reactstrap";
import uuid from 'react-uuid'

export default class jBlockCondition extends React.Component {
    state = {
        Contexts: [{ Context: '' }]
    }
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
jBlockCondition.propTypes = {
    Bts: PropTypes.object,
    NLC: PropTypes.string
};

jBlockCondition.defaultProps = {
    Bts: [],
    NLC: ''
};

