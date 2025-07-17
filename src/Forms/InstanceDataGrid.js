import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, Table, CardTitle, Button, CardBody, Card, Tooltip, Label } from 'reactstrap';
import { faInfo, faPen, faRedo, faSave } from '@fortawesome/free-solid-svg-icons'
import { InstanceController } from '../Engine/InstanceController';
import Flex from '../components/common/Flex';
import InstanceCell from './InstanceForm/InstanceCell';
import { Utility } from '../Engine/Common';
import ButtonIcon from '../components/common/ButtonIcon';
import moment from 'jalali-moment'
const defaulstate = {
    Data: [],
    Form: { FormID: '', Commands: [] },
    Paging: {
        active: 1,
        pageCount: 10
    },
    loading: false,
    tooltipOpen: false,
    mouseIn: ''
}
export default class InstanceDataGrid extends Component {
    state = { ...defaulstate };
    LoadCompleted = false;
    async componentDidMount() {
        if (this.props.onRef !== undefined)
            this.props.onRef(this)
        if (this.state.Form.FormID !== this.props.source) {
            await this.LoadForm();
        }
        if (this.props.Data !== undefined && this.props.Data !== this.state.Data) {
            this.setState({
                ...this.state,
                Data: this.props.Data,
                loading: false
            })
        }
    }
    async componentDidUpdate() {
        if (this.state.Form.FormID !== this.props.source) {
            await this.LoadForm();
        }
        if (this.props.Data !== undefined && this.props.Data !== this.state.Data) {
            this.setState({
                ...this.state,
                Data: this.props.Data,
                loading: false
            })
        }
    }
    componentWillUnmount() {
        if (this.props.onRef !== undefined)
            this.props.onRef(null)
        this.LoadCompleted = false;
    }
    LoadForm = async () => {
        await InstanceController.GetFormAsync(this.props.source, this);
    }
    async LoadData(condition) {
        if (condition != '') {
            this.setState({
                ...this.state,
                Data: [],
                loading: true
            })
            let data = await InstanceController.GetInstancesAsync(condition);
            if (data !== undefined && data.length > 0) {
                if (this.state.Data.length > 0)
                    for (var i = 0; i < data.length; i++) {
                        if (Utility.IsInstanceID(this.state.Data[i].ID)) {
                            this.state.Data[i].Prop.map((prop) => {
                                if (prop.source !== undefined) {
                                    let newprop = data[i].Prop.find(x => x.PID === prop.PID);
                                    if (newprop !== undefined)
                                        newprop.source = prop.source;
                                }
                            })
                        }
                    }
                this.setState({
                    ...this.state,
                    Data: [...data],
                    loading: false
                })
                if (this.props.DataLoaded !== undefined)
                    this.props.DataLoaded(this.props.source);
            }
            else {
                let temp = {
                    ...this.state,
                    loading: false
                }
                if (this.state.DataTemplate !== undefined)
                    temp.Data = JSON.parse(this.state.DataTemplate);

                this.setState(temp)
            }
        }
        else {

        }
    }
    Update(datamodel = { Data: '' }) {
        let Instance = null;
        switch (datamodel.Type) {
            case 'FORM': {
                if (datamodel.Data.TempData !== undefined)
                    this.setState({
                        ...this.state,
                        Form: datamodel.Data,
                        Data: datamodel.Data.TempData
                    });
                else
                    this.setState({
                        ...this.state,
                        Form: datamodel.Data
                    });
                if (this.props.LoadCompleted !== undefined)
                    this.props.LoadCompleted(this.props.source);
                break;
            }
            case 'INSTANCE': {
                Instance = datamodel.Data;
                this.setState({
                    ...this.state,
                    Data: Instance
                });
                break;
            }
            default:
                break;
        }
    }
    async Refresh() {
        this.setState({
            ...this.state,
            Data: [],
            loading: true
        })
        let instances = await InstanceController.GetInstancesAsync(this.props.source.split('F')[0]);
        this.setState({
            ...this.state,
            Data: instances,
            loading: false
        });
    }
    CleanData() {
        this.setState({
            ...this.state,
            DataTemplate: [],
            Data: [],
            loading: false
        })
    }
    SetDataTemplate(dataTemp) {
        this.CleanData();
        let temp = dataTemp
        let newstate = {
            ...this.state,
            DataTemplate: JSON.stringify(temp)
        }
        if (this.props.Mode === "TempData")
            newstate = {
                ...newstate, Data: temp
            };
        this.setState(newstate)
        this.props.LoadCompleted(this.props.source);
    }
    async New() {
        this.setState({
            ...this.state,
            Data: [...this.state.Data, {
                ID: this.props.source.split('F')[0],
                Prop: []

            }],
            loading: false
        });
    }
    async Delete(instance) {
        let index = this.state.Data.findIndex(x => x.ID === instance.ID);
        this.state.Data.splice(index, 1);
        this.setState({
            ...this.state,
            Data: [...this.state.Data]
        })
    }
    async Save() {
        if (this.props.Mode !== undefined && this.props.Mode === 'TempData')
            await InstanceController.SaveTempDataAsync(this.state.Data, this.state.Form.FormID);
        else
            await InstanceController.SaveInstanceListAsync(this.state.Data);
    }
    async SaveRow(instance) {
        let result = await InstanceController.SaveInstanceAsync(instance);
    }
    handlePropertyChange = (pid, value, Instance) => {
        if (Instance !== undefined) {
            let props = Instance.Prop;
            let editedPropindex = Instance.Prop.findIndex(x => x.PID === pid)
            props.splice(editedPropindex, editedPropindex >= 0 ? 1 : 0, { PID: pid, IPV: value, state: 2 })
            this.setState({
                ...this.state,
                Data: this.state.Data
            });
        }
        else {
            let list = this.state.Data;
            if (pid === 'ID' && value === null) {
                list = [];
            }
            else {
                list.map((instance) => {
                    let props = instance.Prop;
                    let editedPropindex = instance.Prop.findIndex(x => x.PID === pid)
                    props.splice(editedPropindex, editedPropindex >= 0 ? 1 : 0, { PID: pid, IPV: value, state: 2 })
                    return instance;
                });
            }
            this.setState({
                ...this.state,
                Data: list
            });
        }

    }
    RowDBLClick(instance) {
        if (this.props.RowDoubleClick !== undefined)
            this.props.RowDoubleClick(instance);
    }
    MainContent() {
        let readonly = !this.state.Form.Commands.includes('Save');
        if (!readonly)
            readonly = this.props.isReadonly;
        return (
            <>
                <CardBody>
                    <Table hover striped responsive >
                        <thead>
                            <tr>
                                {
                                    this.state.Form.rows[0].controls.map((control) => (
                                        <th key={control.pid}>{control.title}</th>
                                    ))

                                }
                                {
                                    this.props.SaveRow ?
                                        <th className={"col-md-1"}>

                                        </th>
                                        : null
                                }
                                {
                                    this.props.section !== undefined &&
                                        this.props.section.Editable ?
                                        <th className={"col-md-1"}>

                                        </th>
                                        : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.loading ? null :
                                    this.state.Data.map((instance, index) => (
                                        <tr onMouseLeave={() => this.setState({ ...this.state, mouseIn: '' })}
                                            onMouseEnter={() => this.setState({ ...this.state, mouseIn: instance.ID })}
                                            onDoubleClick={this.RowDBLClick.bind(this, instance)} key={instance.ID + index}>
                                            {!readonly ?
                                                (
                                                    this.state.Form.rows[0].controls.map((control, colIndex) => (
                                                        <td className={"p-1 m-0 col-md-" + control.col} key={instance.ID + '-' + colIndex + '-' + index}>
                                                            <InstanceCell Mode={this.props.Mode} TitleFree={true} key={instance.ID + '-' + colIndex + '-' + index} Control={control} Instance={instance} onChange={this.handlePropertyChange.bind(this)} />
                                                        </td>
                                                    ))
                                                )
                                                :
                                                (
                                                    this.state.Form.rows[0].controls.map((control, colindex) => {
                                                        let resultlist = instance.Prop?.find((p) => p.PID === control.pid);
                                                        let pvalue = '';
                                                        if (resultlist !== null && resultlist !== undefined) {
                                                            pvalue = resultlist.DIS ? resultlist.DIS : resultlist.IPV;
                                                            if (control.controlType === "TimePeriod" || control.controlType === "DatePeriod")
                                                                pvalue = moment(resultlist.IPV, 'MM/DD/YYYY')
                                                                    .locale('fa')
                                                                    .format('YYYY/M/D');
                                                        }
                                                        return <td key={control.pid + index + colindex}>{pvalue}</td>
                                                    })
                                                )}
                                            {
                                                this.props.SaveRow ? <>
                                                    <td className={"col-md-1"}>
                                                        <ButtonIcon className="m-0" size='sm' icon={faSave} onClick={this.SaveRow.bind(this, instance)} />
                                                    </td>
                                                    <td className={"col-md-1"}>
                                                        <FontAwesomeIcon className="m-0" icon={faInfo} id={instance.ID} />
                                                        <Tooltip placement="auto" isOpen={this.state.tooltipOpen} target={instance.ID}
                                                            toggle={() => this.setState({ ...this.state, tooltipOpen: !this.state.tooltipOpen })}>
                                                            {instance.ID}
                                                        </Tooltip>
                                                    </td>
                                                </>
                                                    : null
                                            }
                                            {
                                                this.props.section !== undefined &&
                                                    this.props.section.Editor !== undefined ?
                                                    <td className={"col-md-1"}>
                                                        {this.state.mouseIn === instance.ID ?
                                                            <FontAwesomeIcon className="m-0" onClick={() => this.props.EditInstance(instance, this.props.section.Editor, this.state.Form.FormID)} icon={faPen} id={instance.ID} />
                                                            : null}
                                                    </td>
                                                    : null
                                            }
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </Table>
                    {
                        this.state.loading ?
                            <Flex justify={'center'} align={'center'}><Spinner type="grow" color="primary" /></Flex>
                            : null
                    }
                </CardBody>
            </>
        )
    }
    render() {
        if (this.state.Form.FormID === '') {
            return <Spinner color="secondary" />;
        }
        if (this.props.IsPanel) {
            return this.MainContent()
        }
        else {
            return (<Card>{!this.props.TitleFree ?
                <CardBody>
                    < CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>

                    <div className='float-right' type="inline">
                        <ul className="list-inline mb-0">
                            <Button close onClick={this.Refresh.bind(this)}><FontAwesomeIcon icon={faRedo} /></Button>
                        </ul>
                    </div>
                </CardBody>
                : null
            }
                {this.MainContent()}
            </Card>);
        }
    }
}

