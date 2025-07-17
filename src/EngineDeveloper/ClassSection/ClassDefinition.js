import classNames from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { settings } from '../../config'
import ObjectClassController from '../../Engine/ObjectClassController';
const ClassDefinition = ({ register, errors, data }) => {
    const [entityList, setEntityList] = useState([]);
    useEffect(() => {
        const FetchEntities = async () => {
            let entities = await ObjectClassController.GetAllEntities();
            setEntityList(entities);
        }

        if (entityList.length === 0)
            FetchEntities();

    }, [])
    return (<Fragment>
        <Row>
            {settings.lang.map(lan => (
                <Col key={"context" + lan} lg={12 / settings.lang}>
                    <FormGroup>
                        <Label htmlFor={"context" + lan}>{"Class Name"}
                            <span color='primary' className='pl-1 font-weight-light fs--0'>{lan}</span></Label>
                        <Input
                            type="text"
                            name={"Context" + lan}
                            id={"context" + lan}
                            defaultValue={!!data ? data.Contexts?.find(x => x.Lan === lan)?.Context : ''}
                            placeholder={lan}
                            innerRef={register({
                                required: 'class name is requierd',
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 2 letter'
                                },
                                maxlength: {
                                    value: 250,
                                    message: 'Maximum 250 letter'
                                }
                            })}
                            className={classNames({ 'border-danger': errors["Context" + lan] })}
                        />
                        {errors["Context" + lan] && <span className="text-danger fs--1">{errors["Context" + lan].message}</span>}
                    </FormGroup>
                </Col>
            ))}
        </Row>
        <Row>
            <Col lg={6}>
                <FormGroup>
                    <Label htmlFor='EID'>{"Entity"}
                    </Label>
                    <Input
                        type="select"
                        name='EID'
                        id='EID'
                        defaultValue={data?.EID}
                        value={data?.EID?data.EID:undefined}
                        onChange={(e)=>{data.EID=e.target.value;}}
                        innerRef={register({ required: 'Entity is required' })}
                    >
                        {entityList.map(entity => (<option key={entity.id} value={entity.id}>{entity.display}</option>))}
                    </Input>
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col lg={3} className='mt-2'>
                <FormGroup check inline>
                    <Input
                        type="checkbox"
                        name='Extended.LOH'
                        id='history'
                        defaultChecked={data?.Extended.LOH ?? false}
                        innerRef={register()}
                    />
                    <Label htmlFor='history' check>{"History Log"}</Label>
                </FormGroup>
                <FormGroup check inline>
                    <Input
                        type="checkbox"
                        name='Extended.IsUniqe'
                        id='unique'
                        defaultChecked={data?.Extended.IsUniqe ?? false}
                        innerRef={register()}
                    />
                    <Label htmlFor='unique' check>{"Unique"}</Label>
                </FormGroup>
            </Col>
        </Row>
        
    </Fragment>
    );
};

export default ClassDefinition;