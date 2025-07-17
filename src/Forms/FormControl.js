import React, { Component } from 'react';
import { Col } from 'reactstrap';
import JoiCheckBox from '../components/joi/JoiCheckBox';
import JoiComboBox from '../components/joi/JoiComboBox';
import JoiInput from '../components/joi/JoiInput';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import BasePropertyController from '../Engine/BasePropertyController';
import { SearchObject } from '../Engine/Common';

export default class FormControl extends Component {
    state = {
        pid: '',
        Source: [],
        Psource: ''
    }
    onChange(value, objvalue) {
        this.props.PropertyChange(this.props.source.pid, value, this.props.Instance, objvalue);
    }
    async Initial() {
        if (this.props.pid !== this.state.pid) {
            if (this.props.source.controlType === "ComboBox" || this.props.source.controlType === "SearchControl") {
                let baseproperty = await BasePropertyController.LoadAsync(this.props.source.pid);
                let source = [];
                if (this.props.source.controlType === "ComboBox" && this.state.Source.length === 0)
                    source = await SearchObject('', baseproperty.PSource, '<>');
                this.setState({
                    pid: this.props.pid,
                    Source: source,
                    Psource: baseproperty.PSource
                });
            }
        }
    }
    async componentDidMount() {
        await this.Initial();
    }
    async componentDidUpdate() {
        await this.Initial();
    }
    SetControl = (pid, controlType, title) => {
        let { Instance } = this.props;
        let PValue = this.props.PValue;
        if (Instance.Prop !== undefined) {
            let PItem = Instance.Prop.find(x => x.PID === pid)
            if (PItem !== undefined)
                PValue = PItem.IPV;
        }
        let SelectedControl = null;
        switch (controlType) {
            case "AITextBox":
                SelectedControl = <JoiInput PValue={PValue} onChange={this.onChange.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
            case "MultiLang_TextBox":
                break;
            case "ComboBox":
                SelectedControl = <JoiComboBox {...this.props} onChange={this.onChange.bind(this)} PID={pid} Instance={Instance} Title={title} source={this.state.Source} />
                break;
            case "CheckBox":
                SelectedControl = <JoiCheckBox onChange={this.onChange.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
            case "Slider_CheckBox":
                break;
            case "TreeView":
                break;
            case "SearchControl":
                SelectedControl = <JoiSearchBox PValue={PValue} value={PValue !== null && PValue !== undefined ? PValue.Display : ''} type={this.state.Psource}
                    onChange={this.onChange.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
            case "InstanceControl":
                break;
            case "UserBox":
                break;
            case "Weight":
                break;
            case "RaidoButton":
                break;
            case "MultiLineText":
                break;
            case "TimePeriod":
                break;
            default:
                SelectedControl = <JoiInput PValue={PValue} onChange={this.onChange.bind(this)} PID={pid} Instance={Instance} Title={title} />
                break;
        }
        return SelectedControl;
    }


    render() {
        let { pid, controlType, title } = this.props.source;

        let SelectedControl = this.SetControl(pid, controlType, title);

        return (
            <Col className='pl-3'>
                {SelectedControl}
                {/*<FormGroup >*/}
                {/*        <Label for={pid}>{title}</Label>*/}
                {/*        <Input onChange={this.onChange.bind(this)} name={pid} type={controlType} id={Instance.ID + pid} placeholder={title} value={this.state.PValue} />*/}
                {/*    </FormGroup>*/}
            </Col>
        );
    }
}
