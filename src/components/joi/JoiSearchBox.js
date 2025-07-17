import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Input, InputGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uuid from 'react-uuid'
import { SearchObject, Utility } from '../../Engine/Common'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import JoiMultiValueItem from './JoiMultiValueItem';
import { InstanceController } from '../../Engine/InstanceController';


export default class JoiSearchBox extends Component {
    state = {
        oprator: 'like N"%#%"',
        placeHolder: 'جستجو',
        type: 'INSTANCE',
        openmenu: false,
        value: '',
        list: [],
        prevalue: '',
        ObjectValue: null,
        isMultiValue: false,
    };
    FirstItem = null;
    async KeyUp(event) {
        event.preventDefault()

        if (event.key === 'Enter') {
            await this.SearchCommand();
        }
    }
    async SearchCommand() {
        if (this.state.NoEmptyValue && this.state.value?.replace(/ /g,'') ==='') return;
        try {
            let result = [];
            let oprator = this.props.operator;
            if (this.props.operator === undefined)
                oprator = "like N'%{#}%'";
            if (Utility.IsInstanceID(this.state.value))
                oprator = "=";
            result = await SearchObject(this.state.value, this.props.type, oprator, '', this.props.PIDS);
            if (result?.length > 1) {
                this.setState({ ...this.state, openmenu: !this.state.openmenu, value: '', list: result });
            }
            else if (result?.length === 1) {
                this.SetValue(result[0])
            }
            else {
                this.setState({ ...this.state, openmenu: !this.state.openmenu, value: '', list: [] });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async onChange(event) {

        this.setState({
            ...this.state,
            value: event.target.value,
        })
    }
    async toggle(event) {
        let selectedobject = this.state.list.find(x => x.id === event.target.value);
        if (selectedobject !== undefined) {
            this.setState({ ...this.state, openmenu: false, value: selectedobject.display });
        }


    }
    ItemSelected(event) {
        event.preventDefault()
        let selectedobject = this.state.list.find(x => x.id === event.target.value);
        this.SetValue(selectedobject);
    }
    SetValue(selectedobject) {
        if (selectedobject !== undefined) {
            this.setState({
                ...this.state,
                value: selectedobject.display,
                ObjectValue: selectedobject
            });
            this.props.onChange(selectedobject.id, selectedobject);
        }
    }

    async componentDidMount() {
        this.LoadDefaultValue();
    }
    async componentDidUpdate() {
        if (this.FirstItem !== null)
            ReactDOM.findDOMNode(this.FirstItem).focus();
        await this.LoadDefaultValue();
    }
    async LoadDefaultValue() {
        if (this.props.NoEmptyValue!==this.state.NoEmptyValue) {
            this.setState({
                ...this.state,
                NoEmptyValue: true
            })
        }

        if (this.props.Instance?.Prop !== undefined) {
            let defaultValue = this.props.Instance.Prop.find(x => x.PID === this.props.PID)
            if (defaultValue?.IPV !== this.state.ObjectValue?.id && Utility.IsInstanceID(defaultValue?.IPV)) {
                let newDisplay = defaultValue.DIS;
                if (newDisplay !== undefined) {
                    let objvalue = await InstanceController.GetDisplay(defaultValue.IPV);
                    if (objvalue?.display)
                        newDisplay = objvalue.display;
                }
                this.setState({
                    ...this.state,
                    value: newDisplay,
                    ObjectValue: { id: defaultValue?.IPV, display: newDisplay }
                });
            }
            else if (defaultValue?.IPV !== this.state.ObjectValue?.id) {
                this.setState({
                    ...this.state,
                    value: '',
                    ObjectValue: null
                });
            }
        }
        if (Utility.IsInstanceID(this.props.PValue) && this.state.ObjectValue === null) {
            let result = await SearchObject(this.props.PValue, this.props.type, '=');
            this.setState({
                ...this.state,
                value: '',
                ObjectValue: result
            });
        }
        if (this.props.PValue === 'Clear' && (this.state.ObjectValue !== null || this.state.value !== '')) {
            this.setState({
                ...this.state,
                value: '',
                ObjectValue: null
            });
        }
    }
    Values() {
        return <div className=" d-flex flex-wrap "><JoiMultiValueItem /></div>;
    }
    handleFocus = (e) => {
        e.target.select();
    };
    render() {
        let id = uuid();
        let IsReadOnly = false;
        if (this.props.Control !== undefined)
            IsReadOnly = this.props.Control.IsReadOnly !== undefined ? this.props.Control.IsReadOnly : false;
        return (
            <>
                {this.props.Mode === "TempData" || !IsReadOnly ?
                    <> {this.props.TitleFree ? null : <Label className='text-truncate' htmlFor={id}>{this.props.placeHolder}</Label>}
                        <Dropdown isOpen={this.state.openmenu} toggle={this.toggle.bind(this)} >
                            <DropdownToggle
                                tag="div"
                                data-toggle="dropdown"
                                aria-expanded={this.state.openmenu}>
                                <InputGroup size="sm" className="d-flex">
                                    <Input id={id} ref={this.inputRef} placeholder={'جستجوی ' + this.props.placeHolder} aria-label="Search"
                                        className="search-input" value={this.state.value} onChange={this.onChange.bind(this)}
                                        onFocus={this.handleFocus} readOnly={this.props.loading}
                                        onKeyUp={this.KeyUp.bind(this)} />
                                    <Button color='light' size="sm" disabled={this.props.loading} onClick={this.SearchCommand.bind(this)} >
                                        <FontAwesomeIcon icon="search" />
                                    </Button>
                                </InputGroup>
                                {this.state.isMultiValue ? this.Values() : null}
                            </DropdownToggle>
                            {this.state.list?.length > 0 ?
                                <DropdownMenu style={{ maxHeight: "200px", overflowY: 'scroll' }}>
                                    {
                                        this.state.list.map((item, index) => {
                                            return <DropdownItem ref={(input) => { if (index === 0) this.FirstItem = input; }}
                                                onClick={this.ItemSelected.bind(this)}
                                                className="p-2" value={item.id} key={item.id}>{item.display}</DropdownItem>
                                        })
                                    }
                                </DropdownMenu> : null}
                        </Dropdown> </> : <Label className='text-truncate'> {this.state.value}</Label>}
            </>
        );
    }
};

JoiSearchBox.propTypes = {
    oprator: PropTypes.string,
    placeHolder: PropTypes.string,
    type: PropTypes.string,
    openmenu: PropTypes.bool,
    value: PropTypes.string,
    ReadOnly: PropTypes.bool,
};

JoiSearchBox.defaultProps = {
    oprator: 'like N"%#%"',
    placeHolder: 'جستجو',
    type: 'INSTANCE',
    openmenu: false,
    value: '',
    ReadOnly: false
};
