import React from 'react';
import { Card, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { controlTypeList } from '../../Engine/Common';

const CellEditor = ({ toggle, isOpen, rowIndex, colIndex, DM }) => {
    const cell = DM?.formStructuer?.rows[rowIndex]?.controls[colIndex];
    const onChange = ({ target }) => {
        let value =target.value;
        if(target.type === 'checkbox')
            value = target.checked;
        DM.formStructuer.rows[rowIndex].controls[colIndex][target.name] = value;
    }
    return (
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
                    <FormGroup >
                        <Label htmlFor='controlType'>{"Control Type"}</Label>
                        <Input
                            type="select"
                            name='controlType'
                            id='controlType'
                            onChange={onChange}
                            defaultValue={cell?.controlType}>
                            {
                                controlTypeList.map((item) => (
                                    <option key={item.id} value={item.id}>{item.display}</option>

                                ))
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup >
                        <Label htmlFor='required'>{"required message"}</Label>
                        <Input
                            type="text"
                            name='required'
                            id='required'
                            onChange={onChange}
                            defaultValue={cell?.required} />
                    </FormGroup>
                    <FormGroup >
                        <Label htmlFor='regex'>{"Regular Expression"}</Label>
                        <Input
                            type="text"
                            name='regex'
                            id='regex'
                            onChange={onChange}
                            defaultValue={cell?.regex} />
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input
                                type="checkbox"
                                name='IsReadOnly'
                                id='IsReadOnly'
                                onChange={onChange}
                                defaultChecked={cell?.IsReadOnly ?? false}
                            />
                            Readonly</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input
                                type="checkbox"
                                name='Editable'
                                id='Editable'
                                onChange={onChange}
                                defaultChecked={cell?.Editable ?? false}
                            />
                            Editable</Label>
                    </FormGroup>
                </Card>
            </ModalBody>
        </Modal>
    );
};

export default CellEditor;