import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Label } from "reactstrap";
import uuid from 'react-uuid'

export default class jWhereCondition extends React.Component {
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
jWhereCondition.propTypes = {
    BCs: PropTypes.object,
    OCID: PropTypes.string
};

jWhereCondition.defaultProps = {
    BCs: [],
    OCID: ''
};

