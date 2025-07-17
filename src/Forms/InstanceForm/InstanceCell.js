import React, { Component } from 'react';
import DateControl from '../../components/joi/DateControl';
import JoiCheckBox from '../../components/joi/JoiCheckBox';
import JoiInput from '../../components/joi/JoiInput';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import JoiSourceSelector from '../../components/joi/JoiSourceSelector';
import BasePropertyController from '../../Engine/BasePropertyController';
import { SearchObject } from '../../Engine/Common';
export default class InstanceCell extends Component {
    state = {
        BaseProp: { pid: '', Source:[]},
        PropValue: null,
        DataSetting: {
            isOpen: false
        }
    }
    async Initial() {
        if (this.props.Control.pid !== this.state.BaseProp.pid) {
            if (this.props.Control.controlType === "ComboBox" || this.props.Control.controlType === "SearchControl") {
                let baseproperty = await BasePropertyController.LoadAsync(this.props.Control.pid);
                let source = [];
                if (this.props.Control.controlType === "ComboBox" && this.state.BaseProp.Source !== undefined && this.state.BaseProp.Source.length === 0 && baseproperty !== null) {
                    source = await SearchObject('', baseproperty.PSource, '<>');
                    this.setState({
                        Source: source,
                        Psource: baseproperty.PSource,
                        BaseProp: this.props.Control
                    });
                }
                else if (this.props.Control.controlType === "SearchControl" && this.state.BaseProp.Source !== undefined && this.state.BaseProp.Source.length === 0 && baseproperty !== null) {
                    this.setState({
                        Psource: baseproperty.PSource,
                        BaseProp: this.props.Control
                    });
                }
            }
            else {
                this.setState({
                    ...this.state,
                    BaseProp: this.props.Control
                })
            }
        }
    }
    async componentDidMount() {
        await this.Initial();
    }
    async componentDidUpdate() {
        await this.Initial();
    }
    OpenDataSetting() {
        this.setState({
            ...this.state,
            DataSetting: {
                isOpen: false
            }
        })
    }
    PropertyHandler(value,obj) {
        this.props.onChange(this.props.Control.pid, value, this.props.Instance,obj);
    }
    SetControl (pid, controlType, title){
        let { Instance } = this.props;
        if (Instance === null)
            Instance = {};
        let PValue = this.props.PValue !== undefined ? this.props.PValue : '';
        if (Instance !== null && Instance !== undefined && Instance.Prop !== undefined) {
            let PItem = Instance.Prop.find(x => x.PID === pid)
            if (PItem !== undefined)
                PValue = PItem.IPV;
        }
        let SelectedControl = null;
        switch (controlType) {
            case "MultiLang_TextBox":
                break;
            case "ComboBox":
                //if (this.props.Mode ==="TempData")
                SelectedControl = <JoiSourceSelector Mode={this.props.Mode} Control={this.props.Control} TitleFree={this.props.TitleFree} {...this.props}
                    onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} Title={title} source={this.state.Source} />
                //else
                //    SelectedControl = <JoiComboBox TitleFree={this.props.TitleFree} {...this.props} onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} Title={title} source={this.state.Source} />
                break;
            case "CheckBox":
                SelectedControl = <JoiCheckBox Mode={this.props.Mode} Control={this.props.Control} TitleFree={this.props.TitleFree} onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
            case "Slider_CheckBox":
                break;
            case "TreeView":
                break;
            case "SearchControl":
                SelectedControl = <JoiSearchBox IsMultiValue={this.state.BaseProp} Mode={this.props.Mode} Control={this.props.Control}
                    TitleFree={this.props.TitleFree} value={PValue !== null && PValue !== undefined ? PValue.Display : ''}
                    type={this.state.Psource} onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} placeHolder={title} />
                break;
            case "InstanceControl":
                break;
            case "UserBox":
                break;
            case "Weight":
                break;
            case "RaidoButton":
                break;
            case "TimePeriod":
            case "DatePeriod":
                SelectedControl = <DateControl timePicker={controlType ==="TimePeriod" } Mode={this.props.Mode} Control={this.props.Control} TitleFree={this.props.TitleFree} PValue={PValue} onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} Title={title}/>;
                break;
            case "MultiLineText":
            case "AITextBox":
            default:
                SelectedControl = <JoiInput Mode={this.props.Mode} Control={this.props.Control} TitleFree={this.props.TitleFree} {...this.props}
                    PValue={PValue} onChange={this.PropertyHandler.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
        }
        return SelectedControl;
    }
    render() {
        let { pid, controlType, title } = this.props.Control;
        return this.SetControl(pid, controlType, title)
    }
}
