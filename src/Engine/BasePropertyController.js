import StorageController, { DataModel } from './StorageController'
import uuid from 'uuid';
import { toast } from 'react-toastify';
import axiosInstance from './BaseSetting';

export default class BasePropertyController {
    static async GetPropertyList(propids=[]) {
            let resultlist = [];
        try {
            let remainides = '';
            propids.map(async function (propid) {
                let result = StorageController.FindModel(propid, 'BASEPROPERTY');
                if (result === null)
                    remainides += propid + ',';
                else
                    resultlist = [...resultlist, result.DataModel.Data];
            });
            if (remainides !== '') {
                let resultdata = await axiosInstance.get('ObjectClass/GetBasePropertyList', {
                    params: { listIDes: remainides }
                });
                resultlist = [...resultlist, ...resultdata.data]
                resultdata.data.map((item) => {
                    let model = new DataModel();
                    model.Data = item;
                    model.Key = item.ID;
                    model.Type = 'BASEPROPERTY';
                    StorageController.AddToSource(model);
                    return model;
                });
            }
        } catch (e) {
            console.log(e);
        }
        return resultlist;
    }
    static async LoadAsync(pid) {
        let result = StorageController.FindModel(pid, 'BASEPROPERTY');
        try {
            if (result === null) {
                let list = await this.GetPropertyList([pid]);

                if (list.length > 0)
                    result = list[0];
            }
            else {
                result = result.DataModel.Data;
            }
        } catch (e) {
            console.log(e);
        }
        return result;
    }
    static async SaveAsync(pid, prop) {
        let result = {};
        try {
            result = await axiosInstance.post('ObjectClass/SaveBaseProperty', prop);
            console.log(result)
            if (result.data !== "") {
                prop.ID = result.data;
                let model = StorageController.FindModel(pid, 'BASEPROPERTY');
                if (model != null) {
                    model.DataModel.Data = prop;
                    model.state = 0;
                    //model.Components.map((component) => component.Update(model.DataModel));
                }
                else {
                    model = new DataModel();
                    model.Data = prop;
                    model.Key = prop.ID;
                    model.Type = 'BASEPROPERTY';
                    StorageController.AddToSource(model);
                }
                toast.success('ُSave was successful.')
            }
            else
                toast.error('have problem.')

        } catch (e) {
            toast.error(e)
            console.log(e);
        }
        return result.data;
    }
    static New() {
        let item = { ...baseProperty }
        let model = new DataModel();
        model.Data = item;
        model.Key = item.ID;
        model.Type = 'BASEPROPERTY';
        StorageController.AddToSource(model);
        return item;
    };
}
const baseProperty = {
    ID: uuid(),
    PSource: "",
    Contexts: [{ Lan: "fa-IR", Context: "" }],
    StyleW2: {
        Control: "None",
        DataType: "String",
        Min: 0.0, Max: 0.0,
        ValueLengh: 0,
        MultiValue: false,
        ValueQty: 0,
        State: "1",
        History: false,
        FixedValue: false,
        IsMultilingual: false
    }
}