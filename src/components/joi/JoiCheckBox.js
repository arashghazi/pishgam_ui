import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Input, Label } from "reactstrap";
import uuid from 'react-uuid'

const JoiCheckBox = ({ sourceid, destination, oprator, title, Control }) => {
    let id = uuid();
    let IsReadOnly = false;
    if (Control !== undefined)
    IsReadOnly = Control.IsReadOnly !== undefined ? Control.IsReadOnly : false;
    return (
        <FormGroup className="form-check">
            <Input readOnly={IsReadOnly} type="checkbox" id={id} />
            <Label htmlFor={id} check>
            {title}
            </Label>
       </FormGroup>
    );
  };
  
  JoiCheckBox.propTypes = {
    sourceid: PropTypes.string,
    destination: PropTypes.object,
    oprator: PropTypes.string,
    title: PropTypes.string
  };
  
  JoiCheckBox.defaultProps = {
    oprator: '=',
    title: 'بی نام'
  };
  
  export default JoiCheckBox;
  