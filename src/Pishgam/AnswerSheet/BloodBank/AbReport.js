import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'reactstrap';
import BaseInstance from '../../../Engine/BaseInstance';
import ConditionMaker from '../../../Engine/ConditionMaker';
import { ReportHistory } from '../../../Engine/EngineContext';
import { FromManagerDataTemplate } from '../../../Engine/FormDataTemplate';
import { InstanceController } from '../../../Engine/InstanceController';
import AdminReportHeader from '../../AdminReportHeader';
import NoData from '../../NoData';
import ReportHeader from '../../ReportHeader';
import * as echarts from 'echarts';
import AbTest from './AbTest';
const AbReport = ({ match, lab }) => {
    const [domain, setDomain] = useState();
    const [values, setValues] = useState([]);
    const [interpretation, setInterpretation] = useState([]);
    const [data, setData] = useState({});
    const [golbalReport, setGolbalReport] = useState({ Ab: [] });
    const [sample, setSample] = useState();
    const [labratoary, setLabratoary] = useState();
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        setLabratoary(lab);
    }, [lab])
    useEffect(() => {
        LoadData();
    }, [sample, labratoary])
    const getOption = (data, title, seriesTitle) => {
        return {

            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: seriesTitle,
                    type: 'pie',
                    radius: '80%',
                    label: {
                        show: true
                    },
                    data: data?.map(item => ({ name: item.display, value: item.QTY })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };
    useEffect(() => {
        const fetch = async () => {
            if (match.params.dom) {
                let dom = await InstanceController.LoadInstanceAsync(match.params.dom);
                dom.id = dom.ID;
                dom.display = dom.DIS;
                setDomain(dom);
            }
        }
        fetch();
    }, [match])
    useEffect(() => {
        const fetch = async () => {
            let temp1 = await InstanceController.GetInstancesAsync('O30E12C82');
            let temp2 = await InstanceController.GetInstancesAsync('O30E12C83');
            setValues(temp1); setInterpretation(temp2);
        }
        fetch();
    }, [])
    const PropertyHandler = (value, obj) => {
        if (value.includes('O30E23C4I'))
            setSample(obj);
        if (value.includes('O30E23C6I'))
            setLabratoary(obj);
    }

    const LoadData = async () => {
        setNoResult(false);
        if (sample && labratoary) {
            let greport1 = await ReportHistory.Find(`#${sample.id}#ReportCount#`);
            if (greport1?.length > 0) {
                let globaldata = { Ab: JSON.parse(greport1[0].Json) };
                let tempData = await FromManagerDataTemplate.LoadByAsync(`#${sample.id}#expected#`);
                let temp = JSON.parse(tempData.Json);
                temp.ID = tempData.ID;
                let condition = new ConditionMaker('O30E12C84');
                condition.AddCondition('P9', '=', sample.id, ' AND ').AddCondition('P8', '=', labratoary.id);
                let result = await condition.GetResult();
                if (result?.length > 0) {
                    let labresult = new BaseInstance(result[0]);
                    temp['AHG'] = { display: labresult.GetProperty('P109').DIS };
                    temp['Liss'] = { display: labresult.GetProperty('P110').DIS };
                    temp['Albumin'] = { display: labresult.GetProperty('P111').DIS };
                    temp['IgG'] = { display: labresult.GetProperty('P112').IPV };

                    temp['RTCell11'] = { display: labresult.GetProperty('P113').DIS };
                    temp['RTCell21'] = { display: labresult.GetProperty('P114').DIS };
                    temp['RTCell31'] = { display: labresult.GetProperty('P115').DIS };
                    temp['Alb/LISSCell11'] = { display: labresult.GetProperty('P116').DIS };
                    temp['Alb/LISSCell21'] = { display: labresult.GetProperty('P117').DIS };
                    temp['Alb/LISSCell31'] = { display: labresult.GetProperty('P118').DIS };
                    temp['AHGCell11'] = { display: labresult.GetProperty('P119').DIS };
                    temp['AHGCell21'] = { display: labresult.GetProperty('P120').DIS };
                    temp['AHGCell31'] = { display: labresult.GetProperty('P121').DIS };
                    temp['CCCell11'] = { display: labresult.GetProperty('P185').DIS };
                    temp['CCCell21'] = { display: labresult.GetProperty('P186').DIS };
                    temp['CCCell31'] = { display: labresult.GetProperty('P187').DIS };
                    if (labresult.GetProperty('P175')?.DIS)
                        temp['AHGCC2'] = { display: labresult.GetProperty('P175').DIS };

                    temp['Way'] = { display: labresult.GetProperty('P107').DIS };
                    temp['AbL'] = { display: labresult.GetProperty('P122').DIS };
                    temp['Kit'] = { display: labresult.GetProperty('P108').DIS };
                    setGolbalReport(globaldata);
                    setData(temp);
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
    return (<>
        <AdminReportHeader title={`  گزارش نهایی Ab Screening `}
            domainId={domain?.id}
            PropertyHandler={PropertyHandler}
            LoadTests={LoadData}
        />
        <Card style={{ minWidth: '700px' }}>
            <CardBody>
                {sample && labratoary ?
                    <ReportHeader Section={domain?.display}
                        Labratoary={labratoary?.display}
                        Sample={sample} noData={noResult}
                    >
                        <AbTest reportColumn values={values} Ab={interpretation} data={data} showcc={data.AHGCC2} />
                        <Row className='pt-4'>
                            <Col>
                                <CardTitle style={{ textAlign: 'center' }}>نمودار آماری Ab Screening</CardTitle>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.Ab, 'نمودار آماری Ab Screening', 'Ab Screening')}
                                />
                            </Col>
                        </Row>
                    </ReportHeader>
                    : <NoData title={'نمونه و آزمایشگاه را انتخاب کنید'} />
                }
            </CardBody>
            <CardFooter>

            </CardFooter>
        </Card>
    </>
    );
};

export default AbReport;