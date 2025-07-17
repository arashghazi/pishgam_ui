import BaseInstance, { NewInstance, NewProperty } from "./BaseInstance";
import ConditionMaker from "./ConditionMaker";


export class ReportHistory extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('E0C24');
            ReportHistory.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95', 'PC556', 'PC19', 'PC363'];
    set Title(value) {
        this.SetValue(ReportHistory.PIDs[0], value);
    }
    get Title() {
        return this.GetValue(ReportHistory.PIDs[0]);
    } set Json(value) {
        this.SetValue(ReportHistory.PIDs[1], value);
    }
    get Json() {
        return this.GetValue(ReportHistory.PIDs[1]);
    } set Refrence(value) {
        this.SetValue(ReportHistory.PIDs[2], value);
    }
    get Refrence() {
        return this.GetValue(ReportHistory.PIDs[2]);
    } set Date(value) {
        this.SetValue(ReportHistory.PIDs[3], value);
    }
    get Date() {
        return this.GetValue(ReportHistory.PIDs[3]);
    }
    static async Find(key, name) {
        let condition = new ConditionMaker('E0C24');
        condition.AddCondition('PC19','=',key);
        let temp =await condition.GetResult();
        let result=[];
        temp.map((item)=>result=[...result,new ReportHistory(item)])
        return result;
    }

}