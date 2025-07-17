import React, { useState } from 'react';
import { Button, Card, CardBody, Label } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import ComboBox from '../../EngineForms/ComboBox';
import SearchControl from '../../EngineForms/SearchControl';

const WhereBuilder = ({Condition,Data,onChange}) => {
    const [forms, setForms] = useState();

    const getFroms = async (oc) => {
        Condition.ID=oc.id;
        // let temp = await ObjectClassController.GetFormListAsync(oc.id);
        // setForms(temp);
        onChange(Data)
    }
    return (
        <CardBody>
            <SearchControl placeholder='Select Class' id={"Source"} NotProp onChange={getFroms} type='CLASS' />
        </CardBody>
    );
};

export default WhereBuilder;