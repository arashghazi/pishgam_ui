import React, { useEffect } from 'react';
import { NewInstance } from '../../Engine/BaseInstance';
// import { Utility } from '../../Engine/Common';
// import { InstanceController } from '../../Engine/InstanceController';
import FormManager from '../FormManager';
const InstanceControl = ({ type, onChange, control, prop }) => {
    //const [lastProp, setLastProp] = useState();
    const formId = type + 'F0V0';
    useEffect(() => {
        // const fetch = async () => {
        //     let temp = await InstanceController.LoadInstanceAsync(prop?.IPV);
        //     setLastProp(temp)
        // }
        // if (Utility.IsInstanceID(prop?.IPV))
        //     fetch();
        if (prop?.IPV)
            prop.IsInstance = true;
        }, [prop])
        
        console.log(prop)
    const onChangeDM = (value, pid, data1) => {
        onChange(data1);
    }
    return (<>
        <FormManager key={control.pid} Data={prop?prop?.OBJ:NewInstance(type)} onChange={onChangeDM} formId={formId} CardOff />
    </>
    );
};

export default InstanceControl;