import { faBolt, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Card, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import { CommandRow, NewCell } from '../../Engine/Common';

const RowEditor = ({ DM, index }) => {
    const row = DM.formStructuer.rows[index];
    const [columns, setColumns] = useState();
    const [isOpen, toggle] = useState();
    const controls = DM.formStructuer.rows[index].controls??DM.formStructuer.rows[index].sections;
    useEffect(() => {
        if (Array.isArray(controls)) {
            let cc = '';
            controls.map((col, colindex) => cc += (colindex > 0 ? ',' : '') + col.col);
            setColumns(cc);
        }
    }, [DM.formStructuer.rows, index,controls])

    const onChange = ({ target }) => {
        DM.formStructuer.rows[index][target.name] = target.value;
    }
    const onControlChange = ({ target }) => {
        let colSize = target.value.split(',');
        let count = colSize.length;
        if (row.controls.length > count) {
            DM.formStructuer.rows[index].controls.splice(count - 1, row.controls.length - count);
        }
        else {
            for (let i = 0; i < count - row.controls.length; i++) {
                DM.formStructuer.rows[index].controls.push({ ...NewCell })
            }
        }

        for (let i = 0; i < DM.formStructuer.rows[index].controls.length; i++)
            DM.formStructuer.rows[index].controls[i].col = colSize[i];

        DM.ChangeForm(DM.formStructuer);
        let cc = '';
        DM.formStructuer.rows[index].controls.map((col, colindex) => cc += (colindex > 0 ? ',' : '') + col.col);
        setColumns(cc);
    }
    return (
    
        <div className='text-right bg-light'>
        {Array.isArray(controls)?<>
        <ButtonIcon size='sm' className='mr-2 p-0' color='transparent' icon={faBolt}
            onClick={() =>{ DM.formStructuer.rows[index] = {...CommandRow}; DM.ChangeForm(DM.formStructuer);}}
        />
        <ButtonIcon size='sm' className='m-0 p-0' color='transparent' icon={faCog}
            onClick={() => toggle(!isOpen)}
        />
    </>
        :<FontAwesomeIcon icon={faBolt}/>}
        <Modal toggle={() => toggle(!isOpen)} isOpen={isOpen}>
            <ModalHeader toggle={() => toggle(!isOpen)} charCode="X">Row Editor</ModalHeader>
            <ModalBody >
                <Card>
                    <FormGroup>
                        <Label htmlFor='title'>Title
                        </Label>
                        <Input
                            type="text"
                            name='title'
                            id='title'
                            onChange={onChange}
                            defaultValue={row.title}>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Cell Count</Label>
                        <Input type='text' onChange={onControlChange} defaultValue={(columns)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Height</Label>
                        <Input type='text' name='height' onChange={onChange} defaultValue={row.height} />
                    </FormGroup>
                </Card>
            </ModalBody>
        </Modal>
    </div>
    
    );
};

export default RowEditor;