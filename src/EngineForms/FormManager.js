import { faCogs, faCopy, faExclamation, faPaste } from '@fortawesome/free-solid-svg-icons';
import React, {  Component } from 'react';
import { Button, Card, CardBody, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import { Utility } from '../Engine/Common';
import ObjectClassController from '../Engine/ObjectClassController';
import Parameters from '../Engine/Parameters';
import RootFormEditor from '../EngineDeveloper/FormBuilder/RootFormEditor';
import RootPanelEditor from '../EngineDeveloper/PanelBuilder/RootPanelEditor';
import DataForm from './DataForm';
import DataManager from './DataManager';
import ListForm from './ListForm';
import PanelForm from './PanelForm';
import { ThemeCardHeader } from './ThemeControl';
import uuid from 'uuid';
import { AuthenticationController } from '../Engine/Authentication';
export default class FormManager extends Component {
    constructor(props) {
        super(props);

    }
    state = {
        LastFormId: '',
        FormStructuer: null,
        FormType: '',
        FormData: undefined,
        DM: new DataManager(this),
        loadData: true,
        modalComp: false,
        loading: false,
        popupIsOpen: false,
        alertbtn: false, IsAdmin: undefined
    }
    async componentDidMount() {

        if (this.props.builder)
            this.props.builder.DM = this.state.DM;
        if (!this.state.IsAdmin) {
            let IsAdmin = await AuthenticationController.HasRole('R2');
            this.setState({
                ...this.state, IsAdmin
            })
        }

        await this.Initialiez();

    }
    async componentDidUpdate() {
        await this.Initialiez();
    }
    initialize = false;
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    async Initialiez() {
        if (this.props.formId && (this.state.LastFormId !== this.props.formId
            || this.state.Mode !== this.props.mode) && !this.initialize) {
            this.initialize = true;
            let FormStructuer = this.props.FormStructuer;
            let FormType = this.props.FormType;
            if (!FormType)
                FormType = Utility.GetFormType(this.props.formId);
            if (!FormStructuer)
                FormStructuer = await ObjectClassController.GetFormAsync(this.props.formId, null
                    , FormType);
            let DM = this.props.DM;
            if (!DM) {
                DM = new DataManager(this);// this.state.DM;
                let id = uuid();
                DM.ID = id;
                DM.MainFormID = this.props.formId;
                DM.ActionType = this.props.mode;
                DM.InitialTemplate(FormStructuer);
                if (this.props.onChange)
                    DM.onChangeProp = this.props.onChange;
                if (this.props.FeedBack)
                    DM.feedBack = this.props.FeedBack;
            }

            if (FormStructuer && FormType !== '3') {
                FormStructuer = await ObjectClassController.FillForm(this.props.formId);
            }
            this.initialize = false;
            this.setState({
                ...this.state,
                LastFormId: this.props.formId,
                DM,
                FormData: undefined,
                Mode: this.props.mode,
                FormStructuer,
                loadData: true,
            });


        }
        if (this.props.Data && this.props.Data !== this.state.FormData && !this.initialize) {
            // for (let index = 0; index < this.props.Data.length; index++) {
            //     const element = this.props.Data[index];
            //     this.state.DM.SetData(element.formId ,element.data)
            // }
            if (this.props.Data[0].data?.Prop) {
                for (let index = 0; index < this.props.Data[0].data?.Prop?.length; index++) {
                    const element = this.props.Data[0].data.Prop[index];
                    await this.state.DM.ShowPopup(element.PID, element.IPV);
                }

            }
            this.setState({
                ...this.state,
                FormData: this.props.Data
            })
        }
        if (this.props.insId && this.props.insId !== this.state.insId && !this.initialize) {
            this.setState({
                ...this.state,
                insId: this.props.insId,
            })
            let insId = this.props.insId;

            if (insId && !Utility.IsClassOrInstanceID(insId)) {
                insId = await Parameters.GetValue(insId)
            }
            if (Utility.IsInstanceID(insId)) {
                await this.state.DM.LoadDataAsync(insId);
            }
        }
        if (!this.props.insId && this.props.location?.state?.Active === false && !this.initialize) {
            this.props.location.state.Active = true;
            let formId = this.props.location?.state.formid
            let values = this.props.location?.state.values;
            await this.state.DM.New(formId, Utility.GetFormType(formId));
            for (let i = 0; i < values?.length; i++) {
                const element = values[i];
                await this.state.DM.ChangeData(element.value, element.pid, formId);
            }
        }
    }

    SelectedInstance(instance, editor) {
        let index = this.state.FormData.findIndex(x => x.formId === editor);
        let FormData = this.state.FormData;
        if (index >= 0)
            FormData.splice(index, 1);
        FormData = [...FormData, {
            formId: editor,
            data: instance
        }];
        this.setState({
            ...this.state,
            FormData
        })
    }
    Body(CardOff) {
        let result = null;
        let tempData;
        if (this.state.FormData)
            tempData = this.state.FormData.find(f => f.formId === this.props.formId);
        switch (this.state.FormStructuer.ShowType) {
            case 'vertical':
                result = <DataForm DataDataForm={tempData}
                    DM={this.state.DM}
                    CardOff={CardOff}
                    Form={this.state.FormStructuer} {...this.props} />
                break;
            case 'horizental':
                result = <ListForm
                    DataListForm={tempData}
                    DM={this.state.DM}
                    CardOff={CardOff} {...this.props}
                    Editor={this.props.Editor}
                    Form={this.state.FormStructuer}
                />
                break;
            case 'Panel':
                result = <PanelForm Data={this.state.FormData}
                    DM={this.state.DM}
                    CardOff={CardOff}  {...this.props}
                    Form={this.state.FormStructuer} onSelected={this.props.onSelected ?? this.SelectedInstance.bind(this)}
                />
                break;
            default:
                result = <Label>No Control</Label>
                break;
        }
        if (this.props.formLoaded)
            this.props.formLoaded(this.props.formId);
        return result;
    }
    toggleModal = () => {
        this.setState({
            ...this.state,
            modalComp: !this.state.modalComp
        })

    }
    copyTemplate = async () => {
        console.log(this.state.DM.Template)
        const jsonString = JSON.stringify(this.state.FormData, null, 2);
        await navigator.clipboard.writeText(jsonString);
    }
    pasteTemplate = async () => {
        const jsonString = await navigator.clipboard.readText();
        let CopyFormData = JSON.parse(jsonString);
        let sample = this.state.FormData.find((f)=>f.formId.includes('F0')).data.Prop.find((p)=>p.PID==='P9');
        let header = CopyFormData.find((f)=>f.formId.includes('F0'));
        var index = header.data.Prop.findIndex((p)=>p.PID==='P9');
        header.data.Prop.splice(index,1);
        header.data.Prop.push(sample);
        console.log(CopyFormData);
        this.state.DM.Storage = CopyFormData;
        this.state.DM.SetState(CopyFormData);
    }
    render() {
        if (this.props.DMChanged) {
            this.props.DMChanged(this.state.DM);
        }
        return (<>{this.state.FormStructuer ?
            (this.props.CardOff ? this.Body(true) :
                <Card style={this.props.style} id={this.props.id}>
                    {/* <React.StrictMode> */}

                    <ThemeCardHeader title={this.props.title ? this.props.title : (this.state.FormStructuer.title + (this.props.mode === 'design' ? ' ' + this.state.FormStructuer.FormID : ''))} {...this.props} >
                        {this.state.loading ? <Spinner color='primary' size='sm' /> : null}
                        {this.props.mode === 'design' ?
                            <ButtonIcon icon={faCogs} color='transparent' onClick={this.toggleModal} /> : null}
                        {this.state.alertbtn ?
                            <ButtonIcon icon={faExclamation} color='info'
                                onClick={() => this.setState({ ...this.state, popupIsOpen: true })} /> : null}
                        {this.props.mode === 'template' ? <ButtonIcon icon={faCopy} color='blue' title='Copy'
                            onClick={this.copyTemplate} ></ButtonIcon> : null}
                        {this.props.mode === 'template' ? <ButtonIcon icon={faPaste} color='orange' title='Paste'
                            onClick={this.pasteTemplate} ></ButtonIcon> : null}
                    </ThemeCardHeader>
                    <CardBody>
                        {this.Body(false)}
                        {this.props.children}
                    </CardBody>
                    {/* </React.StrictMode> */}
                    {this.props.mode === 'design' ?
                        <Modal size={this.state.FormStructuer.ShowType === 'Panel' ? 'xl' : 'auto'} toggle={this.toggleModal} isOpen={this.state.modalComp} centered>
                            <ModalHeader toggle={this.toggleModal} charCode="X" >
                                Form Data
                            </ModalHeader>
                            <ModalBody>
                                {this.state.FormStructuer.ShowType === 'Panel' ? <RootPanelEditor DM={this.state.DM} /> : <RootFormEditor DM={this.state.DM} />}
                            </ModalBody>
                        </Modal> : null}
                </Card>) : <Spinner color='primary' size='sm' />
        }
            {this.state.alertbtn ? <Modal isOpen={this.state.popupIsOpen} size='lg'>
                <ModalHeader>{this.state?.message.Title}</ModalHeader>
                <ModalBody>
                    <div dangerouslySetInnerHTML={{ __html: this.state?.message.Content }} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => this.setState({ ...this.state, popupIsOpen: false })}>متوجه شدم</Button>
                </ModalFooter>
            </Modal> : null}
        </>);
    }
}
