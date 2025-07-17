import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, CardBody,  Table } from 'reactstrap';
import BaseInstance from '../Engine/BaseInstance';
import ConditionMaker, { EngineCondition } from '../Engine/ConditionMaker';
import { InstanceController } from '../Engine/InstanceController';
import AdminReportPreiodicHeader from './AdminReportPreiodicHeader';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import ReportHeader from './ReportHeader';
import { TbSample } from './TBSample';

const TBReport = ({ match, lab }) => {
    const [period, setPeriod] = useState();
    const [labratoary, setLab] = useState();
    const [loading, setLoading] = useState(false);
    const [samples, setSamples] = useState([]);
    const [resultSample, setResultSample] = useState([]);
    const [expResultSample, setExpResultSample] = useState([]);
    const [noResult, setNoResult] = useState(false);

useEffect(()=>{
    setLab(lab);
},[lab])
    useEffect(() => {
        const fetch = async () => {
            let comsample = new EngineCondition();
            comsample.ID = 'O30E23C4';
            let samcon = new ConditionMaker('O30E23C4');
            samcon.AddCondition('P3', '=', period.id, 'AND')
                .AddCondition('P1', '=', 'O30E23C2I15');
            comsample.sqlCondition = samcon;
            comsample.returnProperties = 'P156';
            let samresult = await comsample.GetResult();
            setSamples(samresult);
            setLoading(true);
            let rows = await TbSample.loaderExAnswer(samresult, period.id);
            setExpResultSample(rows);
            setLoading(false);
            if(labratoary){
                await Loader(null,samresult);
            }
        }
        if (period)
            fetch();
    }, [period])
    useEffect(() => {
        Loader();
    }, [labratoary])
    const Loader = async (id, Loadedsamples) => {
        setNoResult(false);
        let cond = new ConditionMaker('O30E12C34');
        let localSample = samples?.length > 0 ? samples : Loadedsamples;
        if (localSample?.length > 0) {
            if (typeof id === "string") {
                cond.AddCondition("ID", '=', id);
            }
            else if (period && labratoary) {
                cond.AddCondition('P3', '=', period.id, 'And');
                cond.AddCondition(PropConstIdes.Lab, '=', labratoary.id);
            }
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(cond)
                , 'P167', ['O30E12C122']);
            if (doc?.Header?.ID) {
                let rows = [];
                doc.RelatedInstances.map(row => {
                    let tempins = new TbSample(row);

                    rows = [...rows, tempins];
                });
                let others = [];
                for (let samindex = 0; samindex < localSample.length; samindex++) {
                    const sample1 = localSample[samindex];
                    let flag = false;
                    for (let index = 0; index < rows.length; index++) {
                        const row = rows[index];
                        if (sample1.ID === row.Sample) {
                            row.Sample = new BaseInstance(sample1);
                            flag = true;
                        }
                    }
                    if (!flag) {
                        others = [...others, sample1];
                    }
                }
                others.map(smp => {
                    let temp = new TbSample();
                    temp.Sample = new BaseInstance(smp);
                    rows = [...rows, temp];
                });
                setResultSample(rows);
            }
            else{
                setNoResult(true);
            }

        }
    }
    const PropertyHandler = async (pid, value) => {
        if (pid.includes(ConstIdes.Period + 'I')) {
            //value.Instance = new BaseInstance(await InstanceController.LoadInstanceAsync(value.id));
            setPeriod(value);
        }
        else if (pid.includes(ConstIdes.Lab + 'I')) {
            setLab(value);
        }
    }

    const LoadTests = () => {

    }
    return (<>
        <AdminReportPreiodicHeader title='گزارش نهایی TB'
            domainId='O30E23C2I15' PropertyHandler={PropertyHandler}
            LoadTests={LoadTests}
        />
        <Card>
            <CardBody>
                <ReportHeader Section='TB'
                    Labratoary={labratoary?.display}
                    period={period?.display} noData={noResult}
                >
                <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                    <thead>
                        <tr>
                            <th>شماره نمونه</th>
                            <th>نتیجه آزمایشگاه</th>
                            <th>نتیجه مورد انتظار</th>
                            <th>میزان عفونت(آزمایشگاه)</th>
                            <th>میزان عفونت(مورد انتظار)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expResultSample.map((row,index) => <tr key={row.ID+index}>
                            <td>{row?.GetProperty('P9')?.DIS}</td>
                            <td>{resultSample.find(x=>x.GetValue('P9')===row?.GetValue('P9'))?.GetProperty('P38')?.DIS}</td>
                            <td>{row?.GetProperty('P38')?.DIS}</td>
                            <td>{resultSample.find(x=>x.GetValue('P9')===row?.GetValue('P9'))?.GetProperty('P172')?.DIS}</td>
                            <td>{row?.GetProperty('P172')?.DIS}</td>
                        </tr>)}</tbody>
                </Table>
                </ReportHeader>
            </CardBody>

        </Card>
    </>);
};

export default TBReport;