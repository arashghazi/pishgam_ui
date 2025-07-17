import BaseInstance, { NewInstance, NewProperty } from "./BaseInstance";
import ConditionMaker from "./ConditionMaker";
import { InstanceController } from "./InstanceController";

export class FormDataTemplate {
    static Templates = [];
    Instance = { ID: "E0C23", Prop: [{ PID: "PC95", IPV: '', TP: 2 }, { PID: "PC595", IPV: '', TP: 2 }, { PID: "PC596", IPV: '', TP: 2 }, { PID: "PC597", IPV: '', TP: 2 }, { PID: "PC556", IPV: '', TP: 2 }] }
    get ID() {
        return this.Instance.ID;
    }
    set ID(id) {
        this.Instance.ID = id;
    }
    get Title() {
        let result = null;
        let prop = this.Instance.Prop.find(x => x.PID === 'PC95');
        if (prop !== undefined)
            result = prop.IPV;
        return result;
    }
    set Title(value) {
        let prop = this.Instance.Prop.find(x => x.PID === 'PC95');
        if (prop !== undefined)
            prop.IPV = value;
    }
    get MainFormID() {
        let result = null;
        let prop = this.Instance.Prop.find(x => x.PID === 'PC595');
        if (prop !== undefined)
            result = prop.IPV;
        return result;
    }
    set MainFormID(value) {
        let prop = this.Instance.Prop.find(x => x.PID === 'PC595');
        if (prop !== undefined)
            prop.IPV = value;
    }
    get ConditionFormID() {
        let result = null;
        let prop = this.Instance.Prop.find(x => x.PID === 'PC597');
        if (prop !== undefined)
            result = prop.IPV;
        return result;
    }
    set ConditionFormID(value) {
        let prop = this.Instance.Prop.find(x => x.PID === 'PC597');
        if (prop !== undefined)
            prop.IPV = value;
    }
    get ConditionValue() {
        let result = null;
        let prop = this.Instance.Prop.find(x => x.PID === 'PC596');
        if (prop !== undefined)
            result = prop.IPV;
        return result;
    }
    set ConditionValue(value) {
        let prop = this.Instance.Prop.find(x => x.PID === 'PC596');
        if (prop !== undefined) {
            prop.IPV = value;
        }
    }
    get Json() {
        let result = null;
        let prop = this.Instance.Prop.find(x => x.PID === 'PC556');
        if (prop !== undefined)
            result = prop.IPV;
        return result.replaceAll("'", '"');
    }
    set Json(value) {
        let prop = this.Instance.Prop.find(x => x.PID === 'PC556');
        if (prop !== undefined)
            prop.IPV = value;
    }
    async Save() {
        return await InstanceController.SaveInstanceAsync(this.Instance);
    }
    static find(form1id, form2id, condition) {
        return FormDataTemplate.Templates.find(x => x.getMainFormID() === form1id
            && x.getConditionFormID() === form2id && x.getConditionValue().includes(condition.replaceAll('%','')))
    }
    static async Load(formid, data, tempcon) {
        let bts = [];
        let conditionvalue = ''
        if (data?.Data?.Prop?.length > 0) {
            for (var i = 0; i < data.Data.Prop.length; i++) {
                if (data.Data.Prop[i].IPV !== '' && (tempcon !== undefined ? tempcon.includes(data.Data.Prop[i].PID) : true)) {
                    conditionvalue += `%${data.Data.Prop[i].PID}${data.Data.Prop[i].IPV}%`;
                }
            }
            if (conditionvalue !== '') {
                bts = [...bts, { PID: "PC596", PRA: 2, IPV: conditionvalue, NLC: 2, SRC: null }];
                if (bts.length > 0) {
                    bts = [...bts, { PID: "PC595", PRA: 1, IPV: formid, NLC: 2, SRC: null },
                    { PID: "PC597", PRA: 1, IPV: data.Form.FormID, NLC: 2, SRC: null }]
                    bts.splice(bts.length - 1, 1, { ...bts[bts.length - 1], NLC: 0 });
                    let where = { OCID: "E0C23", BCs: [{ Bts: [...bts], NLC: 0 }] };

                    let result = this.find(formid, data.Form.FormID, conditionvalue)
                    if (result === undefined) {
                        result = new FormDataTemplate();
                        let list = await InstanceController.GetInstancesAsync(JSON.stringify(where));
                        if (list !== undefined && list.length > 0) {
                            result.Instance = list[0];
                            if (result.getJson() !== null) {
                                FormDataTemplate.Templates = [...FormDataTemplate.Templates, result];
                                return result;
                            }
                        }
                    }
                    else {
                        return result;
                    }
                }
            }
        }
        return null;
    }
    static async LoadData(form1id, form2id, conditionvalue) {
        let bts = [
            { PID: "PC595", PRA: 1, IPV: form1id, NLC: 2, SRC: null }
        ];
        if (form2id !== '')
            bts = [...bts, { PID: "PC597", PRA: 1, IPV: form2id, NLC: 2, SRC: null }];
        if (conditionvalue !== '')
            bts = [...bts, { PID: "PC596", PRA: 2, IPV: conditionvalue, NLC: 2, SRC: null }];
        bts.splice(bts.length - 1, 1, { ...bts[bts.length - 1], NLC: 0 });
        let where = { OCID: "E0C23", BCs: [{ Bts: [...bts], NLC: 0 }] };
        let result = this.find(form1id, form2id, conditionvalue)
        if (result === undefined) {
            result = new FormDataTemplate();
            let list = await InstanceController.GetInstancesAsync(JSON.stringify(where));
            if (list !== undefined && list.length > 0) {
                result.Instance = list[0];
                if (result.getJson() !== null) {
                    FormDataTemplate.Templates = [...FormDataTemplate.Templates, result];
                    return result;
                }
            }
        }
        else {
            return result;
        }
        return null;
    }
}

export class FromManagerDataTemplate extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('E0C23');
            FromManagerDataTemplate.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    get ID() {
        return this.Instance.ID;
    }
    set ID(id) {
        this.Instance.ID = id;
    }
    static PIDs = ['PC95', 'PC595', 'PC596', 'PC597', 'PC556'];
    set Title(value) {
        this.SetValue(FromManagerDataTemplate.PIDs[0], value);
    }
    get Title() {
        return this.GetValue(FromManagerDataTemplate.PIDs[0]);
    } set MainFormID(value) {
        this.SetValue(FromManagerDataTemplate.PIDs[1], value);
    }
    get MainFormID() {
        return this.GetValue(FromManagerDataTemplate.PIDs[1]);
    } set ConditionValue(value) {
        this.SetValue(FromManagerDataTemplate.PIDs[2], value);
    }
    get ConditionValue() {
        return this.GetValue(FromManagerDataTemplate.PIDs[2]);
    } set ConditionFormID(value) {
        this.SetValue(FromManagerDataTemplate.PIDs[3], value);
    }
    get ConditionFormID() {
        return this.GetValue(FromManagerDataTemplate.PIDs[3]);
    } set Json(value) {
        this.SetValue(FromManagerDataTemplate.PIDs[4], value);
    }
    get Json() {
        return this.GetValue(FromManagerDataTemplate.PIDs[4]);
    }
    static async LoadByAsync(key) {
        let condition = new ConditionMaker('E0C23');
        condition.AddCondition('PC596', '=', key);
        let list = await condition.GetResult();
        if (list?.length > 0) {

            let result = new FromManagerDataTemplate(list[0]);
            return result;
        }
        return null;
    }
}