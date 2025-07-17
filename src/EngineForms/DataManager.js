import BaseInstance, { NewInstance } from "../Engine/BaseInstance";
import { FromManagerDataTemplate } from "../Engine/FormDataTemplate";
import { InstanceController } from "../Engine/InstanceController";
import { toast } from 'react-toastify';
import ConditionMaker from "../Engine/ConditionMaker";
import { Utility } from "../Engine/Common";
import ObjectClassController from "../Engine/ObjectClassController";
import { Message } from "../Pishgam/MessageDefinition";

export default class DataManager {
    constructor(component, formid, actionType) {
        this.Component = component;
        this.ActionType = actionType;
        this.MainFormID = formid
    }
    Component;
    ActionType;
    MainFormID;
    Storage = [];
    Template = null;
    Triger;
    Connectors;
    TemplateTriger = [];
    FormStructuer;
    onChangeProp;
    OnShowPopup;
    feedBack;
    get formStructuer() {
        let result = this.Component.state.FormStructuer;

        return result;
    }
    get state() {
        return this.Component.state;
    }
    get loading() {
        return this.state?.loading;
    }
    SetState(newData) {
        this.Component.setState({
            ...this.Component.state,
            FormData: [...newData],
        })
    }
    Load(start) {
        this.Component.setState({
            ...this.Component.state,
            loadData: start,
            loading: start
        })
    }
    async Save(formId, callback) {
        this.Load(true);
        if (this.ActionType === 'template') {
            if (this.Template === null)
                this.Template = new FromManagerDataTemplate();
            let keyValue = this.TemplateConditionMaker();
            if (keyValue) {
                this.Template.ConditionValue = keyValue
                this.Template.Json = JSON.stringify(this.Storage);
                await this.Template.SaveAsync();
                this.Load(false);
            }
            else
                toast.error('opation did not work')
        }
        else {
            if (await this.Validation()) {
                if (this.Connectors)
                    await this.SaveReletedData();
                else {
                    let temp = this.Storage.find(x => x.formId === formId);
                    if (temp) {
                        let instance = new BaseInstance(temp.data);
                        if (this.formStructuer?.BeforeSave)
                            eval(this.formStructuer?.BeforeSave)
                        await instance.SaveAsync();
                    }
                    if (callback) {
                        let tempIndex = this.Storage.findIndex(x => x.formId === callback);
                        this.Storage.splice(tempIndex, tempIndex < 0 ? 0 : 1, temp);
                    }
                    if (this.feedBack)
                        this.feedBack(temp.data, 'Save');
                    this.SetState(this.Storage);
                }
            }
            else this.Load(false);
        }
        this.Load(false);
    }
    async Validation() {
        let result = this.Storage?.length > 0;
        for (let i = 0; i < this.Storage.length; i++) {
            const formdata = this.Storage[i];
            let dataAttribute = this.DataAttribute.find(x => x.formId === formdata.formId);
            if (formdata.data instanceof Array) {
                for (let j = 0; j < formdata.data.length; j++) {
                    const insrow = formdata.data[j];
                    let tempresult = await this.CheckForm(insrow, dataAttribute?.BeforeValidate)
                    if (result)
                        result = tempresult;
                }
            }
            else {
                result = await this.CheckForm(formdata.data, dataAttribute?.BeforeValidate)
            }
        }
        return result;
    }
    async CheckForm(instance, BeforeValidate) {
        let result = true;
        let ins = new BaseInstance(instance);
        let percondition = true;
        if (BeforeValidate) {
            percondition = eval(BeforeValidate);
        }
        if (percondition) {
            if (instance.Prop) {
                let oc = await ObjectClassController.LoadAsync(Utility.GetClassID(instance.ID));
                for (let i = 0; i < oc?.Extended?.Required?.length; i++) {
                    const propid = oc.Extended?.Required[i];
                    const prop = ins.GetProperty(propid);
                    prop.hasError = (!prop.IPV || prop.IPV === '')
                    if (result)
                        result = !prop.hasError;
                }
            } else {
                return false;
            }
        }
        return result;
    }
    async SaveReletedData() {
        let header = this.Storage.find(x => x.formId === this.Connectors[0].SF);
        let propid = this.Connectors[0].BP;
        for (let index = 0; index < this.Connectors.length; index++) {
            let details = this.Storage.find(x => x.formId === this.Connectors[index].BF);
            let result = await InstanceController.SaveRelatedInstancesAsync(header.data, propid, details.data);
            if (result) {
                header.data.ID = result.Header.ID
                for (let index = 0; index < result.RelatedInstances.length; index++) {
                    const elementSaved = result.RelatedInstances[index];
                    details.data[index].ID = elementSaved.ID;
                }
            }
        }
        this.SetState(this.Storage);
        return;
    }
    async DeleteReletedData() {
        let header = this.Storage.find(x => x.formId === this.Connectors[0].SF);
        let propid = this.Connectors[0].BP;
        for (let index = 0; index < this.Connectors.length; index++) {
            let details = this.Storage.find(x => x.formId === this.Connectors[index].BF);
            await InstanceController.DeleteRelatedInstancesAsync(header.data, propid, details.data);
        }
    }
    async ChangeData(value, pid, Data, TP) {
        if (typeof Data === 'string')
            Data = this.Storage.find(x => x.formId === Data)?.data;
        let insData = new BaseInstance(Data);
        insData.SetValue(pid, value, TP);
        await this.FireTemplateTriger(pid, value);
        if (this.ActionType !== 'template')
            await this.FireTriger(pid, value);
        if (this.onChangeProp)
            this.onChangeProp(value, pid, Data);
        this.ShowPopup(pid, insData.GetValue(pid));
        this.SetState(this.Storage);
        return this.Storage;
    }
    async ShowPopup(pid, value) {
        if (!this.Component.state.message) {
            if (pid === this.OnShowPopup) {
                let con = new ConditionMaker('E23C2');
                con.AddCondition('PC19', '=', value, 'AND');
                con.AddCondition('P174', '=', '1');
                let result = await con.GetResult();
                if (result?.length > 0) {
                    this.Component.setState({
                        ...this.Component.state,
                        popupIsOpen: true,
                        alertbtn: true,
                        message: new Message(result[0])
                    });
                }
                else {
                    this.Component.setState({
                        ...this.Component.state,
                        popupIsOpen: false,
                        alertbtn: false,
                        message: undefined
                    });
                }
            }
        }
    }
    async Refresh(formId) {
        this.Load(true);
        let data = await InstanceController.GetInstancesAsync(formId.split('F')[0]);
        let tempIndex = this.Storage.findIndex(x => x.formId === formId);
        let temp = this.Storage[tempIndex];
        if (!temp)
            temp = { formId };
        temp.data = data;
        this.Storage.splice(tempIndex, tempIndex < 0 ? 0 : 1, temp);
        this.SetState([...this.Storage]);
        this.Load(false);
    }

    New(formId, type) {
        return new Promise((resolve, reject) => {
            if (this.Template === null) {

                let tempIndex = this.Storage?.findIndex(x => x.formId === formId);
                if (type === '0') {
                    let temp = { formId, data: NewInstance(formId.split('F')[0]) };
                    this.Storage.splice(tempIndex, tempIndex < 0 ? 0 : 1, temp);
                }
                else if (type === '1') {
                    let source = tempIndex < 0 ? { formId: formId, data: [] } : this.Storage[tempIndex];
                    source.data = [...source.data, NewInstance(formId.split('F')[0])];
                    this.Storage.splice(tempIndex, tempIndex < 0 ? 0 : 1, source);
                }
                this.SetState(this.Storage);
            }
            return resolve(true);
        });
    }
    SendToEditor(instanse, formId, Editor) {
        let tempIndex = this.Storage.findIndex(x => x.formId === Editor);
        let temp = { formId: Editor, data: instanse, callback: formId };
        this.Storage.splice(tempIndex, tempIndex < 0 ? 0 : 1, temp);
        this.SetState(this.Storage);
    }
    StorageDeleteInstance(id) {
        for (let i = 0; i < this.Storage.length; i++) {
            const element = this.Storage[i];
            if (Array.isArray(element.data)) {
                const index = element.data.findIndex(x => x.ID === id);
                element.data.splice(index, index < 0 ? 0 : 1);
            }
        }
    }
    async DeleteTemplate(){
        if(this.Template!=null
            &&  window.confirm('آیا از حذف این قالب مطمئن هستید؟') ){
            await this.Template.DeleteAsync(true);
        }
    }
    async Delete(formId) {
        if (formId) {
            let storge = this.Storage.find(x => x.formId === formId);
            if (this.Connectors) {
                await this.DeleteReletedData();
            }
            else if (Array.isArray(storge.data)) {
                for (let i = 0; i < storge.data.length; i++) {
                    const element = storge.data[i];
                    if (Utility.IsInstanceID(element.ID))
                        await (new BaseInstance(element)).DeleteAsync();
                }
                storge.data = [];
            }
            else {
                if (await (new BaseInstance(storge.data)).DeleteAsync()) {
                    this.StorageDeleteInstance(storge.data.ID)
                    storge.data = NewInstance();
                }
            }
            this.SetState(this.Storage)
        }
    }
    FillProp(formId, pid) {
        let form = this.Storage.find(x => x.formId === formId);
        if (!form.fillProp)
            form.fillProp = [];
        let index = form.fillProp.findIndex(x => x === pid);
        if (index >= 0)
            form.fillProp.splice(index, 1);
        else
            form.fillProp = [...form.fillProp, pid];
        this.SetState(this.Storage);
    }
    ChangeStepSource(list, pid, Data) {
        let prop = new BaseInstance(Data).GetProperty(pid);
        prop.stepSource = list;
        this.SetState(this.Storage);
    }
    GetPropertyValue(formid, pid) {
        let formdata = this.Storage.find(x => x.formId === formid);
        if (formdata) {
            return new BaseInstance(formdata.data).GetValue(pid);
        }
        return null;
    }
    async FireTemplateTriger(pid) {
        if (this.TemplateTriger?.findIndex(x => x.PID === pid) >= 0) {
            let keyValue = this.TemplateConditionMaker();
            if (keyValue) {
                this.Load(true);
                this.Template = await FromManagerDataTemplate.LoadByAsync(keyValue);
                if (this.Template !== null) {
                    this.Storage = [...JSON.parse(this.Template.Json)];
                    this.SetState(this.Storage)
                }
                this.Load(false);
            }
        }
        return this;
    }
    TemplateConditionMaker() {
        let keyValue = this.MainFormID + '@';
        let counter = 0;

        for (var i = 0; i < this.TemplateTriger?.length; i++) {
            let temppid = this.TemplateTriger[i].PID;
            let value = this.GetPropertyValue(this.TemplateTriger[i].formId, temppid);
            if (value) {
                keyValue += temppid + ':' + value + '&';
                counter++;
            }
            else
                break;
        }
        if (this.TemplateTriger?.length === counter) {
            return keyValue;
        }
        return null;
    }
    async FireTriger(pid) {

        if (this.Triger && this.Triger[0]?.PIDs?.findIndex(x => x === pid) >= 0) {
            this.Load(true)
            let data1 = await this.DataConditionMaker();
            this.SetData1(data1);
        }

    }
    SetData1(data1) {
        if (data1) {
            let data = JSON.parse(JSON.stringify(data1));
            if (Utility.IsInstanceID(data?.Header?.ID) || (Array.isArray(data) && data?.length > 0 && Utility.IsInstanceID(data[0].ID))) {
                if (this.Template) {
                    let newStorage = [];
                    let template = JSON.parse(this.Template.Json);
                    if (this.Connectors) {
                        for (let index = 0; index < this.Connectors.length; index++) {
                            let form = template.find(x => x.formId === this.Connectors[index].SF);
                            let header = data.Header;
                            if (form?.data && newStorage.findIndex(x => x.formId === form.formId) < 0) {
                                newStorage = [{ formId: form.formId, data: this.syncData(header, form.data) }];
                            }
                            let details = template.find(x => x.formId === this.Connectors[index].BF);
                            let newdata = [];
                            for (var i = 0; i < details.data.length; i++) {
                                let pid = details.fillProp[0];
                                let filltempProp = new BaseInstance(details.data[i]).GetProperty(pid);
                                let fillValueinstance = data.RelatedInstances.find((ins) => new BaseInstance(ins).GetValue(pid) === filltempProp.IPV);
                                newdata = [...newdata, this.syncData(fillValueinstance, details.data[i])];
                            }
                            newStorage = [...newStorage, { formId: this.Connectors[index].BF, data: newdata }];
                        }
                        this.Storage = [...newStorage];
                        this.SetState(this.Storage);
                    }

                }
                else {
                    let currrentdata = this.Storage[0].data;
                    if (data[0]) {
                        // currrentdata.ID = data[0].ID;
                        // this.syncData(currrentdata, data[0], true);
                        this.Storage[0].data = data[0];
                    }
                    this.SetState(this.Storage);
                }
            }
            else {
                if (this.Template?.Json) {
                    let template = JSON.parse(this.Template.Json);
                    if (this.Connectors) {
                        let newStorage = [];
                        let header = template.find(x => x.formId === this.Connectors[0].SF);
                        let form = this.Storage.find(x => x.formId === this.Connectors[0].SF);
                        newStorage = [{ formId: this.Connectors[0].SF, data: this.syncData(header.data, form.data, true) }];
                        for (let index = 0; index < this.Connectors.length; index++) {
                            let details = template.find(x => x.formId === this.Connectors[index].BF);
                            newStorage = [...newStorage, { formId: this.Connectors[index].BF, data: details.data }];
                        }
                        this.Storage = newStorage;
                        this.SetState(this.Storage);
                    }
                }
                else {
                    this.Storage[0].data = this.syncData({ ...NewInstance, ID: Utility.GetClassID(this.Storage[0].formId) },
                        this.Storage[0].data, true, this.Triger[0]?.PIDs);
                    this.SetState(this.Storage);
                }
            }
        }
        this.Load(false);
    }

    syncData(base, source, withValue, props) {
        let result;
        if (base && source) {
            let baseIns = new BaseInstance(base);
            let SourceIns = new BaseInstance(source);
            let ides = SourceIns.getPropertyIds();
            if (props)
                ides = props;
            for (var i = 0; i < ides.length; i++) {
                let stepSource = SourceIns.GetProperty(ides[i]).stepSource;
                let tempProp = baseIns.GetProperty(ides[i]);
                if (stepSource && tempProp)
                    baseIns.GetProperty(ides[i]).stepSource = stepSource;
                let value = SourceIns.GetValue(ides[i], withValue);
                if (value && value !== '' && !baseIns.GetValue(ides[i]))
                    baseIns.SetValue(ides[i], value);
            }
            result = baseIns.Instance;
        }
        else {
            result = { ...source };
        }
        return result;
    }
    async DataConditionMaker() {
        let counter = 0;
        for (var i = 0; i < this.Triger?.length; i++) {
            let condition = new ConditionMaker(Utility.GetClassID(this.Triger[i].formId))
            let temppid = this.Triger[i].PIDs;
            for (var j = 0; j < temppid.length; j++) {
                let value = this.GetPropertyValue(this.Triger[i].formId, temppid[j]);
                if (value) {
                    condition.AddCondition(temppid[j], '=', value, j + 1 < temppid.length ? 'AND' : undefined);
                    counter++;
                }
                else
                    break;
            }
            if (temppid.length === counter) {
                this.Load(true);
                let result;
                if (!this.Connectors)
                    result = await condition.GetResult();
                else {
                    let related = [];
                    for (let i = 0; i < this.Connectors.length; i++) {
                        related = [...related, Utility.GetClassID(this.Connectors[i].BF)]
                    }
                    result = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition)
                        , this.Connectors[0].BP, related)

                }
                return result;
            }
        }
        return undefined;
    }
    InitialTemplate(form) {
        if (form?.TempCon?.length > 0) {
            this.TemplateTriger = form.TempCon;
        }
        if (form?.Connectors?.length > 0) {
            this.Connectors = form.Connectors;
        }
        if (form?.Con?.length > 0) {
            this.Triger = form.Con;
        }
        if (form)
            this.OnShowPopup = form.OnShowPopup;
    }
    ChangeForm(form) {
        if (!form)
            this.Component.setState({
                ...this.Component.state,
                LastFormId: this.MainFormID,
                loadData: false,
                FormStructuer: { ...this.FormStructuer },
            })
        else {
            this.Component.setState({
                ...this.Component.state,
                FormStructuer: form,
            })
        }
    }
    ChangeState(state) {
        this.Component.setState(state)
    }
    SetData(formId, data) {
        let temp = this.Storage.findIndex(x => x.formId === formId && x?.data.ID === data.ID);
        // if (temp < 0) {
        //     this.Storage = [{ formId, data }]
        this.SetState(this.Storage)
        //}
    }
    async LoadDataAsync(id) {

        if (Utility.IsInstanceID(id)) {
            let ins = await InstanceController.LoadInstanceAsync(id);
            let formdataIndex = this.Storage.findIndex(s => s.formId.includes(Utility.GetClassID(id)));
            if (formdataIndex < 0 && this.TemplateTriger.length > 0) {
                this.Storage = [...this.Storage, { formId: this.TemplateTriger[0].formId }];
            }
            if (formdataIndex > -1) {
                this.Storage[formdataIndex < 0 ? 0 : formdataIndex].data = ins;
            }
            this.Storage.find(s => s.formId.includes(Utility.GetClassID(id) + 'F')).data = ins;
            if (this.TemplateTriger?.length > 0) {
                await this.FireTemplateTriger(this.TemplateTriger[0].PID);
            }
            if (this.Connectors) {
                let related = [];
                for (let i = 0; i < this.Connectors.length; i++) {
                    related = [...related, Utility.GetClassID(this.Connectors[i].BF)];
                }
                let condition = new ConditionMaker(Utility.GetClassID(this.Triger[0].formId));
                condition.AddCondition("ID", "=", id);
                let result = await await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition)
                    , this.Connectors[0].BP, related)
                this.SetData1(result);
            }
            else {
                this.SetState(this.Storage)
            }
            // if (this.Triger?.length > 0){
            //     await this.FireTriger(this.Triger[0]?.PIDs[0]);
            // }
        }
    }
    GetDataFromFrom(formId) {
        let result = this.Storage.find(x => x.formId === formId);
        if (result)
            return result.data;
        else
            return null;
    }
    DataAttribute = [];
    AddDataProperty(formId, prop, value) {
        let formattr = this.DataAttribute.find(x => x.formId === formId);
        if (!formattr)
            formattr = { formId };
        formattr[prop] = value;
        this.DataAttribute = [...this.DataAttribute, formattr];
    }
    RemoveRow(formId, index) {
        let form = this.Storage.find(x => x.formId === formId);
        form.data.splice(index,1);
        this.SetState(this.Storage);
    }
    RowUp(formId, index) {
        let form = this.Storage.find(x => x.formId === formId);
        const [item]  = form.data.splice(index,1);
        form.data.splice(index-1,0,item);
        this.SetState(this.Storage);
    }
    RowDown(formId, index) {
        let form = this.Storage.find(x => x.formId === formId);
        const [item]  = form.data.splice(index,1);
        form.data.splice(index+1,0,item);
        this.SetState(this.Storage);
    }
}