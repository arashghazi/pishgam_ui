import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row, Table } from 'reactstrap';
import { SearchObject, Utility } from '../../Engine/Common';
import ConditionMaker from '../../Engine/ConditionMaker';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import AdminReportHeader from '../AdminReportHeader';
import { ConstIdes } from '../ConstIdes';
import NoData from '../NoData';
import ReportHeader from '../ReportHeader';
import * as echarts from 'echarts';
import { ReportHistory } from '../../Engine/EngineContext';
import { ThemeDivider } from '../../EngineForms/ThemeControl';
//import '../../custom.css'
const MorfologyReport = ({ lab }) => {
    const [sample, setSample] = useState();
    const [labratoary, setLabratoary] = useState();
    const [labResult, setLabResult] = useState();
    const [expectedAnswer, setExpectedAnswer] = useState();
    const [golbalReport, setGlobalReport] = useState();
    const [cellTypeList, setCellTypeList] = useState();
    const [noResult, setNoResult] = useState(null);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            if (sample) {
                let temp = await SearchObject('', 'O30E12C47', '<>', ' order by convert(int,PC2) ');
                if (Utility.GetInstanceSerial(sample.id) <= 109) {
                    temp = temp.filter((x) => Utility.GetInstanceSerial(x.id) < 15);
                }
                if (Utility.GetInstanceSerial(sample.id) >= 229) {
                    temp = temp.filter((x) => x.id !== 'O30E12C47I4');
                }
                setCellTypeList(temp);
            }
        }
        fetch();
    }, [sample])
    useEffect(() => {
        setLabResult(null);
        LoadTests();
    }, [labratoary])
    useEffect(() => {
        setGlobalReport(null);
        setExpectedAnswer(null);
        LoadTests();
    }, [sample])
    useEffect(() => {
        setLabratoary(lab);
    }, [lab])
    const PropertyHandler = (pid, value, obj) => {
        if (pid.includes(ConstIdes.Sample + 'I')) {
            setSample(value);
        }
        else if (pid.includes(ConstIdes.Lab + 'I')) {
            setLabratoary(value);
        }
    }
    const LoadTests = async () => {
        if (sample && labratoary && !loading) {
            setloading(true);
            let dt = await FromManagerDataTemplate.LoadByAsync(`#${sample.id}#expected#`);
            let dt1 = await ReportHistory.Find(`#${sample.id}#morphologyReport#`);
            if (dt1[0] !== undefined && dt !== undefined) {
                setGlobalReport(JSON.parse(dt1[0].Json));
                setExpectedAnswer(JSON.parse(dt.Json));
                let condition = new ConditionMaker('O30E12C54');
                condition.AddCondition('P9', '=', sample.id, 'AND').AddCondition('P8', '=', labratoary.id);
                let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition), 'P61', ['O30E12C48']);
                setLabResult(doc);
                if (doc.Header.ID === "") {
                    setNoResult(true);
                }
                else {
                    setNoResult(false);
                }
            }
            else {
                setNoResult(true);
            }
            setloading(false);
        }
    }
    const FindResultValue = (testid) => {
        let row = labResult?.RelatedInstances.find(x => x.Prop.find(y => y.PID === 'P54' && y.IPV === testid));
        if (row)
            return row.Prop.find(x => x.PID === 'P15')?.IPV ?? '';
        else
            return '';
    }
    const getOption = (data, title, seriesTitle) => {
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                top: 40,
                bottom: 20,
                left: 'left'
            },
            series: [
                {
                    name: seriesTitle,
                    type: 'pie',
                    label: {
                        show: true,
                        formatter: ' {c} ({d}%) '
                    },
                    center: ['80%', '60%'],
                    data: data?.map(item => ({ name: removeTitle(item.display), value: item.QTY })),
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
    const removeTitle = (value) => {
        value = value.replace('RBC', '');
        value = value.replace('WBC', '');
        value = value.replace('Platelet', '');
        return value;
    }
    return (<div className="overflow-auto" style={{ overflow: 'scroll' }}>
        <AdminReportHeader title={"پیش نمایش گزارش گسترش خون محیطی "}
            domainId={"O30E23C2I13"} PropertyHandler={PropertyHandler}
            LoadTests={LoadTests}
        />
        <Card style={{ minWidth: '700px' }}>
            <CardBody>
                {sample && labratoary ?
                    <ReportHeader Section="گسترش خون محیطی"
                        Labratoary={labratoary.display}
                        Sample={sample} noData={noResult}
                    >
                        <CardTitle style={{ textAlign: 'center' }}>گزارش شمارش افتراقی گلبولهای سفید در گسترش خون محیطی</CardTitle>

                        <Table dir="ltr" style={{ textAlign: 'left' }}  className="print-table table-row-divider" bordered hover striped  responsive >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cell Type</th>
                                    <th>Expected Minimum</th>
                                    <th>Expected Maximum</th>
                                    <th>Your Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cellTypeList?.map((item, index) => {
                                        return (<tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td >{item.display}</td>
                                            <td >{expectedAnswer?.items?.find(x => x.id === item.id)?.min}</td>
                                            <td>{expectedAnswer?.items?.find(x => x.id === item.id)?.max}</td>
                                            <td>{FindResultValue(item.id)}</td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </Table>
                        <ThemeDivider />

                        <CardTitle style={{ textAlign: 'center' }}>گزارش تشخیص</CardTitle>
                        <Row className='pb-4'>
                            <Col>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Label>تشخیص مورد انتظار : </Label><br />
                                            <Label><strong>{expectedAnswer?.Diagnosis?.display ?? '---'}</strong></Label>
                                        </Col>
                                        <Col>
                                            <Label>تشخیص آزمایشگاه : </Label><br />
                                            <Label><strong>{
                                                labResult?.Header?.Prop?.find(x => x.PID === 'P59')?.DIS
                                            }</strong></Label>
                                        </Col>
                                    </Row>

                                </CardBody>
                                <ThemeDivider />
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.DiagnosisObject, 'نمودار آماری تشخيص', 'تشخیص')}
                                />
                                <ThemeDivider />
                            </Col>
                        </Row>
                        <Row className='pb-4'>
                            <Col>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.WBC, 'نمودار آماری WBC', 'مرفولوژی')}
                                />
                                <ThemeDivider />
                            </Col>
                        </Row>
                        <Row className='pb-2'>
                            <Col>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.RBC, 'نمودار آماری RBC', 'مرفولوژی')}
                                />
                                <ThemeDivider />
                            </Col>
                        </Row>
                        <Row className='pb-2'>
                            <Col>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getOption(golbalReport?.Platelet, 'نمودار آماری Platelet', 'مرفولوژی')}
                                />
                                <ThemeDivider />
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

export default MorfologyReport;