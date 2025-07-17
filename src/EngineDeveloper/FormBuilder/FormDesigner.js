import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faPager, faTable } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import { Utility } from '../../Engine/Common';
import ObjectClassController from '../../Engine/ObjectClassController';
import FormManager from '../../EngineForms/FormManager';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';

const FormDesigner = ({ title,builder,formId,isPanle,setIsPanel }) => {
    let history = useHistory();
    const onClick=async()=>{
        
        await ObjectClassController.SaveFormAsync(builder.DM.formStructuer);

    }
    return (
        <Card>
            <ThemeCardHeader title={title}>
                
                <ButtonIcon icon={faTable} color='transparent'
                 onClick={()=>{
                     if(Utility.IsFormID(builder?.DM?.formStructuer?.FormID))
                        history.push('/env/developer/Formtester/'+builder.DM.formStructuer.FormID);
                    }} /> 
                <ButtonIcon className='mr-1' icon={faPager} color={isPanle?'success':'transparent'} onClick={setIsPanel} />
                <ButtonIcon icon={faSave} color='primary' onClick={onClick} />
            </ThemeCardHeader>
            <CardBody  >
                <FormManager builder={builder} formId={formId} mode='design' />
            </CardBody>

        </Card>
    );
};

export default FormDesigner;