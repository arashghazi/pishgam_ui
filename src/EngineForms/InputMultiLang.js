import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { SearchObject, Utility } from '../Engine/Common';

const InputMultiLang = ({ onChange, type, prop }) => {
    useEffect(() => {
        setValue(prop?.IPV);
    }, [prop])
    let FirstItem = null;
    const [value, setValue] = useState('');
    return <InputGroup>
        <Input placeholder="username" />
        <InputGroupAddon addonType="prepend">en</InputGroupAddon>
    </InputGroup>
};
export default InputMultiLang;