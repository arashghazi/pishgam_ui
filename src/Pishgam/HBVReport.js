import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, CardBody, CardFooter, Table } from 'reactstrap';
import BaseInstance from '../Engine/BaseInstance';
import ConditionMaker, { EngineCondition } from '../Engine/ConditionMaker';
import { FromManagerDataTemplate } from '../Engine/FormDataTemplate';
import { InstanceController } from '../Engine/InstanceController';
import AdminReportPreiodicHeader from './AdminReportPreiodicHeader';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import ReportHeader from './ReportHeader';
import { TbSample } from './TBSample';

const HBVReport = ({ lab }) => {
    const [period, setPeriod] = useState();
    const [labratoary, setLab] = useState();
    const [loading, setLoading] = useState(false);
    const [samples, setSamples] = useState([]);
    const [resultSample, setResultSample] = useState([]);
    const [expResultSample, setExpResultSample] = useState([]);
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        setLab(lab);
    }, [lab])
    useEffect(() => {
        const fetch = async () => {
            let comsample = new EngineCondition();
            comsample.ID = 'O30E23C4';
            let samcon = new ConditionMaker('O30E23C4');
            samcon.AddCondition('P3', '=', period.id, 'AND')
                .AddCondition('P1', '=', 'O30E23C2I16');
            comsample.sqlCondition = samcon;
            comsample.returnProperties = 'P156';
            let samresult = await comsample.GetResult();
            setSamples(samresult);
            setLoading(true);
            let tempData = await FromManagerDataTemplate.LoadByAsync(`#${period.id}#O30E23C2I16#expected#`);
            if (tempData?.ID) {

                let rows = JSON.parse(tempData.Json);
                let result = [];
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    let val = new TbSample(element.Instance);
                    val.Sample = new BaseInstance(val.SampleObj.Instance);
                    result = [...result, val];
                }
                setExpResultSample(result);
            }
            if (labratoary) {
                await Loader(null, samresult);
            }
            setLoading(false);

        }
        if (period)
            fetch();
    }, [period])
    useEffect(() => {
        Loader();
    }, [labratoary])
    const Loader = async (id, Loadedsamples) => {
        setNoResult(false);
        let cond = new ConditionMaker('O30E12C39');
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
    // const SDICalculator = (exAnswer, answer) => {
    //     if (answer?.IntResult && exAnswer.SDA) {
    //         let labResult = parseFloat(answer.IntResult);
    //         let avg = parseFloat(exAnswer.SDA);
    //         return Math.abs(((((Math.log10(labResult) - avg) / avg) * 100) / 15).toFixed(2));
    //     }
    //     return '';
    // }
    return (<>
        <AdminReportPreiodicHeader title='گزارش نهایی HBV'
            domainId='O30E23C2I16' PropertyHandler={PropertyHandler}
            LoadTests={LoadTests} />
        <Card>
            <CardBody>
                <ReportHeader Section='HBV'
                    Labratoary={labratoary?.display}
                    period={period?.display} noData={noResult}
                >
                    <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                        <thead>
                            <tr>
                                <th>شماره نمونه</th>
                                <th>تفسیر آزمایشگاه</th>
                                <th>تفسیر مورد انتظار</th>
                                {/* <th>نتیجه آزمایشگاه</th>
                                <th>SDI</th> */}
                            </tr>
                        </thead>
                        <tbody>
 
                            {resultSample.map((row) =>row?.GetProperty('P38')?.DIS? 
                            <tr key={row.Instance.ID}>
                                <td>{row.GetProperty('P9')?.DIS}</td>
                                <td>{row?.GetProperty('P38')?.DIS}</td>
                                <td>{expResultSample.find(x => x.GetValue('P9') === row?.GetValue('P9'))?.GetProperty('P38')?.IPV=== 'O30E12C29I2' ? 'Positive' : 'Negative'}</td>
                                {/* <td>{resultSample.find(x => x.GetValue('P9') === row?.GetValue('P9'))?.GetProperty('P15').IPV}</td>
                                <td>{SDICalculator(row, resultSample.find(x => x.GetValue('P9') === row?.GetValue('P9')))}</td> */}
                            </tr>:null)}
                            </tbody>
                    </Table>
                </ReportHeader>
            </CardBody>
            <CardFooter>
                {/* <SDIChart /> */}
            </CardFooter>
        </Card>
    </>);
};

export default HBVReport;
// {expResultSample.map((row) => <tr key={row.Instance.UID}>
// <td>{row?.SampleObj.GetProperty('P156')?.IPV}</td>
// <td>{resultSample.find(x => x.GetValue('P9') === row?.GetValue('P9'))?.GetProperty('P38')?.DIS}</td>
// <td>{row?.Result === 'O30E12C29I2' ? 'Positive' : 'Negative'}</td>
// {/* <td>{resultSample.find(x => x.GetValue('P9') === row?.GetValue('P9'))?.GetProperty('P15').IPV}</td>
// <td>{SDICalculator(row, resultSample.find(x => x.GetValue('P9') === row?.GetValue('P9')))}</td> */}
// </tr>)}