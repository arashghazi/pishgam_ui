import React, { Component } from 'react';
import { FormGroup, Label } from "reactstrap";
import uuid from 'react-uuid'
import Select from 'react-select';
import Flex from '../common/Flex';
import { CustomInput } from 'reactstrap';
export default class JoiComboBox extends Component {
    state = {
        value: null
    }
    selectedChanged(newValue, actionMeta) {
        this.props.onChange(newValue.value, newValue)
    }
   
    
    
    render() {
        let id = uuid();
        let options = [];
        let defaultvalue = {};
        if (this.props.Instance !== undefined && this.props.Instance.Prop !== undefined
            && this.props.Instance.Prop.find(x => x.PID === this.props.PID) !== undefined
            && this.props.Instance.Prop.find(x => x.PID === this.props.PID).source !== undefined
            && this.props.Instance.Prop.find(x => x.PID === this.props.PID).source.length > 0) {
            this.props.Instance.Prop.find(x => x.PID === this.props.PID).source.map((item) => {
                let obj = { value: item.id, label: item.display }
                options = [...options, obj]
                return options;
            });
        }
        else if (this.props.source !== undefined)
            this.props.source.map((item) => {
                let obj = { value: item.id, label: item.display }
                options = [...options, obj]
                return options;
            });
        let value = options.find(x => x.value === this.props.PValue);
        if (this.props.Instance !== undefined && this.props.Instance.Prop !== undefined) {
            let obj = this.props.Instance.Prop.find(x => x.PID === this.props.PID)
            if (obj !== undefined && obj.IPV !== '')
                value = options.find(x => x.value === obj.IPV)
            else
                value = null;
        }
        
        return (
            <div style={{ minWidth: this.props.minWidth !== undefined ? this.props.minWidth:'100px' }}>
                <Flex justify='between'>
                    {this.props.TitleFree ? null : <Label htmlFor={id}>{this.props.Title}</Label>}
                    {
                        this.props.ActiveSwitch !== undefined?
                    <CustomInput
                                type="switch"
                                
                                id={id+'1'}
                                name={id + '1'}
                                onChange={(svalue) => this.props.SwitchChanged !== undefined ? this.props.SwitchChanged(svalue) : null}
                            /> :
                            null
                    }
                </Flex>

                <Select className="border" options={options}
                    classNamePrefix="react-select"
                    menuPlacement="auto"
                    menuPosition="fixed"
                    placeholder={''}
                    defaultvalue={defaultvalue}
                    value={value}
                    id={id}
                    isRtl={true}
                    isDisabled={this.props.isDisabled}
                    onChange={this.selectedChanged.bind(this)}
                />
            </div>
        );
    }
}  
//<FormGroup style={{ ...this.style, ...this.props.style, minWidth: '150px' }}>
