import React from 'react'
import { Input } from 'reactstrap'
import moment from 'jalali-moment'
import Parameters from '../Engine/Parameters';
import { settings } from '../Engine/BaseSetting';
const ReadonlyObjectControl = ({ prop,control,style }) => {
    let value =prop?.DIS ?? prop?.IPV;
    if(prop?.IPV && control.controlType==='TimePeriod')
        value=settings.lang[0]==='fa-IR'? moment(prop?.IPV, 'MM/DD/YYYY').locale('fa').format('YYYY/MM/DD'):prop?.IPV;
    return <Input aria-label="Search" bsSize='sm' style={style}
        className="search-input" value={value}
        key={prop?.IPV ?? 'notloaded'} disabled
         />
}
export default ReadonlyObjectControl;