import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row, Table } from 'reactstrap';
import { ThemeDivider } from '../EngineForms/ThemeControl';
import AdminReportHeader from './AdminReportHeader';
import ReportHeader from './ReportHeader';
import * as echarts from 'echarts';
import NoData from './NoData';
import { InstanceController } from '../Engine/InstanceController';
import { ReportHistory } from '../Engine/EngineContext';
import { FromManagerDataTemplate } from '../Engine/FormDataTemplate';
import ConditionMaker from '../Engine/ConditionMaker';
import BaseInstance from '../Engine/BaseInstance';

const StatisticalReport = ({ match, lab }) => {
    const [expectedAnswer, setExpectedAnswer] = useState();
    const [labResult, setLabResult] = useState();
    const [sample, setSample] = useState();
    const [golbalReport, setGolbalReport] = useState();
    const [labratoary, setLabratoary] = useState();
    const [domain, setDomain] = useState();
    const [noResult, setNoResult] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            if (match.params.dom) {
                let dom = await InstanceController.LoadInstanceAsync(match.params.dom);
                dom.id = dom.ID;
                dom.display = dom.DIS;
                console.log(dom)
                setDomain(dom);
            }
        }
        fetch();
    }, [match])
    useEffect(() => {
        setLabratoary(lab);
    }, [lab])
    useEffect(() => {
        LoadData();
    }, [sample])

    const getOption = (data, title, seriesTitle) => {
        var result = {
            tooltip: {
                trigger: 'item',
                formatter: '({a} <br/>{b}) : {c} ({d}%)'
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     formatter: (name) => {
            //         const item = data.find((d) => d.display === name);
            //         if (item) {
            //             const total = data.reduce((sum, current) => sum + current.QTY, 0);
            //             const percentage = ((item.QTY / total) * 100).toFixed(2);
            //             return `${name} (${percentage}%)`;
            //         }
            //         return name;
            //     },
            // },
            series: [
                {
                    name: seriesTitle,
                    type: 'pie',
                    radius: '50%',
                    label: {
                        formatter: '({b}): {c} ({d}%)',
                        show: domain.ID !== "O30E23C2I8"
                    },
                    data: data?.map(item => ({ name: item.display, value: item.QTY })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                }
            ]
        };
        let counter=0;
        if (domain.ID === "O30E23C2I8") {
            result.legend = {
                orient: 'vertical',
                left: 'left',
                formatter: (name) => {
                    const item = data.find((d) => d.display === name);
                    if (item) {
                        const total = data.reduce((sum, current) => sum + current.QTY, 0);
                        const percentage = ((item.QTY / total) * 100).toFixed(2);
                        let isRtl=true;
                        if(counter==3)
                            isRtl=false;
                        return `(${name})(${percentage}%) `;;

                    }
                    return name;
                },
            };
        }
        return result;
    };
    const PropertyHandler = (value, obj) => {
        if (value.includes('O30E23C4I'))
            setSample(obj);
        if (value.includes('O30E23C6I'))
            setLabratoary(obj);
        if (value === '') setSample(undefined);
    }
    const LoadData = async () => {
        if (sample && labratoary) {
            setNoResult(false);
            let greport = await ReportHistory.Find(`#${sample.id}#ReportCount#`);
            let exresult = await FromManagerDataTemplate.LoadByAsync(`#${sample.id}#expected#`);
            let domainValues = (new BaseInstance(domain)).GetValue('PC19');
            let condition = new ConditionMaker(domainValues.split('#')[0]);
            condition.AddCondition('P9', '=', sample.id, ' AND ').AddCondition('P8', '=', labratoary.id);
            let labresult = await condition.GetResult();
            if (labresult?.length > 0) {
                setGolbalReport(JSON.parse(greport[0].Json));
                setExpectedAnswer(JSON.parse(exresult.Json));
                setLabResult(labresult[0].Prop.find(x => x.PID === domainValues.split('#')[1]).DIS);
            }
            else {
                setNoResult(true);
            }
        }
    }
    return (<div className="overflow-auto" style={{ overflow: 'scroll' }}>
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
                        <Row className='pb-4'>
                            <Col>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Label>تشخیص مورد انتظار : </Label><br />
                                            <Label><strong>{
                                                expectedAnswer?.Diagnosis?.display
                                            }</strong></Label>
                                        </Col>
                                        <Col>
                                            <Label>تشخیص آزمایشگاه : </Label><br />
                                            <Label><strong>{labResult}</strong></Label>
                                        </Col>
                                    </Row>

                                </CardBody>
                                <ThemeDivider />
                                <CardTitle style={{ textAlign: 'center' }} >نمودار فراوانی نتایج</CardTitle>
                                <ReactEchartsCore style={{fontFamily:'IRANSansWeb',direction:'ltr'}}
                                    echarts={echarts} 
                                    option={getOption(golbalReport, 'نمودار آماری ', '')}
                                />
                            </Col>
                        </Row>
                    </ReportHeader>
                    : <NoData title={'نمونه و آزمایشگاه را انتخاب کنید'} />
                }
            </CardBody>
        </Card>
    </div>
    );
};

export default StatisticalReport;