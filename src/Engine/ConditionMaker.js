import axiosInstance from "./BaseSetting";
import ErrorHandler from "./ErrorHandler";
import { InstanceController } from "./InstanceController";
import ObjectClassController from "./ObjectClassController";
import Parameters from "./Parameters";
export class ConditionManager {
    ResultFormID;
    FormID;
    ActionLink;
    ActionFormID;
    title = '';
    Editable;
    MainCondition = new EngineCondition();
    ActiveCommand;
    isReadonly;
    AutoRun = false;
    static async GetContentAsync(contentid) {
        let content = await ObjectClassController.GetFormAsync(contentid);
        let conditionManager = Object.assign(new ConditionManager(), content);
        conditionManager.MainCondition = await this.ConvettoClass(conditionManager.MainCondition);
        return conditionManager;
    }
    static async ConvettoClass(temp) {
        let result = Object.assign(new EngineCondition(), temp);
        for (let i = 0; i < result.sqlCondition?.BCs?.length; i++) {
            const BCs = result.sqlCondition.BCs[i];
            for (let j = 0; j < BCs.Bts.length; j++) {
                const con = BCs.Bts[j];
                if (con?.IPV?.includes('@'))
                    con.IPV = await Parameters.GetValue(con.IPV);
            }

        }
        if (temp.nextCondition)
            temp.nextCondition = this.ConvettoClass(temp.nextCondition);
        return result;
    }
    async SaveAsync() {
        return await ObjectClassController.SaveFormAsync(this);
    }
}
export class EngineCondition {
    constructor(ocid) {
        this.ID = ocid;
    }

    analytics = null;
    ID = '';
    DIS = '';
    startFor = null;
    recordCount = null;
    orderBy = null;
    groupBY = null;
    groupReturn = null;
    sqlCondition = null;
    properties = 'ALL';
    returnProperties = 'ALL';
    backObject = true;
    join = null;
    onJoin = null;
    whereType = 0;
    qType = 0;
    groupFilterID = null;
    isInstance = true;
    nextCondition = null;
    async GetResult() {
        let result = null;

        try {
            let temp = this.Convettostring({ ...this })
            let respons = await axiosInstance.post('Instance/GetConReport', temp);
            if (respons.status === 200)
                return respons.data;
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result;

    }
    Convettostring(temp) {
        temp.sqlCondition = JSON.stringify(temp.sqlCondition);
        if (temp.nextCondition)
            temp.nextCondition = this.Convettostring({ ...temp.nextCondition });
        return temp;
    }

}
export default class ConditionMaker {
    OCID = '';
    BCs = [];
    currentBlock = -1;
    constructor(ocid) {
        this.OCID = ocid;
        this.AddBlock();
    }
    AddBlock() {
        this.BCs = [...this.BCs, { Bts: [] }]
        this.currentBlock++;
    }
    AddCondition(propid, opration, value, logicOperation) {
        let row = { PID: propid, PRA: this.Oprator(opration), IPV: value, NLC: logicOperation ? logicOperation : 'None', SRC: '' };
        this.BCs[this.currentBlock].Bts = [...this.BCs[this.currentBlock].Bts, row];
        return this;
    }
    AddConditionBetween(propid, value1,value2, logicOperation) {
        let row = { PID: propid, PRA: 'between', IPV: `${value1} and ${value2}`, NLC: logicOperation ? logicOperation : 'None', SRC: '' };
        this.BCs[this.currentBlock].Bts = [...this.BCs[this.currentBlock].Bts, row];
        return this;
    }
    RemoveAtEnd(count) {
        this.BCs[this.currentBlock].Bts.splice([].length - count, count);
    }

    Oprator(simbol) {
        let result = '';
        switch (simbol) {
            case '=':
                result = 'Equal';
                break;
            case '>':
                result = 'BigerThan';
                break;
            case '<':
                result = 'SmallThan';
                break;
            case '<>':
                result = 'NotEqual';
                break;
                case 'like':
                result = 'like';
                break;
            default:
                result = simbol
                break;
        }
        return result;

    }
    async GetResult() {
        return await InstanceController.GetInstancesAsync(JSON.stringify(this));
    }
}
