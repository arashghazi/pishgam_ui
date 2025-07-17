import React from 'react';
import { Input } from 'reactstrap';
import uuid from 'uuid'
const ComboBox = ({source,onChange,value,...rest}) => {
let uid =uuid();
    return (
        <Input type='select' bsSize={rest.bsSize}
        value={value}
        onChange={({target}) =>{onChange && onChange(target.value,source.find(x=>(x.id===target.value || x.ID===target.value) ),target)}}
        >
            <option></option>
        {source?.map(x=>{
            const id=x.id??x.ID;
            const display=(x.display??x.DIS)??x.Name;
            return(
            <option value={id} key={uid+id} >{display}</option>
        )})}
        </Input>
    );
};

export default ComboBox;