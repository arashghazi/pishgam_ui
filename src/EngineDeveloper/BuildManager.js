import { NewForm } from "../Engine/Common";
import DataManager from "../EngineForms/DataManager";

export class BuildManager {
    constructor(formBuilder) {
        this.FormBuilder = formBuilder;
    }
    FormBuilder;
    DM;
    ObjectClass;
    formId;

    ChangeForm(FormID) {
        if (FormID !== '') {
            if (FormID === 'new') {
                FormID = this.ObjectClass.ID;
                this.formId = FormID;
                if (this.DM) {
                    this.DM.MainFormID = FormID;
                    this.DM.FormStructuer = { ...NewForm, FormID: FormID,ShowType:'vertical' };
                    this.FormBuilder.UpdateForm('');
                    this.DM.ChangeForm();
                }
                
            }
            else {
                this.FormBuilder.UpdateForm(FormID);
            }
        }
    }
    Update() {
        this.DM.ChangeForm();
    }
}