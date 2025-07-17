import React, { useEffect, useState } from 'react';
import { Card, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import ComboBox from '../../EngineForms/ComboBox';
import FormFinder from '../FormBuilder/FormFinder';

const CellEditor = ({ rowIndex, colIndex, DM,children,formId}) => {
    const form = DM.formStructuer;
    const [isOpen,setIsOpen]=useState();
    const [forms, setForms] = useState();
    const toggle=()=>{
        setIsOpen(!isOpen);
    }
    const controls = DM?.formStructuer?.rows[rowIndex]?.controls??DM?.formStructuer?.rows[rowIndex]?.sections;
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
        if (!forms)
            fetchData();
    })
    const cell =controls? controls[colIndex]:null;
    console.log(cell,forms,forms?.filter(x=>x.id!==form.FormID))
    const onChange = ({ target }) => {
        controls[colIndex][target.name] = target.value;
        DM.ChangeForm(DM.formStructuer);
    }
    const onFormChanged = (value) => {
        controls[colIndex].formid = value;
        DM.ChangeForm(DM.formStructuer);
    }
    const onEditorChanged = (value) => {
        controls[colIndex].Editor = value;
        DM.ChangeForm(DM.formStructuer);
    }
    const onClick=(e)=>{
        if(e.detail===2){
            toggle(true)
        }
    }
    return (<div onClick={onClick}> 
    {children}
        {controls && controls[colIndex]?.formid?null:<div>{'Select a form'}</div>}
        <Modal toggle={toggle} isOpen={isOpen}>
            <ModalHeader toggle={toggle} charCode="X">Cell Editor</ModalHeader>
            <ModalBody  >
                <Card >
                    <FormGroup>
                        <Label htmlFor='title'>Title
                        </Label>
                        <Input
                            type="text"
                            name='title'
                            id='title'
                            onChange={onChange}
                            defaultValue={cell?.title}>
                        </Input>
                    </FormGroup>
                    <FormFinder name='formid'  onFormChanged={onFormChanged} />
                    <FormGroup>
                        <Label>Editor</Label>
                        <ComboBox source={forms?.filter(x=>x.id!==cell.formid)} name='Editor' value={cell.Editor} onChange={onEditorChanged} />
                    </FormGroup>
                </Card>
            </ModalBody>
        </Modal></div>
    );
};

export default CellEditor;