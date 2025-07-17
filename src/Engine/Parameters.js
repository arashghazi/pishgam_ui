
import { Utility } from './Common';
import ErrorHandler from './ErrorHandler';
import { InstanceController } from './InstanceController';

export default class Parameters {
    constructor() {
        try {
            this.paths = [
                { key: 'personid', value: localStorage.getItem('user-info') ? JSON.parse(JSON.parse(localStorage.getItem('user-info'))?.person)?.ID : null },
                { key: 'person', value: { id: localStorage.getItem('user-info') ? JSON.parse(JSON.parse(localStorage.getItem('user-info'))?.person)?.ID : null, display: localStorage.getItem('person') } },
                { key: 'orgid', value: localStorage.getItem('org') ? JSON.parse(localStorage.getItem('org'))?.id : null }
            ]
        } catch (error) {
            localStorage.clear();
        }

    }
    static Mode = 1;
    static Starter = null;
    static Param = [];
    static org;
    static Start(key, value, sender) {
        this.Starter = sender;
        this.SetValue(key, value);
    }
    static async GetValue(key, prop, type) {
        let result = null;
        if (key === 'Date'){
            result = (await Utility.GetNow()).toString;
        }
        else if (key.includes('@')) {
            let path = key.replace('@', '');
            if (path.includes('org')) {
                let res = JSON.parse(localStorage.getItem('org'))?.id;
                if (res) {
                    if (!this.org)
                        this.org = await InstanceController.GetDisplay(res);
                    if (path === 'orgid')
                        result = this.org?.id;
                    if (path === 'org')
                        result = this.org;

                }
            }
            else if (path.includes('personid')){
                result = JSON.parse(JSON.parse(localStorage.getItem('user-info'))?.person);
                result = {id:result.ID,display:result.DIS};
            }
            else {
                result = localStorage.getItem(key);
            }
        }
        else {
            let param = this.Param.find(x => x.key.toUpperCase() === key.toUpperCase() && x.state.toUpperCase() === 'FULL')
            if (param !== undefined) {
                if (Array.isArray(param.Value) && param.Value.length > 0)
                    result = param.Value[0];
                else
                    result = param.Value;
            }
            if (result !== null) {

                if (prop !== undefined && prop !== null && result.Prop !== undefined)
                    result = result.Prop.find(x => x.PID === prop)
                if (type !== undefined)
                    result = type === 'display' ? result.display : type === 'id' ? result.id : result
            }
        }
        return result;
    }
    static async SetValue(key, value) {
        let param = this.Param.find(x => x.key.toUpperCase() === key.toUpperCase())
        if (param !== undefined) {
            param.Value = value;
            param.state = 'FULL';
            await this.FillDependecy(key);
        }
        else{
            this.Param.push({ key: key, Value: value, state: 'Param', Depend: [] });
        }
    }
    static async FillDependecy(key) {
        try {

            let params = this.Param.filter(x => x.Depend.findIndex(y => y.toUpperCase() === key.toUpperCase()) >= 0)
            if (params !== undefined && params.length > 0) {
                for (var i = 0; i < params.length; i++) {
                    let flag = true;
                    let whereResult = '';
                    if (params[i].Condition !== '') {
                        let wherepara = params[i].Condition.split('{');
                        for (var j = 0; j < wherepara.length; j++) {

                            let key = wherepara[j].includes('}') ? wherepara[j].split('}')[0] : null;

                            if (key !== null) {
                                let keyvalue = this.GetValue(key);
                                if (keyvalue !== null && keyvalue.ID !== undefined)
                                    keyvalue = keyvalue.ID;
                                whereResult = params[i].Condition.replace('{' + key + '}', keyvalue)
                            }

                        }
                        if (flag) {
                            let result = await InstanceController.GetInstancesAsync(whereResult);
                            if (result !== null) {
                                let finalresult = result;
                                if (Array.isArray(result))
                                    finalresult = result.map((item) => (
                                        item.ID.includes('E0C13I') ? { id: item.Prop.find(x => x.PID === 'PC524').IPV, display: item.Prop.find(x => x.PID === 'PC524').DIS } : item
                                    ))
                                else
                                    finalresult = result.ID.includes('E0C13I') ? { id: result.Prop.find(x => x.PID === 'PC524').IPV, display: result.Prop.find(x => x.PID === 'PC524').DIS } : result
                                this.SetValue(params[i].key, finalresult);
                            }
                        }
                    }
                }
            }
            else
                this.Starter.LoadCompleted();
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }

    }

}
