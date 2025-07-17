import React, { Component } from 'react';
import {
    Form, Row, Card, CardBody,
    CardTitle, CardFooter, Button, Col,
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import { InstanceController } from '../../Engine/InstanceController';
import InstanceCell from './InstanceCell';
import Flex from '../../components/common/Flex';
import { CommandSetting } from '../../PGIAdminroutes';
import uuid from 'react-uuid';
import Parameters from '../../Engine/Parameters';
import { Utility } from '../../Engine/Common';
import { grays } from '../../helpers/utils';
import RelationForm from '../Relation/RelationForm';
import classnames from 'classnames';
export default class InstanceForm extends Component {
    state = {
        Data: {
            UID: uuid(),
            ID: 'NEW',
            Prop: []
        },
        Form: {
            rows: [],
            Commands: []
        },
        activeTab: 'INSTANCE'
    }
    LoadCompleted = false;
    LocalLoadFlow = [];
    async componentDidMount() {
        if (this.props.onRef !== undefined)
            this.props.onRef(this)
        //if (this.state.Form.FormID !== this.props.source) {
        await this.LoadForm();
        //}
    }
    componentDidUpdate() {
        if (this.props.Instance !== undefined && ((Utility.IsInstanceID(this.props.Instance?.ID) &&
            this.props.Instance?.ID !== this.state.Data?.ID) || this.props.Instance?.UID !== this.state.Data?.UID)) {
            this.SetData(this.props.Instance);

        }
    }
    async Commander(command) {
        switch (command) {
            case 'Save':
                await this.Save();
                break;
            case 'New':
                await this.New();
                break;
            case 'Save-New': {
                await this.Save();
                await this.New();
            }
                break;
            case 'Refresh':
                await this.Refresh();
                break;
            case 'Delete':
                await this.Delete();
                break;
        }
    }
    LoadForm = async () => {
        let form = await InstanceController.GetFormAsync(this.props.source);
        if (form?.FormID !== undefined) {
            let defualtvalues = form.values !== undefined ? [...form.values] : [];
            let data = this.props.Data === undefined ? {
                UID: uuid(),
                ID: form.FormID.split('F')[0],
                Prop: defualtvalues
            } : this.props.Data;
            this.setState({
                ...this.state,
                Form: form,
                Data: data
            });
            if (this.props.LoadCompleted !== undefined)
                this.props.LoadCompleted(this.props.source);
        }
    }
    async LoadFlow(loadflow) {
        if (loadflow !== undefined && loadflow !== null) {
            while (loadflow.length > 0) {
                let func = loadflow[0];
                loadflow.splice(0, 1);
                let flag = false;
                switch (func.cmd) {
                    case "set":
                        if (func.value.includes('&') && this.props.Params !== undefined) {
                            let value = this.props.Params.params.split('&')[parseInt(func.value.replaceAll('&', ''))];
                            this.PropertyChanged(func.des, value);
                        }
                        else if (func.value.includes('@')) {
                            let value = Parameters.GetValue(func.value.replaceAll('@', ''), null, 'id');
                            this.PropertyChanged(func.des, value);
                        }
                        else if (func.value === "Data") {
                            for (var i = 0; i < func.con.BCs.length; i++) {
                                for (var j = 0; j < func.con.BCs[i].Bts.length; j++) {
                                    let value = func.con.BCs[i].Bts[j].IPV;
                                    if (value.includes('#') && this.state.Data.Prop.find(x => x.PID === value.replaceAll('#', '')) !== undefined)
                                        func.con.BCs[i].Bts[j].IPV = this.state.Data.Prop.find(x => x.PID === value.replaceAll('#', '')).IPV;
                                }
                            }
                            await this.LoadData(JSON.stringify(func.con))
                        }
                        break;
                    case "Refresh":
                        if (this.props.Mode === "TempData")
                            this.LocalLoadFlow = [];
                        if (func.formid === undefined)
                            this.Refresh(func.type);
                        flag = func.type === "TempData";
                        break;
                }
                if (flag)
                    break;
            }
            //await this.LoadFlow(this.LocalLoadFlow);
        }

    }
    async Refresh() {
        if (this.state.Form.LoadFlow !== undefined) {
            this.LocalLoadFlow = JSON.parse(JSON.stringify(this.state.Form.LoadFlow));
            await this.LoadFlow(this.LocalLoadFlow);
        }
    }
    SetDataTemplate(dataTemp) {
        this.setState({
            ...this.state,
            DataTemplate: dataTemp
        })
        this.props.LoadCompleted(this.props.source);
    }
    CleanData() {
        this.setState({
            ...this.state,
            DataTemplate: [],
            Data: {
                UID: uuid(),
                ID: 'NEW',
                Prop: []
            }
        })
    }
    async LoadData(condition) {
        let data = await InstanceController.GetInstancesAsync(condition);
        if (data.length > 0) {
            this.setState({
                ...this.state,
                Data: { ...data[0] }
            })
        }
        else if (this.state.DataTemplate !== undefined) {
            this.state.Data.ID = this.state.DataTemplate.ID;
            for (var i = 0; i < this.state.Data.Prop.length; i++) {
                let templateprop = this.state.DataTemplate.Prop.find(x => x.PID === this.state.Data.Prop[i].PID);
                if (templateprop !== undefined && templateprop.IPV !== '')
                    this.state.Data.Prop[i].IPV = templateprop.IPV;
            }
            this.setState({
                ...this.state,
                Data: { ...this.state.Data }
            })
        }
        if (this.props.DataLoaded !== undefined)
            this.props.DataLoaded(this.props.source);
    }
    async New() {
        this.setState({
            ...this.state,
            Data: {
                UID: uuid(),
                ID: this.state.Form.FormID.split('F')[0],
                Prop: []
            }
        });
    }
    async Delete() {
        if (window.confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
            await InstanceController.DeleteAsync(this.state.Data.ID);
            if (this.props.FeedBack !== undefined && this.state.feedBackId !== undefined)
                await this.props.FeedBack(this.state.Data, this.state.feedBackId, 'delete');
            this.CleanData();
        }
    }
    async Save() {
        let id = await InstanceController.SaveInstanceAsync(this.state.Data);
        if (Utility.IsInstanceID(id)) {
            if (this.props.PropertyChanged !== undefined)
                this.props.PropertyChanged(this.state.Form.FormID, 'ID', id)
            if (this.props.FeedBack !== undefined && this.state.feedBackId !== undefined)
                await this.props.FeedBack(this.state.Data, this.state.feedBackId, 'Save');
            this.setState({
                ...this.state,
                Data: {
                    ...this.state.Data,
                    ID: id
                }
            })
        }
        return id;
    }
    SetData(instance, feedBackId) {
        this.setState({
            ...this.state,
            Data: instance,
            feedBackId: feedBackId
        });
    }
    PropertyChanged(pid, value, Instance, objValue) {
        if (pid !== undefined) {
            let data = this.state.Data;
            let editedPropindex = data.Prop.findIndex(x => x.PID === pid)
            if (editedPropindex >= 0)
                data.Prop.splice(editedPropindex, 1, { ...data.Prop[editedPropindex], IPV: value, DIS: objValue ? objValue.display : value })
            else
                data.Prop = [...data.Prop, { PID: pid, IPV: value, DIS: objValue ? objValue.display : value, TP: 20 }];

            this.setState({
                ...this.state,
                Form: { ...this.state.Form },
                Data: {
                    ...data,
                    Prop: data.Prop
                }
            })
            if (this.props.PropertyChanged !== undefined)
                this.props.PropertyChanged(this.state.Form.FormID, pid, value, data)
        }
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
            let instance = this.state.Data;

            let props = instance.Prop;
            let editedPropindex = instance.Prop.findIndex(x => x.PID === pid)
            props.splice(editedPropindex, editedPropindex >= 0 ? 1 : 0, { PID: pid, IPV: value, state: 2 })
            return instance;

            this.setState({
                ...this.state,
                Data: instance
            });
        }

    }
    CommandBuilder() {
        let commands = [];
        this.state.Form.Commands.map(command => {
            let commandSetting = CommandSetting.find(x => x.command === command);
            commands = [...commands, <Button className="mr-2" key={command} outline color={commandSetting.color} onClick={this.Commander.bind(this, command)} > {commandSetting.title}</Button >];
        })
        return commands;
    }
    Contents() {
        return (<>{
            this.state.Form.rows.map((row, rowIndex) => {
                return (<div key={rowIndex}>
                    {
                        row.title ? <><div style={{ paddingTop: '30px' }} >{row.title}</div><hr style={{ margin: 0, height: '1px', backgroundColor: grays[100] }} /></>
                            : <div style={{ paddingBottom: '15px' }} />
                    }
                    <Row style={{ height: row.height }} form>
                        {
                            row.controls.map((control, colIndex) => (
                                <Col className='d-flex flex-column' key={rowIndex + '-' + colIndex}>
                                    <InstanceCell {...this.props} TitleFree={this.props.TitleFree} key={rowIndex + '-' + colIndex} Control={control} Instance={this.state.Data}
                                        onChange={this.PropertyChanged.bind(this)} />
                                </Col>
                            ))
                        }
                    </Row></div>);
            })
        }

        </>)
    }
    toggle(tab) {

        if (this.state.activeTab !== tab) {
            this.setState({
                ...this.state,
                activeTab: tab
            });
        }
    }
    MainForm() {
        let content = this.Contents();
        return (<Form>
            {!this.props.IsPanel ?
                <Card>
                    <CardBody>
                        <CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>
                    </CardBody>
                    <CardBody>
                        {this.Contents()}
                    </CardBody>
                    <CardFooter >
                        <Flex justify="start" align="end">
                            {this.CommandBuilder()}
                        </Flex>
                    </CardFooter>
                </Card>
                :
                (this.props.FormTitle || this.state.Form?.Relations?.length > 0 ?
                    <div>
                        <CardBody>
                            {
                                this.props.FormTitle ?
                                    <CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>
                                    : null
                            }

                        </CardBody>
                        <CardBody>
                            {content}
                        </CardBody></div>
                    : content
                )}
        </Form>);
    }
    render() {
        return (<>{this.state.Form?.Relations?.length > 0 ? (<>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === 'INSTANCE' })}
                        onClick={() => { this.toggle('INSTANCE'); }}
                    >
                        {this.state.Form.title}
                    </NavLink>
                </NavItem>
                {
                    this.state.Form?.Relations?.length > 0 ?
                        (
                            this.state.Form.Relations.map((relation, index) => {

                                return (<NavItem key={relation.ID}>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === relation.ID })}
                                        onClick={() => { this.toggle(relation.ID); }}
                                    >
                                        {relation.DIS}
                                    </NavLink>
                                </NavItem>);
                            })) : null
                }
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId='INSTANCE'>
                    {this.MainForm() }
                </TabPane>
                {
                    this.state.Form?.Relations?.length > 0 ?
                        (
                            this.state.Form.Relations.map((relation, index) => {

                                return (<TabPane key={relation.ID} tabId={relation.ID}>
                                    <CardBody>
                                        <RelationForm BaseId={this.state.Data.ID}
                                            RelationType={relation} />
                                    </CardBody>
                                </TabPane>);
                            })) : null
                }
            </TabContent></>)
            :
            this.MainForm()
        }
            </>);
    }
}
