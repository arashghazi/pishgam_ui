import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CustomInput, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label } from 'reactstrap';
import Flex from '../components/common/Flex';
import { grays } from '../helpers/utils';
import uuid from 'uuid/v1';

const ComboMultiControl = ({ id, prop, control, onChange, refrence,dm }) => {
    useEffect(() => {
            setValue(prop??'');
    }, [prop])
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState();
    const [sourceList, setSourceList] = useState(prop?.stepSource??[]);
    const SwitchSource = (item) => {
        let index = sourceList.findIndex(x => x.id === item.id)
        let temp = [...sourceList];
        if (index < 0) {
            temp = [...temp, item];
            setSourceList(temp)
        }
        else {
            temp.splice(index, 1)
            setSourceList(temp)
        }
        dm.ChangeStepSource(temp, control.pid, refrence)
    }
    // const SwitchSource = (item) => {
    //     const temp = new Set(sourceList.map(x => x.id));
    //     if (!temp.has(item.id)) {
    //       setSourceList(prevList => [...prevList, item]);
    //     } else {
    //       setSourceList(prevList => prevList.filter(x => x.id !== item.id));
    //     }
    //     dm.ChangeStepSource([...sourceList, item], control.pid, refrence);
    //   };
    return <Dropdown id={id} className='form-control-sm form-control' style={{ paddingRight: 0 }}
        isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle tag='div' >
            <Flex justify='between' >
                <Label className='text-truncate' style={{ paddingRight: 12, color: value ? grays[900] : grays[400] }} >
                    {value?.DIS ?? 'انتخاب نشده'}
                </Label>
                <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} color={grays[300]} />
            </Flex>
        </DropdownToggle>
        {control.source ?
            (<DropdownMenu style={{ maxHeight: "200px", overflowY: 'scroll' }} container="body" right>
                <DropdownItem key='Unselected' onClick={onChange} >{'انتخاب نشده'} </DropdownItem >
                {control.source.map((item) => {
                    let uid = uuid();
                    return (
                        <Flex key={item.id}>
                            <CustomInput type="switch" id={uid} name={uid}
                                checked={sourceList?.findIndex(x => x.id === item.id) > -1}
                                onChange={({ target }) => SwitchSource(item)} />
                            <DropdownItem onClick={() => { setValue({ ID: item.id, DIS: item.display }); onChange({ ID: item.id, DIS: item.display }) }} >{item.display} </DropdownItem >
                        </Flex>
                    )
                })}</DropdownMenu>) : null}

    </Dropdown>
};
export default ComboMultiControl;