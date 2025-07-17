import uuid from 'uuid/v1';
import { Utility } from './Common';
import { InstanceController } from './InstanceController';

export default class BaseInstance {
    Instance;
    constructor(instance) {
        this.Instance = instance;
    }
    get ID() {
        return this.Instance?.ID;
    }
    get display() {
        return this.Instance?.DIS;
    }
    get DIS() {
        return this.Instance?.DIS;
    }
    GetValue(propid, getobject) {
        if (this.Instance?.Prop === null)
            this.Instance.Prop = [];
        let prop = this.Instance?.Prop?.find(p => p.PID === propid);
        if (getobject) {
            if (prop?.OBJ === undefined && Utility.IsInstanceID(prop?.IPV)) {
                prop.OBJ = { ID: prop?.IPV, DIS: prop?.DIS ?? '' };
            }
            else if (prop?.OBJ === undefined && !Utility.IsInstanceID(prop?.IPV)) {
                return prop?.IPV;
            }

            return prop?.OBJ;
        }
        else
            return prop?.IPV;
    }
    SetValue(propid, value, TP) {
        if (this.Instance.Prop === null) {
            this.Instance.Prop = [];
        }
        let prop = this.Instance?.Prop?.find(p => p.PID === propid);

        if (prop === undefined) {
            prop = { PID: propid, IPV: '', TP };
            if (Array.isArray(this.Instance?.Prop))
                this.Instance.Prop = [...this.Instance?.Prop, prop];
            else
                this.Instance.Prop = [prop];

        }
        if (typeof value === 'object') {
            if (prop.IsInstance) {
                prop.IPV = JSON.stringify(value);
                prop.OBJ = value;
            }
            else {
                if (!prop.TP || prop.TP !== 15)
                    prop.IPV = value.ID ?? value.id;
                prop.DIS = value.DIS ?? value.display;
                prop.OBJ = value;
            }
            if (value.Instance !== undefined)
                prop.DIS = value.Instance.DIS;
            // else if (value.DIS !== undefined)
            //     prop.DIS = value.DIS;
            // else if (value.display !== undefined) {
            //     prop.IPV = value.id;
            //     prop.DIS = value.display;
            // }

        }
        else if (value !== undefined)
            prop.IPV = value.toString();
        else if (value === undefined)
            prop.IPV = '';
        return this.Instance;
    }
    GetProperty(propid) {
        let prop;
        if (this.Instance) {
            if (!this.Instance?.Prop || this.Instance?.Prop === null)
                this.Instance.Prop = [];
            prop = this.Instance?.Prop?.find(p => p.PID === propid);
            if (prop === undefined) {
                prop = { PID: propid, IPV: '' };
                this.Instance.Prop = [...this.Instance?.Prop, prop];
            }
        }
        return prop;
    }
    async SaveAsync() {
        return await InstanceController.SaveInstanceAsync(this.Instance);
    }
    async DeleteAsync(withconfirm) {
        return await InstanceController.DeleteAsync(this.Instance.ID, '#', withconfirm);
    }
    async GetAll() {
        return await InstanceController.GetInstancesAsync(this.Instance.ID);
    }
    getPropertyIds() {
        if (!this.Instance.Prop || this.Instance.Prop === null)
            this.Instance.Prop = [];
        let result = [];
        this.Instance.Prop.map(prop => result = [...result, prop.PID]);
        return result;
    }
    static syncData(base, source) {
        base.ID = source.ID;
        let baseIns = new BaseInstance(base);
        let SourceIns = new BaseInstance(source);
        let ides = baseIns.getPropertyIds();
        for (var i = 0; i < ides.length; i++) {
            if (baseIns.GetProperty(ides[i])?.IsInstance) {
                baseIns.GetValue(ides[i], true).ID = SourceIns.GetValue(ides[i]);
            }

        }

        return baseIns.Instance;
    }
    instanceToRow(props) {
        let data = { id: this.ID, display: this.display };
        if (props)
            this.Instance.Prop.map(prop => props.findIndex(x => x === prop.PID) >= 0 ? data[prop.PID] = prop.DIS ?? (prop.display ?? `=""${prop.IPV}""`) : null);
        else
            this.Instance.Prop.map(prop => data[prop.PID] = prop.DIS ?? (prop.display ?? `=""${prop.IPV}""`));
        return data;
    }
}
export const NewInstance = (id = '') => ({
    ...{
        ID: id,
        UID: uuid(),
        Prop: []
    }
});
export const NewProperty = (pid = '', value = '') => ({
    IPV: value,
    PID: pid
});