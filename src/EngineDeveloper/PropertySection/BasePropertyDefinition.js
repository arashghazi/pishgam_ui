import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { settings } from '../../config';
import BasePropertyController from '../../Engine/BasePropertyController';
import { controlTypeList, dataTypeList, NewProperty } from '../../Engine/Common';
import SearchControl from '../../EngineForms/SearchControl';

const BasePropertyDefinition = ({data,changeData}) => {
    const [prop, setData] = useState(JSON.parse(JSON.stringify(NewProperty)))
    const onChangeContext = (value, lan) => {
        let newdata = {...prop};
        let contextIndex = newdata.Contexts.findIndex(x => x.Lan === lan)
        let obj = { Lan: lan, Context: value }
        newdata.Contexts.splice(contextIndex, contextIndex >= 0 ? 1 : 0, obj);
        setData(newdata);
    }
    const onChange = ({ target }) => {
        prop['StyleW2'][target.name] = target.value;
        setData({...prop})
    }
    const onChangeroot = ({ target }) => {
        prop[target.name] = target.value;
        setData({...prop})
    }
    const SaveBaseProperty =async () => {
        prop.ID = await BasePropertyController.SaveAsync(prop.ID, prop);
        data.properties=[...data.properties,prop];
        changeData({...data});
        setData(JSON.parse(JSON.stringify(NewProperty)))
    }
    return (<>
        <Row>
            <Col>
                {settings.lang.map(lan => (
                    <FormGroup key={"context" + lan} >
                        <Label htmlFor={"context" + lan}>{"Property Name"}
                            <span color='primary' className='pl-1 font-weight-light fs--0'>{lan}</span></Label>
                        <Input bsSize='sm'
                            type="text"
                            name={"Context" + lan}
                            id={"context" + lan}
                            value={prop.Contexts?.find(x => x.Lan === lan)? prop.Contexts?.find(x => x.Lan === lan)?.Context : ''}
                            placeholder={lan}
                            onChange={({ target }) => onChangeContext(target.value, lan)}
                        />
                    </FormGroup>
                ))}
                <FormGroup>
                    <Label htmlFor={"controlType"}>{"Contorol Type"}</Label>
                    <Input bsSize='sm'
                        type="select"
                        name={"Control"}
                        id={"controlType"}
                        value={prop?.StyleW2.Control}
                        onChange={onChange}
                    >
                        {controlTypeList.map((item) => (
                            <option key={item.id} value={item.id}>{item.display}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor={"dataType"}>{"Data Type"}</Label>
                    <Input bsSize='sm'
                        type="select"
                        name={"DataType"}
                        id={"dataType"}
                        value={prop?.StyleW2?.DataType}
                        onChange={onChange}
                    >
                        {dataTypeList.map((item) => (
                            <option key={item.id} value={item.id}>{item.display}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor={"Source"}>{"Class Source"}</Label>
                    <SearchControl id={"Source"} NotProp value={prop.PSource} onChange={(value)=>onChangeroot({target:{name:'PSource',value:value.id}})} type='CLASS' />
                </FormGroup>
                <Button className='btn-block' onClick={SaveBaseProperty} >Save & Add</Button>
            </Col>

        </Row>

    </>);
};

export default BasePropertyDefinition;