import React, {  useState } from 'react';
import { CardBody } from 'reactstrap';
import GetDisplay from '../Engine/Lan/Context';
import WhereCondition from './WhereCondition';

const ConditionHandler = ({ Condition, onChange,Editable }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Close = () => {
        setIsOpen(false)
        let title  = '';
        Condition.sqlCondition.BCs.map((block) => {
            block.Bts.map((bit) => title  += `${bit.t1 ?? ''} ${bit.t2 ?? ''} ${bit.t3 ?? ''} ${bit.t4 ?? ''} `)
        })
        Condition.sqlCondition.title=title;
        onChange(Condition);
    }
    
    return (
        <CardBody onClick={() => setIsOpen(Editable && !isOpen)} key={Condition.ID} >
            {Condition?.sqlCondition?.title ?? GetDisplay('noCondition')}
            <WhereCondition Close={Close} isOpen={isOpen} OCID={Condition.ID} Condition={Condition.sqlCondition} />
        </CardBody>
    );
};

export default ConditionHandler;