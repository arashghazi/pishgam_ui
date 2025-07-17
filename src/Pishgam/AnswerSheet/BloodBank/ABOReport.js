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
import ABOTests from './ABOTests';
import * as echarts from 'echarts';

const ABOReport = ({ match, lab }) => {
    const [domain, setDomain] = useState();
    const [values, setValues] = useState([]);
    const [RH, setRH] = useState([]);
    const [ABO, setABO] = useState([]);
    const [data, setData] = useState({});
    const [golbalReport, setGolbalReport] = useState({ ABO: [], RH: [] });
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
            let temp2 = await InstanceController.GetInstancesAsync('O30E12C89');
            let temp3 = await InstanceController.GetInstancesAsync('O30E12C90');
            setValues(temp1); setRH(temp3); setABO(temp2);
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
        setNoResult(false)
        if (sample && labratoary) {
            let greport1 = await ReportHistory.Find(`#${sample.id}#O30E12C89#ReportCount#`);
            let greport2 = await ReportHistory.Find(`#${sample.id}#O30E12C90#ReportCount#`);
            if (greport1?.length>0 && greport2?.length>0) {
                let globaldata = { ABO: JSON.parse(greport1[0].Json), RH: JSON.parse(greport2[0].Json) };
                let tempData = await FromManagerDataTemplate.LoadByAsync(`#${sample.id}#expected#`);
                let temp = JSON.parse(tempData.Json);
                temp.ID = tempData.ID;
                let condition = new ConditionMaker('O30E12C91');
                condition.AddCondition('P9', '=', sample.id, ' AND ').AddCondition('P8', '=', labratoary.id);
                let result = await condition.GetResult();
                console.log(result)
                if (result) {
                    let labresult = new BaseInstance(result[0]);
                    temp['Anti-A3'] = { display: labresult.GetProperty('P125').DIS };
                    temp['Anti-B3'] = { display: labresult.GetProperty('P126').DIS };
                    temp['Anti-D3'] = { display: labresult.GetProperty('P127').DIS };
                    temp['RH-control3'] = { display: labresult.GetProperty('P128').DIS };
                    temp['A1-cells3'] = { display: labresult.GetProperty('P129').DIS };
                    temp['B-cells3'] = { display: labresult.GetProperty('P130').DIS };

                    temp['Anti-A1'] = { display: labresult.GetProperty('P133').DIS };
                    temp['Anti-B1'] = { display: labresult.GetProperty('P134').DIS };
                    temp['Anti-D1'] = { display: labresult.GetProperty('P138').DIS };
                    temp['RH-control1'] = { display: labresult.GetProperty('P139').DIS };
                    temp['A1-cells1'] = { display: labresult.GetProperty('P135').DIS };
                    temp['B-cells1'] = { display: labresult.GetProperty('P136').DIS };

                    temp['ABOL'] = { display: labresult.GetProperty('P137').DIS };
                    temp['RHL'] = { display: labresult.GetProperty('P140').DIS };

                    temp['Way'] = { display: labresult.GetProperty('P124').DIS };
                    temp['Type'] = { display: labresult.GetProperty('P132').DIS };
                    setGolbalReport(globaldata);
                    setData(temp);
                }
                else {
                    setNoResult(true);
                }
            }else {
                setNoResult(true);
            }
        }
    }
    return (<>
        <AdminReportHeader title={`  گزارش نهایی ABO `}
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
                        <ABOTests reportColumn values={values} RH={RH} ABO={ABO} data={data} />
                        <Row className='pt-4'>
                            <Col>
                                <CardTitle style={{ textAlign: 'center' }}>نمودار آماری تفيسر ABO</CardTitle>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.ABO, 'نمودار آماری ABO', 'ABO')}
                                />
                            </Col>
                            <Col>
                                <CardTitle style={{ textAlign: 'center' }}>نمودار آماری تفسير RH(D)</CardTitle>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.RH, 'نمودار آماری RH', 'RH')}
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

export default ABOReport;