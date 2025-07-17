import React, { Component } from 'react';
import Flex from '../components/common/Flex';
import { FormGroup, Label, Row } from 'reactstrap';
import { CustomInput } from 'reactstrap';
import uuid from 'uuid'
import CellControl from '../EngineForms/CellControl';
import ComboBox from '../EngineForms/ComboBox';
const options = [
    { id: 'Equal', display: 'برابر' },
    { id: 'Like', display: 'شامل' },
    { id: 'NotEqual', display: 'مخالف' },
    { id: 'BigerThan', display: 'بزرگتر' },
    { id: 'SmallThan', display: 'کوچیکتر' },
    { id: 'IN', display: 'جزو' },
    { id: 'BETWEEN', display: 'بین' },
]
export default class BitCondition extends Component {
    state = { IsVariable: false }
    Data = { PID: '', PRA: '', IPV: '', NLC: 'None', SRC: '' }
    Logicoptions = [
        { id: 'None', display: 'باشد' },
        { id: 'and', display: 'و' },
        { id: 'or', display: 'یا' }
    ]
    componentDidUpdate() {
        this.Data = this.props.Bit;
    }
    PropertyChange(value, obj) {
        this.Data = {
            ...this.Data, PID: obj.ID, t1: obj.Name
        };
        this.props.PropertyChange(this.props.BlockIndex, this.props.Index, this.Data);
    }
    OpratorChanged(value, obj) {
        this.Data = {
            ...this.Data, PRA: obj.id, t2: obj.display
        };
        this.props.PropertyChange(this.props.BlockIndex, this.props.Index, this.Data);
    }
    ValueChanged(value,pid, ins, obj) {
        let text = '';
        if (value?.display !== undefined)
            text = value.display
        else
            text = value;

            this.Data = {
                ...this.Data, IPV: typeof value==='object'?value.id:value, t3: text
            };
        this.props.PropertyChange(this.props.BlockIndex, this.props.Index, this.Data);
    }
    LogicChanged(value,obj) {
        if (obj.id !== 'None') {
            this.Data = {
                ...this.Data, NLC: obj.id, t4: obj.display
            };
            this.props.PropertyChange(this.props.BlockIndex, this.props.Index, this.Data);
            this.props.HasLogic(this.props.BlockIndex, this.props.Index);
        }
        else {
            this.props.RemoveBit(this.props.BlockIndex, this.props.Index);
        }
    }
    VariabalChanged() {

    }
    render() {
        let id = uuid();
        let { ObjectClass } = this.props;
        if (ObjectClass.properties !== undefined) {
            let formcontrol = null;
            let prop = ObjectClass.properties.find(x => x.ID === this.props.Bit.PID)
            if (prop !== undefined) {
                let prop1 = { pid: this.props.Bit.PID, controlType: prop.StyleW2.Control,
                     title: prop.Name,sourceId:prop.PSource,
                    source:prop.source };
                formcontrol = (<>
                    <CellControl prop={this.props.Bit} control={prop1}  bsSize="sm"  key={this.props.Bit.PID}
                        onChange={this.ValueChanged.bind(this)} value={this.props.Bit.IPV}
                        //NotProp 
                        />
                    {
                        this.props.Bit.PRA === 'BETWEEN' ? <CellControl
                            prop={this.props.Bit}
                            control={prop1}
                            onChange={this.ValueChanged.bind(this)}
                            key={this.props.Bit.PID + '1'}
                            Property={prop}
                            source={prop1} /> : null
                    }
                </>);
            }
            if (this.state.IsVariable) {
                formcontrol = (<FormGroup  className='pl-1 pr-1' >
                    <Flex justify='between'>
                        <Label htmlFor={id}>{this.props.Title + '999'}</Label>
                        {
                            this.props.ActiveSwitch !== undefined ?
                                <CustomInput
                                    type="switch"
                                    id={id + '1'}
                                    name={id + '1'}
                                    onChange={() => this.setState({ ...this.state, IsVariable: !this.state.IsVariable })}
                                /> :
                                null
                        }
                    </Flex>
                    <ComboBox source={options} bsSize="sm" />
                </FormGroup>)
            }
            let bitlogic = <FormGroup>
                <Label></Label><h4>)</h4></FormGroup>;
            if (this.props.HasLogic)
                bitlogic = (<FormGroup  className='pl-1 pr-1'  style={{ minWidth: '150px' }}>
                    <Label >ارتباط</Label>
                    <ComboBox
                        bsSize="sm"
                        source={this.Logicoptions}
                         value={this.props.Bit.NLC}
                        onChange={this.LogicChanged.bind(this)}/>
                    
                    </FormGroup>);
            return (
                <Row className='p-1' >
                    <Flex >
                        <FormGroup className='pl-1 pr-1' style={{ minWidth: '150px' }}>
                            <Label >مشخصه</Label>
                            <ComboBox source={this.props.ObjectClass?.properties}  bsSize="sm"
                                value={this.props.ObjectClass?.properties.find(x => x.ID === this.props.Bit.PID)?.ID}
                                onChange={this.PropertyChange.bind(this)} />
                            {/* <Select options={this.props.Properties}
                                classNamePrefix="react-select" bsSize="sm"
                                menuPlacement="auto" className="border"
                                menuPosition="fixed" value={this.props.Properties.find(x => x.value === this.props.Bit.PID)}
                                placeholder={'مشخصه...'}
                                onChange={this.PropertyChange.bind(this)}>
                            </Select> */}
                        </FormGroup>
                        <FormGroup className='pl-1 pr-1'  style={{ minWidth: '120px' }}>
                            <Label >عملگر</Label>
                            <ComboBox source={options}  bsSize="sm"
                                value={options.find(x => x.id === this.props.Bit.PRA)?.id}
                                onChange={this.OpratorChanged.bind(this)}></ComboBox>
                            {/* <Select style={{ minWidth: '120px' }} options={options}
                                classNamePrefix="react-select" bsSize="sm"
                                menuPlacement="auto" className="border"
                                menuPosition="fixed" value={options.find(x => x.value === this.props.Bit.PRA)}
                                placeholder={'عملگر...'}
                                onChange={this.OpratorChanged.bind(this)}>
                            </Select> */}
                        </FormGroup>
                        <FormGroup  className='pl-1 pr-1' >
                        {formcontrol}
                        </FormGroup>
                        {bitlogic}
                    </Flex>
                </Row>
            );
        }
        return null;
    }
}
