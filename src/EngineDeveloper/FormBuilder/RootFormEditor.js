import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Card, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import Flex from '../../components/common/Flex';
import { commandList, formTypes } from '../../Engine/Common';
import { InstanceController } from '../../Engine/InstanceController';
import ComboBox from '../../EngineForms/ComboBox';
import { ThemeDivider } from '../../EngineForms/ThemeControl';

const RootFormEditor = ({ DM }) => {
    const [relation, setRelation] = useState({});
    const [relationTypes, setRelationTypes] = useState([]);
    useEffect(() => {
        const fetchRelations = async () => {
            let rts = await InstanceController.GetInstancesAsync('E0C12');
            setRelationTypes(rts);
        }
        if (relationTypes.length === 0)
            fetchRelations();
    })
    const form = DM.formStructuer;
    const [relations,setRelations] =useState(form.Relations);
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
    const onChange = ({ target }) => {
        //let temp=formTypes.find(x => x.id===target.value);
        form.ShowType = target.value;
        DM.ChangeForm(form);
        // let state={...DM.state,FormType:temp.index};
        // DM.ChangeState(state);
    }
    const relationChange = ({ target }) => {
        relation[target.name] = target.value;
        setRelation(relation)

    }
    const relationTypeChange = (value) => {
        relation['ID'] = value;
        setRelation(relation)

    }
    const AddRelation = () => {
        if (!form.Relations)
            form.Relations = [];
        form.Relations.push(relation)
        setRelation({});
        DM.ChangeForm(form);
    }
    const changeRow=({target})=>{
        if(form.rows.length>target.value){
            form.rows.splice(target.value-1,form.rows.length-target.value);
        }
        else {
            let rowcount = target.value-form.rows.length;
            for (let i = 0; i < rowcount; i++) {
                form.rows.push({
                    height: "auto",
                    controls: []
                })
            }
        }
        DM.ChangeForm(form);
    }
    const Deleted=(item)=>{
        let index = form.Relations.findIndex(x=>x.ID===item.ID);
        form.Relations.splice(index, 1);
        setRelations([...form.Relations])
    }
    return (
        <Card>
            <FormGroup>
                <Label htmlFor='formtype'>{"Form Type"}
                </Label>
                <Input
                    type="select"
                    name='ShowType'
                    id='formtype'
                    onChange={onChange}
                    defaultValue={form.ShowType}
                    bsSize='sm'>
                    {formTypes.map(entity => (<option key={entity.id} value={entity.id}>{entity.display}</option>))}
                </Input>
            </FormGroup>
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
            <div>
            <ThemeDivider >Relations</ThemeDivider>
            </div>
            <FormGroup>
                <Label htmlFor='EID'>{"Relation Type"}
                </Label>
                <ComboBox value={relation.ID} onChange={relationTypeChange} name='ID' source={relationTypes} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor='FormID'>{"Form"}
                </Label>
                <Input
                    type="text"
                    name='FormID'
                    id='FormID'
                    defaultValue={relation.FormID}
                    onChange={relationChange}>
                </Input>
            </FormGroup>
            <ButtonIcon icon={faPlus} onClick={AddRelation}>AddRelation</ButtonIcon>
            <ListGroup>
                {relations?.map((item) => (
                    <ListGroupItem>{item.ID + '-' + item.FormID}
                    <FontAwesomeIcon onClick={()=>Deleted(item)} size='1x' icon={'trash'} className="text-danger" />
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Card>
    );
};

export default RootFormEditor;