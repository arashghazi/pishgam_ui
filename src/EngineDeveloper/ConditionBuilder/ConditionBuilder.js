import { faSave } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import ConditionMaker, { ConditionManager, EngineCondition } from '../../Engine/ConditionMaker';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
import FormFinder from '../FormBuilder/FormFinder';
import WhereBuilder from './WhereBuilder';

const ConditionBuilder = () => {
    const [data, setData] = useState(new ConditionManager());
    const onChange = ({ target }) => {
        data[target.name] = target.value;
        setData(data);
    }
    const ConditionChanged = (newdata) => {
        console.log(newdata)
        setData(newdata);
    }
    const Maker = (condition) => {
        let result;
        if (condition) {
            let cmp = <WhereBuilder key={condition?.ID ?? 'test'}
                onChange={ConditionChanged}
                Condition={condition}
                Data={data} />;
            result = [cmp];
            if (condition?.nextCondition) {
                let temp = Maker(condition.nextCondition);
                if(temp)
                result = [...result, ...temp];
            }

        }
        return result;
    }
    const addCondition = (condition) => {
        if (condition.nextCondition === null) {
            condition.nextCondition = new EngineCondition();
            setData({ ...data })
        }
        else
            addCondition(condition.nextCondition);
    }
    return (
        <Card>
            <ThemeCardHeader title='Condition Builder'>
                <ButtonIcon icon={faSave} color='primary' />
            </ThemeCardHeader>
            <CardBody>
                <Row>
                    <Col >
                        <ThemeCardHeader title='Main Values' />
                        <Label>Condition ID</Label>
                        <Input type='text' name='FormID' onChange={onChange} />
                        <Label>Title</Label>
                        <Input type='text' name='title' onChange={onChange} />
                        <Label>Result Form</Label>
                        <FormFinder onFormChanged={(value) => onChange({ target: { name: 'ResultFormID', value } })} />
                        <Label>Action Link</Label>
                        <Input type='text' name='ActionLink' onChange={onChange} />
                        <Label>Action Form</Label>
                        <FormFinder onFormChanged={(value) => onChange({ target: { name: 'ActionFormID', value } })} />
                        <FormGroup check inline>
                            <Label check >
                                <Input
                                    type="checkbox"
                                    name='AutoRun'
                                    onChange={onChange}
                                    defaultChecked={data?.AutoRun}
                                />
                                AutoRun</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Label check >
                                <Input
                                    type="checkbox"
                                    name='Editable'
                                    onChange={onChange}
                                    defaultChecked={data?.Editable}
                                />
                                Editable</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Label check >
                                <Input
                                    type="checkbox"
                                    name='ActiveCommand'
                                    onChange={onChange}
                                    defaultChecked={data?.ActiveCommand}
                                />
                                Command Active</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Label check >
                                <Input
                                    type="checkbox"
                                    name='IsReadOnly'
                                    onChange={onChange}
                                    defaultChecked={data?.IsReadOnly}
                                />
                                IsReadOnly</Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <ThemeCardHeader title='Conditions' />
                        {Maker(data?.MainCondition)}
                        <Button block onClick={() => addCondition(data.MainCondition)}>+</Button>

                    </Col>
                </Row>
            </CardBody>
        </Card >
    );
};

export default ConditionBuilder;