import React, { Component } from 'react';
import { Input, Row, CardTitle, Label, ButtonGroup, Badge} from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import ObjectClassController from '../../Engine/ObjectClassController';
import { faSave, faDesktop, faRedo, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from '../../components/common/Flex';
import PanelRow from './PanelRow';
import FormSelector from '../FormSelector';
import { InstanceController } from '../../Engine/InstanceController';
import PanelSetting from './PanelSetting';
const emptySection = {
    col: "12",
    formid: "",
    connectionPid: "",
    title: ""
}
const defualstate = {
    FormID: 'Panel',
    ShowType:'Panel',
    title: "",
    rows: [
        {
            height: '100px',
            sections: [emptySection]
        }
    ],
    Connectors: [],
    Commands: [
        { Command: "Save", Order: [] },
        { Command: "Delete", Order: [] },
        { Command: "New", Order: [] },
        { Command: "Save-New", Order: [] },
        { Command: "Refresh", Order: [] }
    ],
    /////
    mousein: false,
    modal: {
        isOpen: false,
        source: ''
    },
    Settingmodal: {
        isOpen: false,
        source: ''
    }
}

export default class PanelControl extends Component {
    state = { ...defualstate };
    toggle() {
        this.setState({
            ...this.state,
            modal: false,
            Settingmodal: false
        })
    }
    onChangeRow(row, index) {
        const rows = this.state.rows;
        rows.splice(index, 1, row)
        this.setState({ ...this.state, rows: rows });

    }
    AddSection(rowindex) {
        const rows = this.state.rows;
        rows[rowindex].sections = [...rows[rowindex].sections, { emptySection }];
        this.setState({
            ...this.state,
            rows: rows
        })
    }
    AddRow(event) {
        let index = parseInt(event.currentTarget.value) + parseInt(event.currentTarget.value)
        const row = {
            height: '100px',
            sections: [
                {
                    col: "12",
                    formid: "",
                    connectionPid: "",
                    title: ""
                }
            ]
        };
        const rows = [...this.state.rows];
        rows.splice(index, 0, row);
        this.setState({ ...this.state, rows: rows });
    }
    ChangeTitle(event) {
        this.setState({
            ...this.state,
            title: event.currentTarget.value
        })
    }
    MouseEnter() {
        this.setState({
            ...this.state,
            mousein: true
        })
    }
    MouseLeave() {
        this.setState({
            ...this.state,
            mousein: false
        })
    }
    async SaveForm() {
        let form = { ...this.state };
        delete form.Settingmodal;
        delete form.modal;
        delete form.mousein;

        this.state.FormID = await ObjectClassController.SaveFormAsync(form);
    }
    
    isOpen(source) {
        this.setState({
            ...this.state,
            modal: {
                isOpen: true,
                source: source
            }
        })
    }
    async ModalClosed(source = '', form) {
        if (form !== null) {
            if (source.includes('-')) {
                let rowindex = source.split('-')[0];
                let sectionindex = source.split('-')[1];
                const rows = this.state.rows;
                let section = rows[rowindex].sections[sectionindex];
                section.formid = form.ID;
                section.title = form.Display;

                this.setState({
                    ...this.state,
                    //Commands: commands,
                    modal: {
                        isOpen: false,
                        source: ''
                    }
                });
            }
            else if (source === 'this') {
                let datamodel = await InstanceController.GetFormAsync(form.ID);
                this.setState({
                    ...this.state,
                    ...datamodel,
                    modal: {
                        isOpen: false,
                        source: ''
                    }
                });
            }
        }
        else {
            this.setState({
                modal: {
                    isOpen: false,
                    source: ''
                }
            });
        }
        
    }
    async SettingModalClosed(source = '', form) {
        this.setState({
            ...this.state,
            Settingmodal: {
                isOpen: false,
                source: ''
            }
        })
    }
    Update(datamodel = { Data: '' }) {
        
    }
    LoadForm() {
        this.isOpen("this");
    }
    LoadSetting() {
        this.setState({
            ...this.state,
            Settingmodal: {
                isOpen: true,
                source: ''
            }
        })
    }
    EditSection(rowindex, secindex, prop, value) {
        let rows = this.state.rows;
        rows[rowindex].sections[secindex][prop] = value;
        this.setState({
            ...this.state,
            rows: this.state.rows
        })
    }
    render() {
        return (
            <>
                <div>
                    <Flex justify="between" align="end">
                        <Flex align="start">
                            <FontAwesomeIcon className='float-left mr-1' icon={faDesktop} />
                            <CardTitle tag="h5">طراحی فرم ترکیبی</CardTitle>
                        </Flex>
                        <ButtonGroup align="start">
                            <ButtonIcon color="falcon-default" className="m-1" size="sm" icon={faSave} transform="shrink-1" onClick={this.SaveForm.bind(this)} />
                            <ButtonIcon color="falcon-default" className="m-1" size="sm" icon={faRedo} transform="shrink-1" onClick={this.LoadForm.bind(this)} />
                            <ButtonIcon color="falcon-default" className="m-1" size="sm" icon={faCog} transform="shrink-1" onClick={this.LoadSetting.bind(this)} />
                        </ButtonGroup>
                    </Flex>
                    <Flex justify="between" align="end">
                        <CardTitle>
                            <Label>عنوان فرم</Label><label className='pl-1' ><Badge>{this.state.FormID}</Badge></label>
                            <Input onChange={this.ChangeTitle.bind(this)} value={this.state.title} />
                        </CardTitle>
                    </Flex>
                </div>
                {this.state.rows.map((row, index) => {
                    let topButton = null
                    let BottomButton = null
                    if (index === 0)
                        topButton = (<Row style={{ opacity: 0.3, justifyContent: "center", alignItems: 'center', visibility: this.state.mousein ? 'visible' : 'collapse' }} >
                            <ButtonIcon color="falcon-default" size="sm" icon="plus" index={index} value={0} transform="shrink-3" onClick={this.AddRow.bind(this)} />
                        </Row>);
                    BottomButton = (<Row style={{ opacity: 0.3, justifyContent: "center", alignItems: 'center', visibility: this.state.mousein ? 'visible' : 'collapse' }} >
                        <ButtonIcon color="falcon-default" size="sm" icon="plus" index={index} value={1} transform="shrink-3" onClick={this.AddRow.bind(this)} />
                    </Row>);
                    return (
                        <div key={index} onMouseLeave={this.MouseLeave.bind(this)} onMouseEnter={this.MouseEnter.bind(this)}>
                            {topButton}
                            <PanelRow isOpen={this.isOpen.bind(this)} EditSection={this.EditSection.bind(this)} AddSection={this.AddSection.bind(this)} rowindex={index} row={row} />
                            { BottomButton}
                        </div>
                    )
                })}
                <FormSelector Modal={this.state.modal} Close={this.ModalClosed.bind(this)} />
                <PanelSetting Modal={this.state.Settingmodal} Close={this.SettingModalClosed.bind(this)} source={this.state} />
            </>
        );
    }
}
