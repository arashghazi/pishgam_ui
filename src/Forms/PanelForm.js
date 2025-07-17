import React, { Component } from 'react';
import { CardFooter,Row, Col, Spinner, Card, CardBody, CardTitle, Button} from 'reactstrap';
import { InstanceController } from '../Engine/InstanceController';
import InstanceDataGrid from './InstanceDataGrid';
import { CommandSetting } from '../PGIAdminroutes';
import { Utility } from '../Engine/Common';
import { toast } from 'react-toastify';
import InstanceForm from './InstanceForm/InstanceForm';
import { FormDataTemplate } from '../Engine/FormDataTemplate';
import Parameters from '../Engine/Parameters';
const defualstate = {
    LoadFlow: [
        {
            cmd: "",
            value: "",
            des: "",
            Isrequierd: true
        }],
    Form: {
        FormID: '',
        ShowType: 'Panel',
        title: "",
        rows: [
            {
                height: '100px',
                sections: [{
                    col: "",
                    formid: "",
                    connectionPid: "",
                    title: ""
                }]
            }

        ],
    Connectors: [{ BF: '', BP: '', SF: '', SP: '' }],
    Commands: [
        
    ]
    }
    , RelationModal: {
        isOpen: false,
        selectedID: ''

    },
}
export default class PanelForm extends Component {
    state = {
        ...defualstate,
        savestartd: false
    };
    FormDataTemplate= null;
    Forms = [];
    newInstance;
    async LoadCompleted(formid) {
        this.Forms.find(x => x.props.source === formid).LoadCompleted = true;
        if (this.Forms.findIndex(x => x.LoadCompleted === false) < 0) {
            await this.LoadFlow(this.LocalLoadFlow)
        }
    }
    LocalLoadFlow = [];
    async LoadFlow(loadflow) {
        if (this.props.Mode!=="TempData" && loadflow !== undefined && loadflow !== null) {
            while (loadflow.length > 0) {
                let func = loadflow[0];
                loadflow.splice(0, 1);
                let flag = false;
                switch (func.cmd) {
                    case "set":
                        let form = this.Forms.find(x => x.props.source === func.formid);
                        if (form !== undefined && form !== null) {
                            if (func.value.includes('&') ) {
                                if (this.props.Params === undefined && func.Isrequierd) 
                                    break;
                                let value = this.props.Params.params.split('&')[parseInt(func.value.replaceAll('&', ''))];
                                form.PropertyChanged(func.des, value);
                            }
                            else if (func.value.includes('@')) {
                                let value = Parameters.GetValue(func.value.replaceAll('@', ''), null, 'id');
                                form.PropertyChanged(func.des, value);
                            }
                            else if (func.value === "Data") {
                                for (var i = 0; i < func.con.BCs.length; i++) {
                                    for (var j = 0; j < func.con.BCs[i].Bts.length; j++) {
                                        let value = func.con.BCs[i].Bts[j].IPV;
                                        if (value.includes('#') && form.state.Data.Prop.find(x => x.PID === value.replaceAll('#', '')) !== undefined)
                                            func.con.BCs[i].Bts[j].IPV = form.state.Data.Prop.find(x => x.PID === value.replaceAll('#', '')).IPV;
                                    }
                                }
                                await form.LoadData(JSON.stringify(func.con))
                            }
                        }
                        break;
                    case "Refresh":
                        if (this.props.Mode === "TempData")
                            this.LocalLoadFlow = [];
                        if (func.formid === undefined)
                            this.Refresh(func.type);
                        flag = func.type === "TempData";
                        break;
                    default:
                        break;
                }
                if (flag)
                    break;
            }
        }
    }
    async DataLoaded(formid) {
        let conector = this.state.Form.Connectors.find(x => x.SF === formid)
        if (conector !== undefined && conector.SP==="ID") {
            let base = this.Forms.find(x => x.props.source === conector.BF);
            let source = this.Forms.find(x => x.props.source === conector.SF);
            if (base !== undefined ) {
                let condition = {
                    OCID: conector.BF.split('F')[0],
                    ORB: " ORDER BY convert(int,PC2)",
                        BCs: [
                            {
                                Bts: [
                                    {
                                        PID: conector.BP,
                                        PRA: 1,
                                        IPV: source.state.Data.ID,
                                        NLC: 0,
                                        SRC: null
                                    }
                                ],
                                NLC: 0
                            }
                        ]
                }
                await base.LoadData(JSON.stringify(condition))
            }
        }
    }
    async Update(model) {
        this.newInstance = { ...model.Data }
        if (this.newInstance.LoadFlow !== undefined)
            this.LocalLoadFlow = [ ...this.newInstance.LoadFlow ];
        this.setState({
            ...this.state,
            Form: { ...this.newInstance }
        });
    }
    async LoadForm() {
        await InstanceController.GetFormAsync(this.props.source, this);

    }
    async componentDidMount() {
        if (this.state.Form.FormID !== this.props.source || this.state.Mode !== this.props.Mode) {
            this.state.Mode = this.props.Mode;
            await this.LoadForm();
        }
    }
    async componentDidUpdate() {
        if (this.state.Form.FormID !== this.props.source || this.state.Mode !== this.props.Mode) {
            this.Forms.map((form) => (form.CleanData()))
            this.state.Mode = this.props.Mode;
            await this.LoadForm();
        }
        this.commandflag = true;
    }
    async PropertyChanged(form, property, newvalue) {
        let conector = this.state.Form.Connectors.find(x => x.SF === form && x.SP === property)
        if (conector !== undefined) {
            let base = this.Forms.find(x => x.props.source === conector.BF);
            if (base !== undefined) {
                base.handlePropertyChange(conector.BP, newvalue);
            }
        }
        if (this.state.savestartd)
            await this.Save();
    }
    savelist = [];
    async Save() {
        if (this.props.Mode === undefined || this.props.Mode === 'Normal') {
            if (!this.state.savestartd) {
                this.state.savestartd = true;
                this.savelist = [...this.state.Form.Commands.find(cmd => cmd.Command === 'Save').Order];
            }
            if (this.savelist.length > 0) {
                let form = this.Forms.find(x => x.props.source === this.savelist[0]);
                this.savelist.splice(0, 1);
                await form.Save();
                if (this.savelist.length === 0)
                    this.setState({
                        ...this.state, savestartd: false
                    })
            }
        }
        else if (this.props.Mode === 'TempData') {
            let formdataTemplate = [];
            this.Forms.map((form) => {
                formdataTemplate = [...formdataTemplate, {
                    formID: form.state.Form.FormID,
                    TempData: form.state.Data
                }]
            })
            if (this.FormDataTemplate === null) 
                this.FormDataTemplate = new FormDataTemplate();
            this.FormDataTemplate.setMainFormID(this.state.Form.FormID);
            this.FormDataTemplate.setTitle('قالب فرم ');
            this.FormDataTemplate.setConditionFormID(this.Forms[0].state.Form.FormID);
                let conditionvalue = '';
                for (var i = 0; i < this.Forms[0].state.Data.Prop.length; i++) {
                    if (this.Forms[0].state.Data.Prop[i].IPV !== '')
                        conditionvalue += this.Forms[0].state.Data.Prop[i].PID+
                            this.Forms[0].state.Data.Prop[i].IPV+','
                }
            this.FormDataTemplate.setConditionValue(conditionvalue);
            this.FormDataTemplate.setJson(JSON.stringify(formdataTemplate));
            this.FormDataTemplate.Save();
        }
    }
    async Refresh(type) {
        this.FormDataTemplate = await FormDataTemplate.Load(this.state.Form.FormID, this.Forms[0].state, this.state.Form.TempCon);
        if (this.FormDataTemplate !== null) {
            let tempdata = JSON.parse(this.FormDataTemplate.getJson());
            if (tempdata !== null) {
                this.Forms.map((form) => {
                    let formobj = tempdata.find(x => x.formID === form.state.Form.FormID)
                    form.LoadCompleted = false;
                    form.SetDataTemplate(formobj.TempData)
                });
            }
        }
        if (type !== 'TempData') {
            if (!this.state.savestartd) {
                this.state.savestartd = true;
                this.savelist = [...this.state.Form.Commands.find(cmd => cmd.Command === 'Refresh').Order];
            }
            if (this.savelist.length > 0) {
                let form = this.Forms.find(x => x.props.source === this.savelist[0]);
                this.savelist.splice(0, 1);
                if (this.savelist.length === 0)
                    this.setState({
                        ...this.state, savestartd: false
                    })
                await form.Refresh();
            }
            else
                this.state.savestartd = false;
        }
    }
    async New() {
        if (!this.state.savestartd) {
            this.state.savestartd = true;
            this.savelist = [...this.state.Form.Commands.find(cmd => cmd.Command === 'New').Order];
        }
        while (this.savelist.length > 0) {
            let form = this.Forms.find(x => x.props.source === this.savelist[0]);
            this.savelist.splice(0, 1);
            if (this.savelist.length === 0)
                this.setState({
                    ...this.state, savestartd: false
                })
            await form.New();
        }
    }
    async Delete() {
        if (!this.state.savestartd) {
            this.state.savestartd = true;
            this.savelist = [...this.state.Form.Commands.find(cmd => cmd.Command === 'Delete').Order];
        }
        if (this.savelist.length > 0) {
            let form = this.Forms.find(x => x.props.source === this.savelist[0]);
            this.savelist.splice(0, 1);
            if (this.savelist.length === 0)
                this.setState({
                    ...this.state, savestartd: false
                })
            await form.Delete();
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
            case 'Save-New':{
                    await this.Save();
                    await this.New();
                }
                break;
            case 'Refresh':
                await this.Refresh(this.props.Mode);
                break;
            case 'RefreshTemplate':
                await this.Refresh('TempData');
                break;
            case 'Delete':
                await this.Delete();
                break;
        }
    }
    commandflag = true;
    CommandBuilder() {
        let commands = [];
        if (this.commandflag) {
            this.commandflag = false;
            this.state.Form.Commands.map((item) => {
                if (item.Order.length > 0 && ((item.Show === undefined || item.Show === 'Normal') || (item.Show === this.props.Mode))) {
                    let commandSetting = CommandSetting.find(x => x.command === item.Command);
                    commands = [...commands, <Button disabled={this.state.savestartd} className="mr-2" key={item.Command} outline color={commandSetting.color} value={item.Command} onClick={this.Commander.bind(this, item.Command)} > {commandSetting.title}</Button >];
                }
            })
        }
        return commands;
    }
    addForm(ref) {
        this.Forms = [...this.Forms, ref]
    }
    LoadRelationForm(formid, relationid, event) {
        let instanceid =''
        this.Forms.map(
            (form) => {
                if (form.state.Form.FormID === formid)
                    instanceid = form.state.Instance.ID;
            }
        )
        if (Utility.IsInstanceID(instanceid))
        this.setState({
            ...this.state,
            RelationModal: {
                isOpen: true,
                selectedID: relationid,
                InstanceID: instanceid
            }
        })
        else
            toast.warn('قرم باید ذخیره شده باشد')
    }
    EditInstance(instance, editorid, feedBackid) {
        let form = this.Forms.find(f => f.state.Form.FormID === editorid)
        form.SetData(instance, feedBackid);
    }
    async FeedBack(instance, feedBackid, action) {
        console.log(instance, feedBackid, action)

        let form = this.Forms.find(f => f.state.Form.FormID === feedBackid)
        console.log(form)

        if (action === 'delete')
            await form.Delete(instance);
    }
    render() {
        
        if (this.state.Form.FormID !== this.props.source) {
            return <Spinner color="secondary" />;
        }
        let result = null;
        result = this.state.Form.rows.map((row, index) => (
            <Row key={index} >
                {row.sections?
                    row.sections.map((section,sectionIndex) => {
                        let sectionresult = null;
                        if (section.formid !== undefined && section.formid !== '') {
                            let type = section.formid.split('F')[1].split('V')[0];
                            switch (type) {
                                case '0':
                                    sectionresult = <InstanceForm key={index + '-' + sectionIndex} DataLoaded={this.DataLoaded.bind(this)}
                                        LoadCompleted={this.LoadCompleted.bind(this)} onRef={ref => this.addForm(ref)}
                                        Mode={this.props.Mode} IsPanel={true} id={section.formid} FeedBack={this.FeedBack.bind(this)}
                                        source={section.formid} PropertyChanged={this.PropertyChanged.bind(this)} />;
                                    break;
                                case '1':
                                    sectionresult = <InstanceDataGrid key={index + '-' + sectionIndex} EditInstance={this.EditInstance.bind(this)}
                                        section={section} DataLoaded={this.DataLoaded.bind(this)} LoadCompleted={this.LoadCompleted.bind(this)}
                                        Mode={this.props.Mode} onRef={ref => this.addForm(ref)} IsPanel={true} id={section.formid}
                                        isReadonly={true}
                                        source={section.formid} PropertyChanged={this.PropertyChanged.bind(this)} />;
                                    break;
                                case '3':
                                    sectionresult = <PanelForm key={index + '-' + sectionIndex} Mode={this.props.Mode} source={this.props.source} />;
                                    break;
                                default:
                                    sectionresult = <p>Error</p>
                                    break;
                            }
                        }
                        sectionresult = (<Col className="m-2" key={sectionIndex + '-' + index} >
                            {sectionresult}
                        </Col>)
                        return sectionresult;
                    }) :
                    (<Col><CardBody >
                        <hr/>
                        <div className='float-right' type="inline" key={'0-' + index} >
                        {this.CommandBuilder()}
                    </div></CardBody></Col>)
                }
            </Row>
        ))
        result = (<>
            {
                <Card>
                    <CardBody>
                        <CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>
                    </CardBody>
                    <CardBody className="p-0">
                        {result}
                    </CardBody>
                    <CardFooter ><div className='float-right' type="inline" >
                        {this.CommandBuilder()}
                    </div></CardFooter>
                </Card>
            }
        </>)

        return result;
    }
}
