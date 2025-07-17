import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from 'reactstrap';
import uuid from 'uuid';
import DateControl from './DateControl';
import SearchControl from './SearchControl';
import { Utility } from '../Engine/Common';
import ComboMultiControl from './ComboMultiControl';
import ReadonlyObjectControl from './ReadonlyObjectControl';
import CellEditor from '../EngineDeveloper/FormBuilder/CellEditor';
import InstanceControl from './Controls/InstanceControl';
import classNames from 'classnames';
import GetDisplay from '../Engine/Lan/Context';
import Parameters from '../Engine/Parameters';
import FileControl from './FileControl';
import { AuthenticationController } from '../Engine/Authentication';
import ObjectClassController from '../Engine/ObjectClassController';
import ReactTooltip from 'react-tooltip';
const getControl = (control, mode, prop, OC) => {
    let Tag = '';
    let type = '';
    if (control.IsReadOnly && mode !== 'template') {
        if (control.IsReadOnly === true) {
            Tag = ReadonlyObjectControl;
            type = 'readonly';
        }
        else if (Array.isArray(control.IsReadOnly)) {

            for (let i = 0; i < control.IsReadOnly.length; i++) {
                const element = control.IsReadOnly[i];
                if (AuthenticationController.CheckRole(element.Role) && element.value === true) {
                    Tag = ReadonlyObjectControl;
                    type = 'readonly';
                    break;
                }
            }
        }
    }
    if (!Tag)
        switch (control.controlType) {
            case "MultiLang_TextBox":
                break;
            case "Label":
                    Tag = Label;
                    type = 'Label';
                    break;
            case "ComboBox":
                if (mode === 'template') {
                    Tag = ComboMultiControl;
                    type = 'select1';
                }
                else {
                    Tag = Input;
                    type = 'select';
                }
                break;
            case "CheckBox":
                Tag = Input;
                type = 'checkbox';
                break;
            case "Slider_CheckBox":
                break;
            case "TreeView":
                break;
            case "SearchControl":
                Tag = SearchControl;
                type = control.sourceId;
                break;
            case "InstanceControl":
                Tag = InstanceControl;
                type = control.sourceId;
                break;
            case "UserBox":
                break;
            case "Weight":
                break;
            case "RaidoButton":
                break;
            case "TimePeriod":
            case "DatePeriod":
                Tag = DateControl
                type = 'Date';
                break;
            case "MultiLineText":
                Tag = Input
                type = 'textarea';
                break;
            case "File":
                Tag = FileControl
                type = 'File';
                break;
            case "AITextBox":
            default:
                let propType = OC?.properties?.find(x => x.ID === control.pid)?.StyleW2?.DataType;
                Tag = Input
                if (propType === 'Double')
                    type = 'number'
                else
                    type = 'text';
                break;
        }
    return { Tag, type };
}

const CellControl = ({ control, onChange, labelClassName, TitleOff, refrence, prop, DM, ...rest }) => {
    const [DIPV, setDIPV] = useState();
    const [OC, setOC] = useState();
    useEffect(() => {
        const getValue = async () => {
            if (DM?.ActionType !== 'template') {
                let value = await Parameters.GetValue(control.DIPV);
                if (!prop || (prop.IPV !== (DIPV?.id ?? DIPV))) {
                    setDIPV(value)
                    onChange(value, control.pid, refrence)
                }
            }
        }
        if (refrence && control.DIPV) {
            getValue();
        }
    }, [prop, refrence])
    useEffect(() => {
        const getValue = async () => {
            if (refrence) {
                let oc = await ObjectClassController.LoadAsync(Utility.GetClassID(refrence.ID));
                setOC(oc);
            }
        }
        getValue();
    }, [refrence])
    const { Tag, type } = getControl(control, DM?.ActionType ?? rest.mode, prop, OC);
    const [isOpen, setIsOpen] = useState();
    const inputId = 'A' + uuid().replaceAll('-', '');

    const bsSize = 'sm';
    const onClick = (e) => {
        if (e.detail === 2) {
            setIsOpen(true);
        }
    }
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    let source = prop?.stepSource ?? control?.source;
    const ValueChanged = (event, TP) => {
        let value = event?.target?.value;
        if (type === 'select')
            value = control?.source.find(x => x.id === event.target.value);
        else if (Utility.IsID(type) || type === 'select1')
            value = event;
        else if (type === 'Date' || type === 'File')
            value = event;
        else if (type === 'checkbox') {
            value = event.target.checked;
        }
        onChange(value, control.pid, refrence, TP);
    }
    const tooltipActive = DM?.ActionType!=='template' && prop?.info;
    let style = control?.style;
    if (style) {
        if (type === 'textarea') {
            if (style) style += ','
            style += "height:'85%'"
        }
    }
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center',
    };

    return (<div style={type === 'Label'?containerStyle:null} >
        {!TitleOff && type !== 'Date' && control.title !== '' && (
            <Label onClick={onClick} for={inputId} id={inputId + 'lbl'} className={' text-truncate pb-0 mb-0'}>
                {control.title}

            </Label>
        )}
        {type !== 'Label'?
        <Tag bsSize={bsSize} type={type} value={prop?.IPV ?? ''} prop={prop}
            title={control.title} style={style} data-tip data-for={inputId+'tol'}
            control={control} dm={type === 'select1' ? DM : ''}
            refrence={refrence} notprop={rest.NotProp}
            className={classNames({ 'border-danger': prop?.hasError })}
            checked={(prop?.IPV ?? false) === 'true'}
            onChange={ValueChanged}
            id={inputId} >
            {type === 'select' ? (<>
                <option value="">
                    {GetDisplay('noSelect')}
                </option>
                {
                    source?.sort((a, b) => a.display.localeCompare(b.display))?.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.display}
                            </option>
                        );
                    })
                }</>) : null
            }
        </Tag>:null}
        {prop?.hasError && <span className="text-danger fs--1">{control.required}</span>}
        {rest.mode === 'design' ? <><CellEditor toggle={toggle} DM={DM} isOpen={isOpen} {...rest} /> </> : null}
        {tooltipActive? 
            <ReactTooltip id={inputId+'tol'}  className='extraClass' type='error'>
                <div style={{width:'400px'}}>
                    <span >{prop.info}</span>
                </div>
            </ReactTooltip> : null}
            {DM?.ActionType==='template' && prop?<Input defaultValue={prop.info} placeholder='راهنما' onChange={
                ({target})=>{ if(prop){prop.info=target.value;
                }}
            } ></Input>:null}
    </div>
    );
};

CellControl.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelClassName: PropTypes.string
};

export default CellControl;
