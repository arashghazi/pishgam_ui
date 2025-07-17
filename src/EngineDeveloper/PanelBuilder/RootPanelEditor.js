import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import Flex from '../../components/common/Flex';
import BasePropertyController from '../../Engine/BasePropertyController';
import { commandList, Utility } from '../../Engine/Common';
import ObjectClassController from '../../Engine/ObjectClassController';
import ComboBox from '../../EngineForms/ComboBox';
import { ThemeDivider } from '../../EngineForms/ThemeControl';

const RootPanelEditor = ({ DM }) => {
    const form = DM.formStructuer;
    const [forms, setForms] = useState([]);
    const [BPList, setBPList] = useState([]);
    const [SPList, setSPList] = useState([]);
    const [connector, setConnector] = useState({});
    const [tempcon, setTempcon] = useState({});
    const [con, setCon] = useState({});
    const [conprop, setConprop] = useState([]);
    const [tempconprop, setTempConprop] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let tempForms = [];
            for (let i = 0; i < form.rows.length; i++) {
                const controls = form.rows[i].controls ?? form.rows[i].sections;
                if (controls) {
                    for (let j = 0; j < controls.length; j++) {
                        const element = controls[j]?.formid;
                        if (element) {
                            let tempform = await ObjectClassController.GetFormAsync(element);
                            tempForms = [...tempForms, { id: tempform.FormID, display: tempform.title }];
                        }
                    }
                }
            }
            setForms(tempForms);
        }
        if (forms.length === 0)
            fetchData();
    })
    const change = ({ target }) => {
        form[target.name] = target.value;
        DM.ChangeForm(form);
    }
    const toggelCommand = (id) => {
        console.log(form)
        let index = form.Commands.findIndex(x => x === id);
        if (index < 0)
            form.Commands.push(id);
        else
            form.Commands.splice(index, 1);
        DM.ChangeForm(form);
    }
    const changeRow = ({ target }) => {
        if (form.rows.length > target.value) {
            form.rows.splice(target.value - 1, form.rows.length - target.value);
        }
        else {
            for (let i = 0; i < target.value - form.rows.length; i++) {
                form.rows.push({
                    height: "auto",
                    controls: []
                })
            }
        }
        DM.ChangeForm(form);
    }
    const formTitle = async (formid) => {
        let form = await ObjectClassController.GetFormAsync(formid);
        return form.title;
    }
    const propertyTitle = async (propid) => {
        let prop = await BasePropertyController.LoadAsync(propid);
        return prop?.Name;
    }
    const onChange = async (value, ctrl) => {

        connector[ctrl] = value;
        setConnector({ ...connector })
        let source = await ObjectClassController.LoadAsync(Utility.GetClassID(value));
        if (ctrl === 'BF')
            setBPList(source.properties)
        else if (ctrl === 'SF')
            setSPList([...source.properties, { id: 'ID', display: 'ID' }])
    }
    const addRelation = () => {
        if (connector.BF && connector.BP && connector.SF && connector.SP) {
            form.Connectors.push(connector);
            setConnector({});
        }
    }
    const ontempConChange =async (value, ctrl) => {
        tempcon[ctrl] = value;
        if (ctrl === 'formId') {
            let source = await ObjectClassController.LoadAsync(Utility.GetClassID(value));
            setTempConprop(source.properties)
        }
        setTempcon({ ...tempcon });
    }
    const addtempCon = () => {
        if(! form.TempCon)
        form.TempCon=[];
        form.TempCon = [...form.TempCon, tempcon]
        setTempcon({})
    }
    const onConChange = async (value, ctrl) => {

        if (ctrl === 'formId') {
            con[ctrl] = value;
            let source = await ObjectClassController.LoadAsync(Utility.GetClassID(value));
            setConprop(source.properties)
            setCon({ ...con });
        }
        else {
            if (!con.PIDs)
                con.PIDs = [];
            con.PIDs = [...con.PIDs, value];
        }
    }
    const addCon = () => {
        if(!form.Con)
            form.Con=[];
        form.Con = [...form.Con, con]
        setCon({})
    }
    return (
        <Card>
            <FormGroup>
                <Label htmlFor='EID'>{"Title"}
                </Label>
                <Input
                    type="text"
                    name='title'
                    defaultValue={form?.title}
                    onChange={change}>
                </Input>
            </FormGroup>
            <ThemeDivider>Connectors</ThemeDivider>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Source Form</Label>
                                <ComboBox source={forms} value={connector.SF} onChange={(value) => onChange(value, 'SF')} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Source Properties</Label>
                                <ComboBox source={SPList} value={connector.SP} onChange={(value) => onChange(value, 'SP')} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>Child Form</Label>
                                <ComboBox source={forms} value={connector.BF} onChange={(value) => onChange(value, 'BF')} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Child Properties</Label>
                                <ComboBox source={BPList} value={connector.BP} onChange={(value) => onChange(value, 'BP')} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <CardBody>
                            <Button block onClick={addRelation}>Add</Button>
                        </CardBody>
                    </Row>
                    <ListGroup>
                        {form.Connectors.map((connect, index) => (<ListGroupItem key={index}>
                            {/* <Label>{formTitle(connect.SF)}</Label>
                    <Label>{propertyTitle(connect.SP)}</Label>
                    <Label>{formTitle(connect.BF)}</Label>
                    <Label>{propertyTitle(connect.BP)}</Label> */}
                            <Label>{connect.SF},</Label>
                            <Label>{connect.SP},</Label>
                            <Label>{connect.BF},</Label>
                            <Label>{connect.BP}</Label>
                        </ListGroupItem>))}
                    </ListGroup>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Data Template Condition</Label>
                                <ComboBox source={forms} value={tempcon.formId} onChange={(value) => ontempConChange(value, 'formId')} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Data Condition</Label>
                                <ComboBox source={tempconprop} value={tempcon.PID} onChange={(value) => ontempConChange(value, 'PID')} />
                            </FormGroup>
                            <Row>
                                <CardBody>
                                <ButtonGroup>
                                    <Button block onClick={addtempCon}>Add</Button>
                                    <Button onClick={()=>form.TempCon=[]}>Clear</Button>
                                </ButtonGroup>
                                </CardBody>
                            </Row>
                            <ListGroup>
                                {form.TempCon?.map((connect, index) => (<ListGroupItem key={index}>
                                    <Label>{connect.formId}:</Label>
                                    <Label>({connect.PID})</Label>
                                </ListGroupItem>))}
                            </ListGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>Data Condition</Label>
                                <ComboBox source={forms} value={con.formId} onChange={(value) => onConChange(value, 'formId')} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Propeties</Label>
                                <ComboBox source={conprop} onChange={(value) => onConChange(value, 'PIDs')} />
                            </FormGroup>
                            <Row>
                                <CardBody>
                                    <Button block onClick={addCon}>Add</Button>
                                </CardBody>
                            </Row>
                            <ListGroup>
                                {form.Con?.map((connect, index) => (<ListGroupItem key={index}>
                                    <Label>{connect.formId}:</Label>
                                    <Label>[{connect.PIDs}]</Label>
                                </ListGroupItem>))}
                            </ListGroup>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col lg={8}>
                    <ThemeDivider>Commands</ThemeDivider>
                    <Flex justify="center" align="center">
                        {commandList.map((item) => (
                            <ButtonIcon key={item.id} className='m-1'
                                color={form?.Commands?.findIndex(x => x === item.id) >= 0 ? "falcon-success" : "falcon-default"}
                                size="sm" icon={item.icon} title={item.title} onClick={() => toggelCommand(item.id)} />
                        ))}
                    </Flex>
                </Col>
                <Col lg={4}>
                    <ThemeDivider>Row Count</ThemeDivider>
                    <Input type='number' onChange={changeRow} defaultValue={form.rows.length} />
                </Col>
            </Row>
        </Card>
    );
};

export default RootPanelEditor;