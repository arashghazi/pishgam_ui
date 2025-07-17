import BaseInstance from "./Engine/BaseInstance";
import { InstanceController } from "./Engine/InstanceController";

export default class InstitutionContext extends BaseInstance {
    static async GetInstitution() {
        let id = localStorage.getItem('org');
        if (id !== undefined)
            id = JSON.parse(id)?.id;
        if (id !== undefined) {
            let instance = await InstanceController.LoadInstanceAsync(id);
            return new InstitutionContext(instance);
        }
        return null;
    }
    Name = this.GetValue('PC88');
    University = this.GetValue('P5');
    OldCode = this.GetValue('P6');
    EconomicCode = this.GetValue('P68');
    Email = this.GetValue('PC108');
    Address = this.GetValue('P70');
    PostCode = this.GetValue('PC147');
    Tel = this.GetValue('PC365');
}