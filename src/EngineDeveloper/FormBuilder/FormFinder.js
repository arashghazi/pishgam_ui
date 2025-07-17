import React, { useState } from 'react';
import { Label } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import ComboBox from '../../EngineForms/ComboBox';
import SearchControl from '../../EngineForms/SearchControl';

const FormFinder = ({ onFormChanged, onClassChanged,addNew }) => {
    const [forms, setForms] = useState();
    const [selForm, setSelForm] = useState();

    const getFroms = async (oc) => {
        if (onClassChanged)
            onClassChanged(oc)
        let temp = await ObjectClassController.GetFormListAsync(oc.id);
        if(addNew)
        temp = [{ id: '', display: '' }, { id: 'new', display: 'new' }, ...temp];
        setForms(temp);
    }
    return (
        <>
            <SearchControl placeholder='Select Class' id={"Source"} NotProp onChange={getFroms} type='CLASS' />
            <Label>Forms</Label>
            <ComboBox onChange={(value)=>{setSelForm(value); onFormChanged(value)}} source={forms} value={selForm} />
        </>
    );
};

export default FormFinder;