import StorageController, { DataModel } from './StorageController'
import ObjectClassController from './ObjectClassController';
import { Upload, Utility } from './Common'
import { toast } from 'react-toastify';
import ErrorHandler from './ErrorHandler';
import axiosInstance from './BaseSetting';
import BaseInstance from './BaseInstance';
import GetDisplay from './Lan/Context';


export class InstanceController {
    static async GetFormAsync(formid, component) {
        return await ObjectClassController.GetFormAsync(formid, component);
    }
    static async GetRelatedInstancesAsync(headercondition, propid, detailIdes = []) {
        let result = {};
        try {
            let detailes = detailIdes.map((id) => ({ ID: id, Prop: [] }));
            let data = {
                ConditionLoader: headercondition,
                Header: { Prop: [] }, ReltedPropId: propid, RelatedInstances: detailes
            }
            result = await axiosInstance.post('Instance/GetRelatedInstancesAsync', data);
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static async LoadInstanceAsync(id, component) {
        let result = {};
        try {
            result = await axiosInstance.get('Instance/LoadInstance', {
                params: { instanceid: id }
            });
            let model = new DataModel();
            model.Data = { ...result.data, state: 0 };
            model.Key = id;
            model.Type = 'INSTANCE';
            StorageController.AddToSource(model, component);
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static async SaveInstanceListAsync(instancelist = []) {
        await Promise.all(instancelist.map(async (instance) => {
            let result = await this.SaveInstanceAsync(instance)
            return result;
        }));
    }
    static async SaveTempDataAsync(instance, formid) {
        try {
            let stringjson = JSON.stringify(instance);
            let result = await axiosInstance.post('Instance/SaveTempData', {
                jsonins: stringjson, formid: formid
            });
            return result.data;
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
    }
    static async SaveInstanceAsync(instance) {
        let result = {};
        try {
            for (let i = 0; i < instance.Prop.length; i++) {
                delete instance.Prop[i].hasError;
                if (instance.Prop[i].TP === 15 && instance.Prop[i].OBJ) {
                    let path = await Upload(instance.Prop[i].OBJ, instance.Prop[i].IPV);
                    instance.Prop[i].IPV = JSON.stringify(path.data);
                }
            }
            result = await axiosInstance.post('Instance/Saveinstance', instance);
            console.log(result)
            if (result.status === 200) {
                if (Utility.IsInstanceID(result.data.ID)) {
                    BaseInstance.syncData(instance, result.data);
                    let model = StorageController.FindModel(instance.ID);
                    if (model != null) {
                        if (result.data !== "") {
                            model.DataModel.Data.ID = result.data;
                            model.state = 0;
                            model.DataModel.Data.Prop.map((prop) => prop.state = 0);
                            model.Components.map((component) => component.Update(model.DataModel));
                        }
                    }
                    else {
                        let model = new DataModel();
                        model.Data = { instance, state: 0 };
                        model.Key = instance.ID;
                        model.Type = 'INSTANCE';
                        StorageController.AddToSource(model, null);
                    }
                    toast.success(GetDisplay('Save-msg'))
                }
                else {
                    toast.info(result.data)
                }
            }
            else {
                toast.error(GetDisplay('Opration-faild'))
                return;
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result?.data?.ID;
    }
    static async DeleteRelatedInstancesAsync(header, propid, relatedInstances) {
        let result = {};
        try {
            let data = { Header: header, ReltedPropId: propid, RelatedInstances: relatedInstances }
            result = await axiosInstance.post('Instance/DeleteRelatedInstances', data);
            if (result.status === 200) {
                if (result.data) {
                    toast.success(GetDisplay('delete-msg'))
                }
            }
            else {
                toast.error(GetDisplay('Opration-faild'))
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static async SaveRelatedInstancesAsync(header, propid, relatedInstances) {
        let result = {};
        try {
            let data = { Header: header, ReltedPropId: propid, RelatedInstances: relatedInstances }
            result = await axiosInstance.post('Instance/SaveRelatedInstances', data);
            if (result.status === 200) {
                console.log(result.data.Header)
                if (Utility.IsInstanceID(result.data.Header.ID)) {
                    header.ID=result.data.Header.ID;
                    toast.success(GetDisplay('Save-msg'))
                }
            }
            else {
                toast.error(GetDisplay('Opration-faild'))
            }
        } catch (e) {
            ErrorHandler.CominicationError(e);
            return false;
        }
        return result.data;
    }
    static UpdateValue(instanceid, pid, value) {
        let model = StorageController.FindModel(instanceid);
        let Instance = model.DataModel.Data;
        let updated = false;
        Instance.Prop.map((p, index) => {
            if (p.PID === pid) {
                p.IPV = value;
                Instance.Prop[index] = { ...p, state: 1 };
                updated = true;
            }
            return p;
        })
        if (!updated) {
            Instance.Prop = [
                ...Instance.Prop,
                { PID: pid, IPV: value, state: 2 }
            ]
        }
        Instance.state = 1;

    }
    static async GetInstancesAsync(ocid) {
        let result = [];

        try {
            let resultback = await axiosInstance.get('Instance/GetInstances', {
                params: { condition: ocid }
            });
            result = resultback.data;

        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async GetReport(condition) {
        let result = [];
        try {

            let resultback = await axiosInstance.post('Instance/Reports', { conditions: condition }
            );
            result = resultback.data
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async DeleteAsync(id, where = '#',withComfirm) {
        let result = [];
        try {

            if (Utility.IsInstanceID(id) && (withComfirm || window.confirm(GetDisplay('delete-comfirm')))) {
                let resultback = await axiosInstance.delete('Instance/DeleteInstance', {
                    params: { id: id, where: where }
                });
                result = resultback.data
                if(!withComfirm)
                toast.success(GetDisplay('delete-msg'))
            }
            else
                result = false;
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;
    }
    static async GetDisplay(id) {
        let result = {};
        try {
            result = await axiosInstance.get('Instance/LoadSimple', { params: { instanceid: id } });
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
    static async InvokeMethod(id, method, parameters) {
        let result = {};
        try {
            result = await axiosInstance.post('Instance/InvokeMethod', { classId: id, method: method, parameters: parameters });
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;
    }
}
