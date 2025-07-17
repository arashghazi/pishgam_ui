import BaseInstance, { NewInstance, NewProperty } from "../../Engine/BaseInstance";
import ConditionMaker from "../../Engine/ConditionMaker";
import Parameters from "../../Engine/Parameters";
import { surveyQuestions } from "./Survey";

export class SurveyInstance extends BaseInstance {
    static year=1403;
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E0C26');
            super(instance);
            SurveyInstance.PIDs.forEach(pid => {
                instance.Prop.push(NewProperty(pid));
                Object.defineProperty(this, pid, {
                    get: () => this.GetValue(pid),
                    set: (value) => this.SetValue(pid, value)
                });
            });
        }
    }
    static PIDs = ["P8", "P3", "P81", "P212", "P213", "P214", "P215", "P216", "P217", "P218"
        , "P219", "P220", "P221", "P222", "P223", "P224", "P225", "P226", "P227", "P228", "P229"];


    static async HasData() {
        let org = await Parameters.GetValue('@orgid');
        let condition = new ConditionMaker('O30E0C26');
        condition.AddCondition('P8', '=', `${org}`,'and')
        .AddCondition('P229', '=', `${this.year}`);
        var instances = await condition.GetResult();
        return instances.length > 0;
    }
    static async fillAuto() {
        var survey = new SurveyInstance();
            let org = await Parameters.GetValue('@orgid');
            survey.P8 = org;
            survey.P81 = Date.now();
            survey.P212 ="خوب";
            survey.P213 = "خوب";
            survey.P214 = "خوب";
            survey.P215 = "خوب";
            survey.P216 = "خوب";
            survey.P217 = "خوب";
            survey.P218 = "خوب";
            survey.P219 = "خوب";
            survey.P220 = "خوب";
            survey.P221 = "خوب";
            survey.P222 = "خوب";
            survey.P223 = "خوب";
            survey.P224 = "خوب";
            survey.P225 = "بلی";
            survey.P226 = "بلی";
            survey.P227 ="بلی";
            survey.P228 = "بلی";
            survey.P229 = SurveyInstance.year;
            if (await survey.SaveAsync()) {
              localStorage.setItem('@hasSurvey', SurveyInstance.year);
            }
            window.location.href = "/";
    }

}