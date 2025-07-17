import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import BaseInstance from '../../Engine/BaseInstance';
import ConditionMaker from '../../Engine/ConditionMaker';
import { ReportHistory } from '../../Engine/EngineContext';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import { ThemeDivider } from '../../EngineForms/ThemeControl';
import AdminReportHeader from '../AdminReportHeader';
import NoData from '../NoData';
import ReportHeader from '../ReportHeader';
import LabResultExpected from './LabResultExpected';
import TorchReportTable from './TorchReportTable';
import * as echarts from 'echarts';
import { Utility } from '../../Engine/Common';

const ReportWithExpectedResult = ({ match, lab }) => {
    const [expectedAnswer, setExpectedAnswer] = useState();
    const [labResult, setLabResult] = useState([]);
    const [sample, setSample] = useState();
    const [golbalReport, setGolbalReport] = useState([]);
    const [labratoary, setLabratoary] = useState();
    const [domain, setDomain] = useState();
    const [domainData, setDomainData] = useState();
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        LoadData();
    }, [sample,labratoary])
    useEffect(() => {
        setLabratoary(lab);
    }, [lab])
    useEffect(() => {
        const fetch = async () => {
            if (match.params.dom) {
                let dom = await InstanceController.LoadInstanceAsync(match.params.dom);
                dom.id = dom.ID;
                dom.display = dom.DIS;
                let dds = (new BaseInstance(dom)).GetValue('PC19');
                dds = dds.split('#');
                setDomainData({ head: dds[0], testProp: dds[1], formId: dds[2], cnn: dds[3] })
                setDomain(dom);
            }
        }
        fetch();
    }, [match])
    const getOption = (data, title, seriesTitle) => {
        let header = ['1/10', '1/20', '1/40', '1/80', '1/160', '1/320', '1/640', '1/1280', '1/2560'];

        header.map(head => {
            let index = data?.findIndex(item => item.G1 === 'E12C3I1' && item.G2display.trim() === head)
            if (index < 0)
                data = [...data, { G1: 'E12C3I1', G2display: head, QTY: 0 }];
            index = data?.findIndex(item => item.G1 === 'E12C3I3' && item.G2display.trim() === head)
            if (index < 0)
                data = [...data, { G1: 'E12C3I3', G2display: head, QTY: 0 }];
            index = data?.findIndex(item => item.G1 === 'E12C3I4' && item.G2display.trim() === head)
            if (index < 0)
                data = [...data, { G1: 'E12C3I4', G2display: head, QTY: 0 }];
        })
        return {
            legend: {},
            xAxis: {
                type: 'category',
                data: header
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: data?.find(item => item.G1 === 'E12C3I1').G1display,
                    data: data?.filter(item => item.G1 === 'E12C3I1').map(item => ({ name: item.G2display.trim(), value: item.QTY }))
                        .sort((a, b) => {
                            let a1 = a.name.replace('1/', '');
                            let b1 = b.name.replace('1/', '');
                            return parseInt(a1) > parseInt(b1) ? 1 : -1;
                        }),
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                },
                {
                    name: data?.find(item => item.G1 === 'E12C3I3').G1display,
                    data: data?.filter(item => item.G1 === 'E12C3I3').map(item => ({ name: item.G2display.trim(), value: item.QTY }))
                        .sort((a, b) => {
                            let a1 = a.name.replace('1/', '');
                            let b1 = b.name.replace('1/', '');
                            return parseInt(a1) > parseInt(b1) ? 1 : -1;
                        }),
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 100, 180, 0.2)'
                    }
                },
                {
                    name: data?.find(item => item.G1 === 'E12C3I4').G1display,
                    data: data?.filter(item => item.G1 === 'E12C3I4').map(item => ({ name: item.G2display.trim(), value: item.QTY }))
                        .sort((a, b) => {
                            let a1 = a.name.replace('1/', '');
                            let b1 = b.name.replace('1/', '');
                            return parseInt(a1) > parseInt(b1) ? 1 : -1;
                        }),
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(100, 180, 180, 0.2)'
                    }
                }
            ]
        };
    };
    const PropertyHandler = (value, obj) => {
        if (value.includes('O30E23C4I'))
            setSample(obj);
        if (value.includes('O30E23C6I'))
            setLabratoary(obj);
    }
    const LoadData = async () => {
        if (sample && labratoary) {
            setNoResult(false);
            let greport = await ReportHistory.Find(`#${sample.id}#ReportCount#`);
            let exresult = await FromManagerDataTemplate.LoadByAsync(`#${sample.id}#expected#`);
            if (exresult) {
                let exresultJson = JSON.parse(exresult?.Json);
                let condition = new ConditionMaker(domainData.head);
                condition.AddCondition('P9', '=', sample.id, ' AND ').AddCondition('P8', '=', labratoary.id);
                let result = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition)
                    , domainData.cnn, [Utility.GetClassID(domainData.formId)]);
                let orderdResult = [];
                result.RelatedInstances.map(row => {
                    let insval = (new BaseInstance(row)).GetValue(domainData.testProp);
                    orderdResult = [...orderdResult, exresultJson.Rows.find(x => x.Test.id === insval)];
                });
                exresultJson.Rows = orderdResult;
                if (result.RelatedInstances?.length > 0) {
                    setGolbalReport(JSON.parse(greport[0]?.Json));
                    setExpectedAnswer(exresultJson)
                    setLabResult(result.RelatedInstances)
                }
                else {
                    setNoResult(true);
                }
            }
            else {
                setNoResult(true);
            }
        }
    }
    return (
        <>
            <AdminReportHeader title={` آماری گزارش ${domain?.display} `}
                domainId={domain?.id} PropertyHandler={PropertyHandler}
                LoadTests={LoadData}
            />
            <Card style={{ minWidth: '700px' }}>
                <CardBody>
                    {sample && labratoary ?
                        <ReportHeader Section={domain?.display}
                            Labratoary={labratoary?.display}
                            Sample={sample} noData={noResult}
                        >
                            <LabResultExpected formId={domainData?.formId} Data={[{ formId: domainData?.formId, data: labResult }]} Expresult={expectedAnswer} />
                            <ThemeDivider />
                            {domain?.id === 'O30E23C2I6' || domain?.id === 'O30E23C2I2' ? <TorchReportTable data={golbalReport} /> :
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport, 'نمودار آماری ', '')}
                                />
                            }
                        </ReportHeader>
                        : <NoData title={'نمونه و آزمایشگاه را انتخاب کنید'} />
                    }
                </CardBody>
            </Card>

        </>
    );
};

export default ReportWithExpectedResult;