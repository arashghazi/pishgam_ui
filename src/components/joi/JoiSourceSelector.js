import React, { Component } from 'react';
import { DropdownMenu, Input, Label } from "reactstrap";
import uuid from 'react-uuid'
import Flex from '../common/Flex';
import { CustomInput } from 'reactstrap';
import { Dropdown } from 'reactstrap';
import { DropdownToggle } from 'reactstrap';
import { DropdownItem } from 'reactstrap';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { grays } from '../../helpers/utils';

export default class JoiSourceSelector extends Component {
    state = {
        value: ''
        , isOpen: false
        , switch: false
        , prop: null
        , source: []
    }
    selectedChanged(event, actionMeta) {
        //let props = this.props.Instance.Prop;
        //let editedProp = this.props.Instance.Prop.find(x => x.PID === this.props.PID)

        //let value = "";
        //if (newValue.id !== undefined)
        //    value = newValue.id;
        //if (editedProp === undefined) {
        //    this.props.Instance.Prop = [...this.props.Instance.Prop, { PID: this.props.PID, IPV: value, state: 2 }]
        //}
        //else {
        //    this.props.Instance.Prop.splice(this.props.Instance.Prop.findIndex(x => x.PID === this.props.PID), 1, {
        //        ...editedProp, IPV: value
        //    });
        //}

        //this.setState({ ...this.state, value: newValue })
        let selectedobject = this.state.source.find(x => x.id === event.target.value);
        if (selectedobject !== undefined) {
            this.props.onChange(selectedobject.id, selectedobject, this.props.Instance);
        }
        this.setState({ ...this.state, value: event.target.value });
    }
    source = [];
    SwitchSource(id, event) {
        let prop = this.props.Instance.Prop.find(x => x.PID === this.props.PID)
        if (prop === undefined) {
            prop = { PID: this.props.PID, IPV: '' };
            this.props.Instance.Prop = [...this.props.Instance.Prop, prop];
        }
        if (prop.source === undefined && event.target.checked)
            prop.source = [{ ...this.props.source.find(x => x.id === id) }];
        else if (event.target.checked) {
            if (prop.source.find(x => x.id === id) === undefined)
                prop.source = [...prop.source, { ...this.props.source.find(x => x.id === id) }];
        }
        else
            prop.source.splice(prop.source.findIndex(x => x.id === id), 1);
        this.setState({
            ...this.state, prop: prop
        })
    }
    setprop() {
        if (this.state.prop === null && this.props.Instance?.Prop !== undefined) {
            let prop = this.props.Instance.Prop.find(x => x.PID === this.props.PID)
            let temp = {};
            if (prop !== undefined)
                temp = {
                    ...this.state, prop: prop
                }
            else
                temp = {
                    ...this.state, prop: [], source: this.props.source
                }
            if (this.props.source !== undefined)
                this.setState({
                    ...temp,
                    source: this.props.source
                })
        }
        let value = this.props.Instance?.Prop?.find(x => x.PID === this.props.PID)?.IPV;
        if (value !== undefined && value !== this.state.value) {
            this.setState({ ...this.state, value: value });
        }
    }
    componentDidMount() {
        this.setprop();
    }
    componentDidUpdate() {
        this.setprop();
    }
    localSearch(value) {

        let source = this.props.source.filter(x => x.display.includes(value.target.value))
        this.setState({
            ...this.state,
            source: source
        })
    }

    render() {
        let id = uuid();
        let value = null;
        if (this.props.source !== undefined && this.props.Instance !== undefined && this.props.Instance.Prop !== undefined) {
            let obj = this.props.Instance.Prop.find(x => x.PID === this.props.PID)
            if (obj !== undefined && obj.IPV !== '')
                value = this.props.source.find(x => x.id === obj.IPV)
            else
                value = null;
        }
        let IsReadOnly = false;
        if (this.props.Control !== undefined) {
            IsReadOnly = this.props.Control.IsReadOnly !== undefined ? this.props.Control.IsReadOnly : false;
        }
        return (
            <>
                {this.props.TitleFree ? null : <Label className='text-truncate' htmlFor={id}>{this.props.Title}</Label>}

                {this.props.Mode === "TempData" ?
                    <Dropdown id={id} className='form-control-sm form-control' style={{ paddingRight: 0 }} isOpen={this.state.isOpen} toggle={() => this.setState({ isOpen: !this.state.isOpen })}>
                        <DropdownToggle tag='div' >
                            <Flex justify='between' >
                                <Label className='text-truncate' style={{ paddingRight:12, color: value !== null && value !== undefined ? grays[900] : grays[400] }} >
                                    {value !== null && value !== undefined ? value.display : 'انتخاب نشده'}
                                </Label>
                                <FontAwesomeIcon icon={this.state.isOpen ? faAngleUp : faAngleDown} color={grays[300]} />
                            </Flex>
                        </DropdownToggle>
                        {this.state.source !== undefined ?
                            (<DropdownMenu style={{ maxHeight: "200px", overflowY: 'scroll' }} container="body" right>
                                <DropdownItem key='Unselected' onClick={this.selectedChanged.bind(this, {})} >{'انتخاب نشده'} </DropdownItem >
                                {this.state.source.map((item) => {
                                    let uid = uuid();
                                    return (
                                        <Flex key={item.id}>
                                            {this.props.Mode === "TempData" ?
                                                <CustomInput readOnly={this.props.Control.IsReadOnly !== undefined ? this.props.Control.IsReadOnly : false} 
                        type = "switch" id={uid} name={uid} checked={this.state.prop.source !== undefined ? this.state.prop.source.findIndex(x => x.id === item.id) > -1 : false}
                                                    onChange={this.SwitchSource.bind(this, item.id)} />
                                                : null}
                                            {this.props.Mode === "TempData" || this.state.prop.source === undefined ?
                                                <DropdownItem onClick={this.selectedChanged.bind(this, item)} >{item.display} </DropdownItem > :
                                                (this.state.prop.source.findIndex(x => x.id === item.id) > -1 ?
                                                    <DropdownItem onClick={this.selectedChanged.bind(this, item)} >{item.display} </DropdownItem > : null)}
                                        </Flex>
                                    )
                                })}</DropdownMenu>) : null}

                    </Dropdown>
                    : <Input
                        bsSize="sm"
                        className="form-control-sm form-control"
                        type="select"
                        readOnly={IsReadOnly}
                        value={this.state.value??''}
                        onChange={this.selectedChanged.bind(this)}
                    >
                        <option value="Unselected">
                            انتخاب نشده
                        </option>
                        {
                            this.state.source.map((item) => {
                                let uid = uuid();
                                return (
                                    <option key={item.id} value={item.id}>
                                        {item.display}
                                    </option>
                                );
                            })
                        }
                    </Input>}
            </>
        );
    }
}

