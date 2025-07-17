
import ConditionMaker from "../../Engine/ConditionMaker";
import BaseInstance, { NewInstance, NewProperty } from "../../Engine/BaseInstance";
import { Utility } from "../../Engine/Common";
import Parameters from "../../Engine/Parameters";
import { AdminController } from "../../Engine/AdminController";
export class Certificate extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C129');
            Certificate.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['P81', 'P8', 'P2', 'PC138', 'PC556', 'P177', 'PC92'];
    set RegisterDate(value) {
        this.SetValue(Certificate.PIDs[0], value);
    }
    get RegisterDate() {
        return this.GetValue(Certificate.PIDs[0]);
    } set Labratoary(value) {
        this.SetValue(Certificate.PIDs[1], value);
    }
    get Labratoary() {
        return this.GetValue(Certificate.PIDs[1]);
    } set Year(value) {
        this.SetValue(Certificate.PIDs[2], value);
    }
    get Year() {
        return this.GetValue(Certificate.PIDs[2]);
    } set PINCode(value) {
        this.SetValue(Certificate.PIDs[3], value);
    }
    get PINCode() {
        return this.GetValue(Certificate.PIDs[3]);
    } set Json(value) {
        this.SetValue(Certificate.PIDs[4], value);
    }
    get Json() {
        return this.GetValue(Certificate.PIDs[4]);
    }
    set CertID(value) {
        this.SetValue(Certificate.PIDs[5], value);
    }
    get CertID() {
        return this.GetValue(Certificate.PIDs[5]);
    }
    set debtor(value) {
        this.SetValue(Certificate.PIDs[6], value);
    }
    get debtor() {
        return this.GetValue(Certificate.PIDs[6]);
    }
    get JsonObject() {
        if (this.Json)
            return JSON.parse(this.Json);
        return null;
    }
    get labDis() {
        return this.GetProperty('P8')?.DIS;
    }
    async hide() {
        this.debtor = '1';
        return await this.SaveAsync();
    }
    async show() {
        this.debtor = '0';
        return await this.SaveAsync();
    }
    static async getCertBy(year, lab) {
        let condition = new ConditionMaker('O30E12C129')
        condition.AddCondition('P8', '=', `${lab}`, 'and');
        condition.AddCondition('P2', '=', `${year}`)
        var instances = await condition.GetResult();
        if (instances?.length > 0) {
            return new Certificate(instances[0]);
        }
        return new Certificate();
    }
    static async getCertById(id) {
        let result = await Utility.GetCertificate(id);
        if (result) {
            return new Certificate(result);
        }
        return null;
    }
    static async getFile(id) {
        await Utility.GetCertFile(id);
    }
    static async getAllCerts() {
        let org = await Parameters.GetValue('@orgid');
        let condition = new ConditionMaker('O30E12C129');
        condition.AddCondition('P8', '=', `${org}`);
        var instances = await condition.GetResult();
        if (instances?.length > 0) {
            return instances.map((item) => new Certificate(item));
        }
        return null;
    }
    static async Rebuild(yearId,labId) {
        let result = await AdminController.BuildCertificate(yearId,labId);
        return result;
    }
    
}
