import BaseInstance, { NewInstance, NewProperty } from "../../../Engine/BaseInstance";
import ConditionMaker from "../../../Engine/ConditionMaker";

export class BacteryGender extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C65');
            BacteryGender.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC88'];
    set Name(value) {
        this.SetValue(BacteryGender.PIDs[0], value);
    }
    get Name()
    {
        return this.GetValue(BacteryGender.PIDs[0]);
    }
}

export class BacterySpices extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C66');
            BacterySpices.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC88', 'P91','PC612'];
    set Name(value) {
        this.SetValue(BacterySpices.PIDs[0], value);
    }
    get Name()
    {
        return this.GetValue(BacterySpices.PIDs[0]);
    }
    set BacterySpices(value) {
        this.SetValue(BacterySpices.PIDs[1], value);
    }
    get BacterySpices()
    {
        return this.GetValue(BacterySpices.PIDs[1]);
    }
    set NoShow(value) {
        this.SetValue(BacterySpices.PIDs[2], value);
    }
    get NoShow()
    {
        return this.GetValue(BacterySpices.PIDs[2]);
    }
    async getListby(gender) {
        let con = new ConditionMaker('O30E12C66');
        con.AddCondition('P91', '=', gender);
        return await con.GetResult();
    }
    async getActiveListby(gender) {
        let con = new ConditionMaker('O30E12C66');
        let con1=con.AddCondition('P91', '=', gender,'AND');
        con1.AddCondition('PC612', '<>', true);
        return await con.GetResult();
    }
}

export class BacteryDiagnosis extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C67');
            BacteryDiagnosis.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['P91', 'P92', 'P100'];
    set BacteryGender(value) {
        this.SetValue(BacteryDiagnosis.PIDs[0], value);
    }
    get BacteryGender()
    {
        return this.GetValue(BacteryDiagnosis.PIDs[0]);
    } set BacterySpices(value) {
        this.SetValue(BacteryDiagnosis.PIDs[1], value);
    }
    get BacterySpices()
    {
        return this.GetValue(BacteryDiagnosis.PIDs[1]);
    } set DocumentHeader(value) {
        this.SetValue(BacteryDiagnosis.PIDs[2], value);
    }
    get DocumentHeader()
    {
        return this.GetValue(BacteryDiagnosis.PIDs[2]);
    }
    get BacteryGenderObj()
    {
        let prop = this.GetProperty(BacteryDiagnosis.PIDs[0]);
        return {id:prop.IPV,display:prop.DIS};
    }
    get BacterySpicesObj()
    {
        let prop =this.GetProperty(BacteryDiagnosis.PIDs[1]);
        return {id:prop.IPV,display:prop.DIS};
    }
}

export class BacteryTest extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C68');
            BacteryTest.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95'];
    set Title(value) {
        this.SetValue(BacteryTest.PIDs[0], value);
    }
    get Title() {
        return this.GetValue(BacteryTest.PIDs[0]);
    }
}

export class BacteryTestRow extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C69');
            BacteryTestRow.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC2', 'P93', 'P94', 'P100'];
    set Rows(value) {
        this.SetValue(BacteryTestRow.PIDs[0], value);
    }
    get Rows() {
        return this.GetValue(BacteryTestRow.PIDs[0]);
    } set BacteryTest(value) {
        this.SetValue(BacteryTestRow.PIDs[1], value);
    }
    get BacteryTest() {
        return this.GetValue(BacteryTestRow.PIDs[1]);
    }
    get BacteryTestObject() {
        return this.GetValue(BacteryTestRow.PIDs[1],true);
    }
    set Result(value) {
        this.SetValue(BacteryTestRow.PIDs[2], value);
    }
    get Result() {
        return this.GetValue(BacteryTestRow.PIDs[2]);
    }
    get ResultObject() {
        return this.GetValue(BacteryTestRow.PIDs[2],true);
    }
    set DocumentHeader(value) {
        this.SetValue(BacteryTestRow.PIDs[3], value);
    }
    get DocumentHeader() {
        return this.GetValue(BacteryTestRow.PIDs[3]);
    }
    
}

export class BacteryTestResult extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C70');
            BacteryTestResult.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC88','P99'];
    set Name(value) {
        this.SetValue(BacteryTestResult.PIDs[0], value);
    }
    get Name()
    {
        return this.GetValue(BacteryTestResult.PIDs[0]);
    }
    set Test(value) {
        this.SetValue(BacteryTestResult.PIDs[1], value);
    }
    get Test() {
        return this.GetValue(BacteryTestResult.PIDs[1]);
    }
    async getListby(test) {
        let con = new ConditionMaker('O30E12C70');
        con.AddCondition('P99', '=', test);
        return await con.GetResult();
    }
}

export class AntibioticsDisk extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C71');
            AntibioticsDisk.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95'];
    set Title(value) {
        this.SetValue(AntibioticsDisk.PIDs[0], value);
    }
    get Title()
    {
        return this.GetValue(AntibioticsDisk.PIDs[0]);
    }
}

export class AntibioticsDiskMaker extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C72');
            AntibioticsDiskMaker.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC88'];
    set Name(value) {
        this.SetValue(AntibioticsDiskMaker.PIDs[0], value);
    }
    get Name()
    {
        return this.GetValue(AntibioticsDiskMaker.PIDs[0]);
    }
}

export class AntibioticsResultInterpretation extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C73');
            AntibioticsResultInterpretation.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95'];
    set Title(value) {
        this.SetValue(AntibioticsResultInterpretation.PIDs[0], value);
    }
    get Title()
    {
        return this.GetValue(AntibioticsResultInterpretation.PIDs[0]);
    }
}

export class AntibioticsRow extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C74');
            AntibioticsRow.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC2', 'P95', 'P96', 'P97', 'P98','P100'];
    set Rows(value) {
        this.SetValue(AntibioticsRow.PIDs[0], value);
    }
    get Rows()
    {
        return this.GetValue(AntibioticsRow.PIDs[0]);
    } set AntibioticsDisk(value) {
        this.SetValue(AntibioticsRow.PIDs[1], value);
    }
    get AntibioticsDisk()
    {
        return this.GetValue(AntibioticsRow.PIDs[1]);
    }
    get AntibioticsDiskObject() {
        return this.GetValue(AntibioticsRow.PIDs[1],true);
    }
    set AntibioticsDiskMaker(value) {
        this.SetValue(AntibioticsRow.PIDs[2], value);
    }
    get AntibioticsDiskMaker()
    {
        return this.GetValue(AntibioticsRow.PIDs[2]);
    }
    get AntibioticsDiskMakerObject() {
        return this.GetValue(AntibioticsRow.PIDs[2], true);
    }
    set GrowsHole(value) {
        this.SetValue(AntibioticsRow.PIDs[3], value);
    }
    get GrowsHole()
    {
        return this.GetValue(AntibioticsRow.PIDs[3]);
    } set AntibioticsResultInterpretation(value) {
        this.SetValue(AntibioticsRow.PIDs[4], value);
    }
    get AntibioticsResultInterpretation()
    {
        return this.GetValue(AntibioticsRow.PIDs[4]);
    }
    get AntibioticsResultInterpretationObject() {
        return this.GetValue(AntibioticsRow.PIDs[4],true);
    }
    set DocumentHeader(value) {
        this.SetValue(BacteryTestRow.PIDs[5], value);
    }
    get DocumentHeader() {
        return this.GetValue(BacteryTestRow.PIDs[5]);
    }
}
