import StorageController, { DataModel } from './StorageController'
import { NewCell, NewForm, NewPanel, SearchObject, Utility } from './Common'
import axiosInstance from './BaseSetting';
import BasePropertyController from './BasePropertyController';
import { toast } from 'react-toastify';
import ErrorHandler from './ErrorHandler';
import { InstanceController } from './InstanceController';
import GetDisplay from './Lan/Context';
import ConditionMaker from './ConditionMaker';
export default class ObjectClassController {
    static async LoadAsync(ocid, component) {
        if (Utility.IsClassID(ocid)) {
            let result = StorageController.FindModel(ocid, 'OBJECTCLASS');
            try {
                if (result === null) {
                    let resultdata = await axiosInstance.get('ObjectClass/LoadObjectClass', {
                        params: { ocid: ocid }
                    });
                    resultdata.data.EID = 'E' + ocid.split('E')[1].split('C')[0];
                    let model = new DataModel();
                    model.Key = ocid;
                    model.Type = 'OBJECTCLASS';
                    result = await this.classtoObject(resultdata.data);
                    model.Data = { ...result, state: 0 };
                    StorageController.AddToSource(model, component);
                }
                else {
                    result = result.DataModel.Data;
                    if (component != null)
                        component.Update(result);
                }
            } catch (e) {
                ErrorHandler.CominicationError(e);
            }
            return result;
        }
        return;

    }
    static async classtoObject(data) {
        let props = await BasePropertyController.GetPropertyList(data.OCP);
        let Extended = JSON.parse(data.Exd);
        data = { ...data, properties: props, Extended: Extended };
        return data;
    }
    static Update(datamodel) {
        StorageController.UpdateModel(datamodel);
    }
    static async SaveAsync(contentclass) {
        let result = {};
        try {
            let content = { ...contentclass };
            content.Exd = JSON.stringify(content.Extended);
            content.OCP = [];
            content.properties.map((prop) => {
                content.OCP = [...content.OCP, prop.ID];
                return content;
            })
            delete content.properties;
            delete content.Forms;
            delete content.Extended;
            delete content.Name;
            result = await axiosInstance.post('ObjectClass/SaveObjectClass', content);
            if (result.data !== '') {
                contentclass.ID = result.data;
                let model = StorageController.FindModel(contentclass.ID, 'OBJECTCLASS');
                if (model != null) {
                    if (result.data !== "") {
                        model.DataModel.Data = contentclass;
                        model.state = 0;
                    }
                }
                else {
                    model = new DataModel();
                    model.Key = contentclass.ID;
                    model.Type = 'OBJECTCLASS';
                    model.Data = contentclass;
                    model.state = 0;
                    StorageController.AddToSource(model, null);
                }
                toast.success('Operation succeed')
            }
            else {
                toast.error('object do not save')
            }

        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static replacer(key, value) {
        if (value === null) {
            return undefined;
        }
        return value;
    }
    static async SaveFormAsync(content) {
        let result = {};
        try {
            content = JSON.parse(JSON.stringify(content, this.replacer));
            content.rows = content.rows?.map(row => {
                if (row.controls instanceof Array)
                    row.controls = row.controls?.map(col => {
                        delete col.sourceId;
                        delete col.source;
                        return col;
                    });
                return row;
            });
            result = await axiosInstance.post('ObjectClass/SaveForm', content);
            if (result.data !== '') {
                let classmodel = StorageController.FindModel(content.FormID.split('F')[0], 'OBJECTCLASS')
                if (classmodel !== null) {
                    let model = StorageController.GetModel(content.FormID, 'FORM');
                    let formindex = classmodel.DataModel.Data.Forms.findIndex(x => x.ID === content.FormID);
                    content.FormID = result.data;
                    classmodel.DataModel.Data.Forms.splice(formindex, formindex >= 0 ? 1 : 0, { ID: content.FormID, Display: content.title });
                    if (model !== null) {
                        model.Key = result.data;
                        model.Data = content;
                    }
                    this.Update(classmodel.DataModel)
                }
                content.FormID = result.data;
                toast.success(GetDisplay('Save-msg'))
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static async FillRelationDisplay(data) {
        if (data?.Relations !== undefined) {
            for (var i = 0; i < data.Relations.length; i++) {
                if (data.Relations[i].DIS === undefined) {
                    let result = await InstanceController.LoadInstanceAsync(data.Relations[i].ID);
                    if (result !== undefined) {
                        data.Relations[i].DIS = result.DIS;
                        data.Relations[i].Refrence = result.Prop.find(x => x.PID === "PC387").IPV;
                    }
                }
            }
        }
        return data;
    }
    static async GetFormAsync(formid, component, autoForm) {
        let result = {};
        try {
            let version = formid?.split('F')[1]?.split('V')[1];
            let model = StorageController.GetModel(formid, 'FORM');
            if (model === null || model === '') {
                let tempdata = {};
                if (!version || parseInt(version) > 0) {
                    let tempresult = await axiosInstance.get('ObjectClass/GetForm', {
                        params: { formid: formid }
                    });
                    tempdata = tempresult.data;
                    if (tempdata !== '') {
                        model = new DataModel();
                        model.Data = JSON.parse(tempdata);
                        model.Data = await this.FillRelationDisplay(model.Data);
                        model.Key = formid;
                        model.Type = 'FORM';
                        StorageController.AddToSource(model, component);
                    }
                }
                else {
                    result = await this.FormBuilder(formid, autoForm);
                }
            }
            else if (component != null)
                component.Update(model);
            if (model !== null) {
                result = model.Data;
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async GetPanelListAsync(component) {
        let result = {};
        try {
            let model = StorageController.GetModel('Panel', 'PANELS');
            if (model === null) {
                let tempresult = await axiosInstance.get('ObjectClass/GetAllForms', {
                    params: { ocid: 'Panel' }
                });
                if (tempresult.data !== '') {
                    model = new DataModel();
                    model.Data = tempresult.data;
                    model.Key = 'Panel';
                    model.Type = 'PANELS';
                    StorageController.AddToSource(model, component);
                }
            }
            if (model !== null) {
                result = model.Data;
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async GetAllEntities() {
        let model = StorageController.GetModel('AllEntities', 'Entities');
        if (model === null) {
            let entities = await SearchObject("#ALL$", "ENTITY", "")
            model = new DataModel();
            model.Data = entities;
            model.Key = 'AllEntities';
            model.Type = 'Entities';
            StorageController.AddToSource(model, null);
        }
        return model.Data;

    }
    static async GetFieldForm(formid, props = []) {
        let model = StorageController.GetModel(formid, 'FORM');
        let oc = await this.LoadAsync(Utility.GetClassID(formid));
        let form = null;
        let result = [];
        if (model && oc) {
            form = model.Data;
            for (var i = 0; i < form.rows.length; i++) {
                let row = form.rows[i];
                for (var j = 0; j < row.controls.length; j++) {
                    result = [...result, row.controls[j]];
                }
            }
        }
        return result;
    }
    static async FillForm(formid, props = []) {
        let model = StorageController.GetModel(formid, 'FORM');
        let oc = await this.LoadAsync(Utility.GetClassID(formid));
        let form = null;
        if (model && oc) {
            form = model.Data;
            if (model.state === 0 && !form.full) {
                for (var i = 0; i < form.rows.length; i++) {
                    let row = form.rows[i];
                    for (var j = 0; j < row.controls.length; j++) {
                        if (oc.Extended?.Required &&
                            oc.Extended.Required.includes(row.controls[j].pid) &&
                            (!row.controls[j].required || row.controls[j].required === '')
                        )
                            row.controls[j].required = 'this field is required'
                        if ((props?.length > 0 ? props?.includes(row.pid) : true) &&(
                            row.controls[j].controlType === "ComboBox" ||
                            row.controls[j].controlType === "SearchControl" ||
                            row.controls[j].controlType === "InstanceControl") ){
                            try {
                                let baseproperty = await BasePropertyController.LoadAsync(row.controls[j].pid);
                                let con = '';
                                row.controls[j].sourceId = baseproperty.PSource;
                                if (row.controls[j].controlType === "ComboBox") {
                                    if (row.controls[j].pid === "PC490" && formid==="O30E12C11F0V1"){
                                        let condition = new ConditionMaker('E12C9');
                                        condition.AddCondition('PC116', '=', `true`)
                                        let s = await condition.GetResult();
                                        s=s.map(item => {
                                            return { 
                                                id: item.ID, 
                                                display: item.DIS 
                                            };
                                        });
                                        
                                        row.controls[j].source = s;
                                    }
                                    else
                                        row.controls[j].source = await SearchObject(con, baseproperty.PSource, '<>');
                                }
                            } catch (error) {
                                console.log(error, row.controls[j].pid)
                            }

                        }
                    }
                }
                form.full = true;
            }
        }

        return form;
    }
    static async FormBuilder(formid, autoForm) {
        let occ = await this.LoadAsync(formid.split('F')[0]);
        let dataForm = '';
        if (autoForm === FormType.DataForm) {
            dataForm = JSON.parse(JSON.stringify(NewForm));
            dataForm.title = occ.Name;
            dataForm.ShowType = "vertical";
            dataForm.FormID = occ.ID + 'F0V0';
            dataForm.Commands = this.CommandWithprm(occ.prm);
            let formation = this.calculateRowCol(occ.properties.length);
            let rows = [];
            let counter = 0;
            for (let i = 0; i < formation.row; i++) {
                let row = { height: "auto", controls: [] };
                for (let j = 0; j < formation.col; j++) {
                    let prop = occ.properties[counter]
                    if (prop) {
                        let cell = { ...NewCell };
                        cell.controlType = prop.StyleW2.Control;
                        cell.pid = prop.ID;
                        cell.title = prop.Name;
                        row.controls = [...row.controls, cell];
                        counter++;
                    }
                    else
                        break;
                }
                rows = [...rows, row];
            }
            dataForm.rows = rows;
        }
        else if (autoForm === FormType.ListForm) {
            dataForm = { ...NewForm };
            dataForm.title = occ.Name;
            dataForm.ShowType = "horizental";
            dataForm.FormID = occ.ID + 'F1V0';
            dataForm.Commands = this.CommandWithprm(occ.prm);
            let properties = occ.properties.filter(x => x.StyleW2.Control !== 'None');
            let counter = 0;
            let row = { height: "auto", controls: [] };
            for (let j = 0; j < properties.length; j++) {
                let prop = properties[counter]
                if (prop) {
                    let cell = { ...NewCell };
                    cell.controlType = prop.StyleW2.Control;
                    cell.pid = prop.ID;
                    cell.title = prop.Name;
                    row.controls = [...row.controls, cell];
                    counter++;
                }
                else
                    break;
            }
            dataForm.rows = [row];
        }
        else if (autoForm === FormType.Panel) {
            this.FormBuilder(occ.ID, FormType.DataForm);
            this.FormBuilder(occ.ID, FormType.ListForm);
            dataForm = { ...NewPanel };
            dataForm.title = occ.Name;
            dataForm.FormID = 'Panel' + occ.ID + 'F3V0';
            dataForm.Commands = this.CommandWithprm(occ.prm, FormType.Panel, occ.ID);
            dataForm.rows[0].controls[0].formid = occ.ID + 'F0V0';
            dataForm.rows[2].controls[0].formid = occ.ID + 'F1V0';
            dataForm.rows[2].controls[0].Editor = occ.ID + 'F0V0';
        }
        let model = StorageController.GetModel(formid, 'FORM');
        if ((model === null || model === '') && dataForm !== '') {
            model = new DataModel();
            model.Data = dataForm;
            //model.Data = await this.FillRelationDisplay(model.Data);
            model.Key = formid;
            model.Type = 'FORM';
            StorageController.AddToSource(model);
        }
        return dataForm;
    }
    static CommandWithprm(prm, formtype, ocid) {
        let result = [];
        if (prm & 1 === 1)
            result = [formtype === FormType.Panel ? { Command: "New", Order: [ocid + "F0V0"] } : "New"];
        if (prm & 2 === 2)
            result = [...result, formtype === FormType.Panel ? { Command: "Save", Order: [ocid + "F0V0"] } : "Save"];
        if ((prm & 1 === 1) && (prm & 2 === 2))
            result = [...result, formtype === FormType.Panel ? { Command: "Save-New", Order: [ocid + "F0V0"] } : "Save-New"];
        if (prm & 4 === 4)
            result = [...result, formtype === FormType.Panel ? { Command: "Delete", Order: [ocid + "F0V0"] } : "Delete"];
        if (prm & 8 === 8)
            result = [...result, formtype === FormType.Panel ? { Command: "Refresh", Order: [ocid + "F1V0"] } : "Refresh"];
        return result;
    }
    static calculateRowCol(cellCount) {
        let result = { row: 1, col: 3 };
        let row = parseInt(cellCount / 3);
        result.row = (row * 3) < cellCount ? row + 1 : row;
        return result;
    }
    static async GetFormListAsync(classid) {
        let result = {};
        try {
            let model = StorageController.GetModel(classid, 'FORM');
            if (model === null) {
                let tempresult = await axiosInstance.get('ObjectClass/GetAllForms', {
                    params: { ocid: classid }
                });
                if (tempresult.data !== '') {
                    model = new DataModel();
                    model.Data = tempresult.data;
                    model.Key = classid;
                    model.Type = 'FORM';
                    StorageController.AddToSource(model);
                }
            }
            if (model !== null) {
                result = model.Data;
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async FillObjectClass(props = []) {
        for (var j = 0; j < props.length; j++) {

            try {
                if (props[j].StyleW2.Control === "ComboBox") {
                    props[j].source = await SearchObject('', props[j].PSource, '<>');
                }
            } catch (error) {
                console.log(error, props[j].pid)
            }
        }
        return props;
    }
    static async GetClasses(entityid) {
        let response = await axiosInstance.get('ObjectClass/GetClasses', { params: { entityid: entityid } });
        if (response.status === 200) {
            let result = [];
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                let clsloaded = await this.classtoObject(element);
                result = [...result, clsloaded];
            }
            return result;
        }
        return null;
    }
    static async GetCode(classid, ctype) {
        let codetype = ctype === 'dart' ? 'GetStructuerDart' : 'GetStructuerjs';
        let response = await axiosInstance.get(`ObjectClass/${codetype}`, { params: { ocid: classid } });
        if (response.status === 200) {
            return response.data;
        }
        return null;
    }
}
export const FormType = {
    DataForm: '0',
    ListForm: '1',
    Panel: '3'
}

