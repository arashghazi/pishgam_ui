
import BaseInstance, { NewInstance, NewProperty } from "../Engine/BaseInstance";
import ConditionMaker from "../Engine/ConditionMaker";
import { InstanceController } from "../Engine/InstanceController";
export class TbSample extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C122');
            TbSample.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    //static PIDs = ['P168', 'P9', 'P167', 'P169', 'P170', 'P171'];
    static PIDs = ['P167', 'P9', 'P38', 'P168', 'P169', 'P170', 'P172','P15'
    ,"P192","P200"
    ];

    set CtInternal1(value) {
        this.SetValue(TbSample.PIDs[9], value);
        console.log(TbSample.PIDs[9],value)
    }
    get CtInternal1() {
        return this.GetValue(TbSample.PIDs[9]);
    }
    
    set Ct1(value) {
        this.SetValue(TbSample.PIDs[8], value);
    }
    get Ct1() {
        return this.GetValue(TbSample.PIDs[8]);
    }
    
    set Header(value) {
        this.SetValue(TbSample.PIDs[0], value);
    }
    get Header() {
        return this.GetValue(TbSample.PIDs[0]);
    } set Sample(value) {
        this.SetValue(TbSample.PIDs[1], value);
    }
    get Sample() {
        return this.GetValue(TbSample.PIDs[1]);
    }
    get SampleObj() {
        return this.GetValue(TbSample.PIDs[1], true);
    }
    set Result(value) {
        this.SetValue(TbSample.PIDs[2], value);
    }
    get Result() {
        return this.GetValue(TbSample.PIDs[2]);
    } set SDA(value) {
        this.SetValue(TbSample.PIDs[3], value);
    }
    get SDA() {
        return this.GetValue(TbSample.PIDs[3]);
    } set CV(value) {
        this.SetValue(TbSample.PIDs[4], value);
    }
    get CV() {
        return this.GetValue(TbSample.PIDs[4]);
    } set AVG(value) {
        this.SetValue(TbSample.PIDs[5], value);
    }
    get AVG() {
        return this.GetValue(TbSample.PIDs[5]);
    }
    set infectionLevel(value) {
        this.SetValue(TbSample.PIDs[6], value);
    }
    get infectionLevel() {
        return this.GetValue(TbSample.PIDs[6]);
    }
    set IntResult(value) {
        this.SetValue(TbSample.PIDs[7], value);
    }
    get IntResult() {
        return this.GetValue(TbSample.PIDs[7]);
    }
    static async loaderExAnswer (localSample,period) {
        let rows = [];
        let others = [];
        for (let samindex = 0; samindex < localSample.length; samindex++) {
            const sample1 = localSample[samindex];
            let cond = new ConditionMaker('O30E12C122');
            cond.AddCondition('P167', '=', period,'And')
                .AddCondition('P9', '=', sample1.ID);
            let list = await cond.GetResult();

            var temprows = list.map(row => new TbSample(row));
            let flag = false;
            for (let index = 0; index < temprows.length; index++) {
                const row = temprows[index];
                if (sample1.ID === row.Sample) {
                    row.Sample = new BaseInstance(sample1);
                    flag = true;
                    rows =[...rows,row];
                }
            }

            if (!flag) {
                others = [...others, sample1];
            }
        }

        for (let index = 0; index < others.length; index++) {
            const smp = others[index];
            let temp = new TbSample();
            temp.Sample = new BaseInstance(smp);
            rows = [...rows, temp];
       
        }
        // others.map(smp => {
        //     let temp = new TbSample();
        //     temp.Sample = new BaseInstance(smp);
        //     rows = [...rows, temp];
        // });
        return rows;
    }
    async CalculateSDI(period){
        let sampleList=[];
        let cond = new ConditionMaker('O30E12C39');
        cond.AddCondition('P3', '=', period);
        let result =await cond.GetResult();
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            let con1=new ConditionMaker('O30E12C39');
            con1.AddCondition('P8','=',element.Prop.find(x=>x.PID==='P8').IPV)
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(con1)
            , 'P167', ['O30E12C122'])
            for (let index = 0; index < doc.RelatedInstances.length; index++) {
                const row = doc.RelatedInstances[index];
                sampleList=[...sampleList,
                    {sample:row.Prop.find(x=>x.PID==='P9')?.IPV,
                result:row.Prop.find(x=>x.PID==='P15')?.IPV}]
            }
        }

        return(sampleList);
    }
    List=[];
    median;
    Lis2=[];
    Lis3=[];
    landa;
    s;
    max;
    min;
}
