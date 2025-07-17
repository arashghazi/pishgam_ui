import React, { Component } from 'react';
import { Input, Row, CardTitle, Label, Badge, CardBody, Table, Card, CardHeader, Col } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import { faRedo, faSave, faDesktop, faPlus, faTrash, faFolderPlus, faCog, faPeopleArrows } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from '../components/common/Flex';
import JoiComboBox from '../components/joi/JoiComboBox';
import ObjectClassController from '../Engine/ObjectClassController';
import ColDesigner from '../Forms/Design/ColDesigner'
import BasePropertyController from '../Engine/BasePropertyController';
import FalconCardHeader from '../components/common/FalconCardHeader';
import RowSetting from './RowSetting';
const defaulstate = {
    Data: {
        LoadCondition: '',
        ShowType: 'vertical',
        FormID: '',
        title: '',
        Commands: [],
        Relations: [],
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
};
const newRow = {
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
export default class InstancePresentaionDesigner extends Component {
    state = {
        ...JSON.parse(JSON.stringify(defaulstate)),
        RowSetting: -1
    };
    commandList = [{
        id: 'Save',
        title: 'ذخیره', icon: faSave
    }, {
        id: 'New',
        title: 'جدید', icon: faPlus
    }, {
        id: 'Delete',
        title: 'حذف', icon: faTrash
    }, {
        id: 'Save-New',
        title: 'ذخیره و جدید', icon: faFolderPlus
    }, {
        id: 'Refresh',
        title: 'بارگزاری', icon: faRedo
    }];
    ShowtypeSource = [{ id: 'vertical', display: 'فرم ورود داده' }, { id: 'horizental', display: 'ورود داده افقی' }]
    async Initialize() {
        if (this.state.Data === undefined || this.props.ClassId !== this.state.Data.FormID) {
            if (!this.props.ClassId.includes('F')) {
                let obj = JSON.parse(JSON.stringify(defaulstate));
                obj.Data.FormID = this.props.ClassId;
                this.setState(obj);
            }
            else {
                let form = await ObjectClassController.GetFormAsync(this.props.ClassId, null);
                console.log(form)
                this.setState({ ...this.state, Data: form });
            }
        }
    }
    async componentDidMount() {
        this.Initialize();
        this.props.onRef(this)
    }
    async componentDidUpdate() {
        this.Initialize();
    }
    componentWillUnmount() {
        this.props.onRef(null)
    }
    toggelCommand(event) {
        let commands = [...this.state.Data.Commands];
        let index = commands.findIndex(x => x === event);
        if (index >= 0)
            commands.splice(index, 1);
        else
            commands = [...commands, event];
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                Commands: [...commands]
            }
        })
    }
    async SaveForm() {
        await ObjectClassController.SaveFormAsync(this.state.Data);
    }
    ToggleConditionModal() { }
    RelationModal() { }
    ChangeTitle(event) {
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                title: event.target.value
            }
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
    onDragEnd = async (result) => {
        const { destination, draggableId } = result;
        if (destination !== null && destination.droppableId.split('-').length > 0) {

            const cellid = destination.droppableId.split('-');
            const rows = this.state.Data.rows;
            const prop = await BasePropertyController.LoadAsync(draggableId);
            const model = prop;
            console.log(cellid, rows, prop)
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
    ControlUpdate(rowindex, colindex, control) {
        this.state.Data.rows[rowindex].controls[colindex] = control;
        this.setState({
            ...this.state,
            Data: this.state.Data
        })
    }
    render() {
        return (<Card>
            <CardBody>
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
                        <div key={1}>
                            <Label>عنوان فرم</Label><Label className="pl-1"><Badge >{this.state.Data.FormID}</Badge></Label>
                            <Input onChange={this.ChangeTitle.bind(this)} value={this.state.Data.title} />
                        </div>
                        <div key={2}>
                            <Label>دستورات</Label>
                            <Flex justify="start" align="start">
                                {this.commandList.map((item) => (
                                    <ButtonIcon key={item.id} className='m-1'
                                        color={this.state.Data.Commands.findIndex(x => x === item.id) >= 0 ? "falcon-success" : "falcon-default"}
                                        size="sm" icon={item.icon} title={item.title} onClick={this.toggelCommand.bind(this, item.id)} />

                                ))}
                            </Flex>
                        </div>
                    </Flex>
                </CardTitle>
                <CardBody >
                    <JoiComboBox Title={'نوع نمایش'} source={this.ShowtypeSource} value={this.state.Data.ShowType} onChange={this.ChangeShowtype.bind(this)} />
                </CardBody>
            </Flex>
            {this.state.Data.ShowType === 'horizental' ?
                    this.horizental() : this.vertical()}
            </CardBody>
        </Card>)
    }
    SettingToggle() {
        this.setState({
            ...this.state,
            RowSetting: -1
        })
    }
    RowChanged=(row, index)=> {
        if (row !== null)
            this.state.Data.rows[index] = row;
        else
            this.state.Data.rows.splice(index,1)

        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                rows: this.state.Data.rows
            }
        })
    }
    horizental() {
        return (<>
            <Card>
                <FalconCardHeader className='p-0 m-0'>
                    <ButtonIcon className='p-0 mt-1 mr-1' color='transparent' size='sm' icon={faCog} onClick={() => this.setState({
                        ...this.state,
                        RowSetting: 0
                    })} />
                </FalconCardHeader>
                <CardBody>
                    <Row >
                        {this.state.Data.rows[0].controls.map((control, colIndex) => (
                            <ColDesigner ControlUpdate={this.ControlUpdate.bind(this)} rowindex='0' colindex={colIndex} Mode='TempData' control={control} />
                        ))}
                    </Row>
                    <RowSetting Row={this.state.Data.rows[0]} index='0' RowChanged={this.RowChanged.bind(this)} isOpen={this.state.RowSetting === 0} toggle={this.SettingToggle.bind(this)} />
                </CardBody>
            </Card>
        </>);
    }
    AddRow(index) {
        this.state.Data.rows.splice(index+1, 0, JSON.parse(JSON.stringify(newRow)));
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                rows: this.state.Data.rows
            }
        })
    }
    vertical() {
        return (<>
            {this.state.Data.rows.map((row, rowindex) =>
            (
                <div key={'row' + rowindex}>
                <FalconCardHeader title=' ' className='p-0 m-0'>
                    <ButtonIcon className='p-0 mt-1 mr-1' color='transparent' size='sm' icon={faCog} onClick={() => this.setState({
                        ...this.state,
                        RowSetting: rowindex
                    })} />
                </FalconCardHeader>
                <CardHeader className='pt-0 pb-0 m-0'>
                    <Row >
                    {
                                row.controls.map((control, colIndex) => (
                                    <ColDesigner ControlUpdate={this.ControlUpdate.bind(this)} key={colIndex + '-' + rowindex} rowindex={rowindex} colindex={colIndex} Mode='TempData' control={control} />
                        ))
                    }
                    </Row>
                    </CardHeader>
                    <RowSetting Row={this.state.Data.rows[rowindex]} index={rowindex} RowChanged={this.RowChanged.bind(this)}
                        isOpen={this.state.RowSetting === rowindex} toggle={this.SettingToggle.bind(this)} />
                <Row style={{ opacity: 0.3, justifyContent: "center", alignItems: 'center' }} >
                    <ButtonIcon color="falcon-default" size="sm" icon="plus" transform="shrink-3" onClick={this.AddRow.bind(this, rowindex)} />
                </Row>

                </div>))}
        </>);
    }
}