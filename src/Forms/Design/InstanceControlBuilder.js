import React, { Component } from 'react';
import { Input, Row, CardTitle, Label, Badge } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import BasePropertyController from '../../Engine/BasePropertyController';
import ObjectClassController from '../../Engine/ObjectClassController';
import RowDesigner from './RowDesigner';
import { faRedo, faSave, faDesktop, faPlus, faTrash, faFolderPlus, faCog, faPeopleArrows } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from '../../components/common/Flex';
import JoiComboBox from '../../components/joi/JoiComboBox';
import WhereCondition from '../../Condition/WhereCondition';

const defualstate = {
    Data: {
        LoadCondition:'',
        ShowType: 'vertical',
        FormID: '',
        title: '',
        Commands: [],
        Realations: [],
        rows: [
            {
                height: 'auto',
                controls: [
                    {
                        col: "12",
                        pid: "",
                        controlType: "",
                        title: ""
                    }
                ]
            }

        ]
    },
    ConditionModal: {
        isOpen: false,
    },
    RelationModal: {
        isOpen: false
    },
    mousein: false
}

export default class InstanceControlBuilder extends Component {
    state = { ...defualstate };
    ShowtypeSource = [{ id: 'vertical', display: 'فرم ورود داده' }, { id: 'horizental', display: 'ورود داده افقی' }]
    
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(null)
    }
    onDragEnd = async (result) => {
        const { destination, draggableId } = result;

        if (destination!==null && destination.droppableId.split('-').length>0) {

            const cellid = destination.droppableId.split('-');
            const rows = this.state.Data.rows;
            const prop = await BasePropertyController.LoadAsync(draggableId);
            const model = prop;
            if (rows[cellid[0]] !== undefined && model !== null && model.StyleW2 !== null) {
                rows[cellid[0]].controls[cellid[1]].pid = model.ID;
                rows[cellid[0]].controls[cellid[1]].title = model.Name;
                rows[cellid[0]].controls[cellid[1]].controlType = model.StyleW2.Control;
                this.setState({
                    ...this.state,
                    Data: {
                        ...this.state.Data,
                        rows: rows
                    }
                    });
            }
        }
    }
    onChangeRow(row, index) {
        const rows = [...this.state.Data.rows];
        rows.splice(index, 1, row)
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                rows: rows
            }
        });

    }
    async SourceChanged(formid, defualtTitle = '') {
        let form = await ObjectClassController.GetFormAsync(formid, null);
        if (defualtTitle === 'NEW' || (form === undefined || JSON.stringify(form) === JSON.stringify({}))) {
            form = {
                ...defualstate,
                Data: {
                    ...defualstate.Data,
                    FormID: formid.split('F')[0],
                    rows: [
                        {
                            height: 'auto',
                            controls: [
                                {
                                    col: "12",
                                    pid: "",
                                    controlType: "",
                                    title: ""
                                }
                            ]
                        }

                    ]
                }
            };
            this.setState(
                form
            )
        }
        else
            this.setState(
            {
                ...this.state,
                Data: form
            }
        )
    }
    AddRow(event) {
        let index =parseInt(event.currentTarget.value)
        const row = {
            height: 'auto',
            controls: [
                {
                    col: "12",
                    pid: "",
                    controlType: "",
                    title: ""
                }
            ]
        };
        const rows = [...this.state.Data.rows];
        rows.splice(index, 0, row);
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                rows: rows
            }
        });
    }
    ChangeTitle(event) {
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                title: event.target.value
            }
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
    ChangeShowtype(value) {
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                ShowType: value
            }
        })
    }
    async SaveForm() {
        await ObjectClassController.SaveFormAsync(this.state.Data);
    }
    RemoveRow(index, event) {
        let newrow = this.state.Data.rows;
        newrow.splice(index, 1);
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                rows: newrow
            }
        });
    }
    toggelCommand(event) {
        let commands = [...this.state.Data.Commands];
        let index = commands.findIndex(x => x === event.currentTarget.value);
        if (index >= 0)
            commands.splice(index, 1);
        else
            commands = [...commands, event.currentTarget.value];
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                Commands: [...commands]
            }
        })
    }
    ConditionModalClose(value,rrr) {
        console.log(value)
        console.log(rrr)
        this.setState({
            ...this.state,
            ConditionModal: {
                isOpen: false
            }
        });
    }
    ToggleConditionModal() {
        this.setState({
            ...this.state,
            ConditionModal: {
                isOpen: true
            }
        });
    }
    RelationModal() {
        this.setState({
            ...this.state,
            RelationModal: {
                isOpen: true
            }
        });
    }
    RelationModalClose(value) {

    }
    
    GetClassID() {
        if (this.state.Data.FormID !== '') {
            console.log(this.state.Data.FormID)
            return this.state.Data.FormID.split('F')[0];
        }
        return '';
    }
    render() {
        return (
            <>
                <div>
                    <Flex justify="between" align="end">
                        <Flex align="start">
                            <FontAwesomeIcon className='float-left mr-1' icon={faDesktop} />
                            <CardTitle tag="h5">طراحی فرم</CardTitle>
                        </Flex>
                        <div>
                            <ButtonIcon color="falcon-default" size="sm" icon={faSave} transform="shrink-1" onClick={this.SaveForm.bind(this)} />
                            <ButtonIcon color="falcon-default" size="sm" icon={faCog} transform="shrink-1" onClick={this.ToggleConditionModal.bind(this)} />
                            <ButtonIcon className='m-1' size="sm" icon={faPeopleArrows} title='ارتباطات' onClick={this.RelationModal.bind(this)} />
                        </div>
                    </Flex>
                </div>
                <Flex justify="between" align="end">
                    <CardTitle>
                        <Flex justify="start" align="start">
                            <div>
                                <Label>عنوان فرم</Label><Label className="pl-1"><Badge >{this.state.Data.FormID}</Badge></Label>
                            <Input onChange={this.ChangeTitle.bind(this)} value={this.state.Data.title} />
                            </div>
                            <div>
                        <Label>دستورات</Label>
                                <Flex justify="start" align="start">
                                    <ButtonIcon className='m-1' color={this.state.Data.Commands.findIndex(x => x === 'Save') >= 0 ? "falcon-success" : "falcon-default"} size="sm" icon={faSave} title='دکمه ذخیره' value='Save' onClick={this.toggelCommand.bind(this)} />
                                    <ButtonIcon className='m-1' color={this.state.Data.Commands.findIndex(x => x === 'New') >= 0 ? "falcon-success" : "falcon-default"} size="sm" icon={faPlus} title='دکمه جدید' value='New' onClick={this.toggelCommand.bind(this)}/>
                                    <ButtonIcon className='m-1' color={this.state.Data.Commands.findIndex(x => x === 'Delete') >= 0 ? "falcon-success" : "falcon-default"} size="sm" icon={faTrash} title='دکمه حذف' value='Delete' onClick={this.toggelCommand.bind(this)}/>
                                    <ButtonIcon className='m-1' color={this.state.Data.Commands.findIndex(x => x === 'Save-New') >= 0 ? "falcon-success" : "falcon-default"} size="sm" icon={faFolderPlus} title='دکمه ذخیره و جدید' value='Save-New' onClick={this.toggelCommand.bind(this)} />
                                    <ButtonIcon className='m-1' color={this.state.Data.Commands.findIndex(x => x === 'Refresh') >= 0 ? "falcon-success" : "falcon-default"} size="sm" icon={faRedo} title='دکمه بروزرسانی' value='Refresh' onClick={this.toggelCommand.bind(this)} />
                                </Flex>
                            </div>
                        </Flex>
                    </CardTitle>
                    <JoiComboBox title={'نوع نمایش'} source={this.ShowtypeSource} value={this.state.Data.ShowType} onChange={this.ChangeShowtype.bind(this)} />
                </Flex>
                {this.state.Data.rows.map((row, index) => {
                    let topButton = null
                    let BottomButton = <hr />
                    if (this.state.Data.ShowType === 'vertical') {
                        if(index===0)
                        topButton = (<Row  style={{ opacity: 0.3, justifyContent: "center", alignItems: 'center', visibility: this.state.mousein ? 'visible' : 'collapse' }} >
                            <ButtonIcon color="falcon-default" size="sm" icon="plus"  value={index} transform="shrink-3" onClick={this.AddRow.bind(this)} />
                        </Row>);
                        BottomButton = (<Row style={{ opacity: 0.3, justifyContent: "center", alignItems: 'center', visibility: this.state.mousein ? 'visible' : 'collapse' }} >
                            <ButtonIcon color="falcon-default" size="sm" icon="plus"  value={parseInt(index) + 1} transform="shrink-3" onClick={this.AddRow.bind(this)} />
                        </Row>);
                    }
                    return (
                        <div key={index} onMouseLeave={this.MouseLeave.bind(this)} onMouseEnter={this.MouseEnter.bind(this)}>
                            { topButton}
                            <RowDesigner rowindex={index} row={row} onChenge={this.onChangeRow.bind(this)} Remove={this.RemoveRow.bind(this)} />
                            { BottomButton}
                        </div>
                    )
                })}
                {
                this.state.ConditionModal.isOpen?
                        <WhereCondition OCID={this.GetClassID()} Modal={this.state.ConditionModal} Close={this.ConditionModalClose.bind(this)} />
                        : null
                }
                {
                    this.state.RelationModal.isOpen ?
                        <WhereCondition OCID={this.GetClassID()} Modal={this.state.RelationModal} Close={this.RelationModalClose.bind(this)} />
                        : null
                }
            </>
        );
    }
}
 //static getDerivedStateFromProps(props, state) {
    //    console.log(props, state)
    //    if (props.Form !== {} && props.Form !== undefined)
    //        state = props.Form;
    //    else
    //        state = defualstate;
    //    return state;
    //}