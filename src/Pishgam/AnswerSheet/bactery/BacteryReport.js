import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, Spinner, Table } from 'reactstrap';
import { ReportHistory } from '../../../Engine/EngineContext';
import AdminReportHeader from '../../AdminReportHeader';
import NoData from '../../NoData';
import ReportHeader from '../../ReportHeader';
import * as echarts from 'echarts';
import ConditionMaker from '../../../Engine/ConditionMaker';
import { PropConstIdes } from '../../ConstIdes';
import { AntibioticsRow, BacteryDiagnosis, BacteryTestRow } from './BacteryContext';
import { InstanceController } from '../../../Engine/InstanceController';
import { Utility } from '../../../Engine/Common';
const BacteryTestTable = ({ Data, labresult, testList, totalAnswer }) => {
    let testlist = [];
    let total = totalAnswer;
    if (Data)
        Data.map(item => {
            let addedItem = testlist.find(x => x.id === item.test);
            if (!addedItem)
                testlist = [...testlist, { id: item.test, qty: item.QTY, display: item.testdisplay, answers: [{ id: item.answer, display: item.answerdisplay, per: item.Per, qty: item.QTY }] }]
            else {
                addedItem.answers = [...addedItem.answers, { id: item.answer, display: item.answerdisplay, per: item.Per, qty: item.QTY }]
                addedItem.qty += item.QTY;
            }
        })
    testlist.sort((a, b) => a.display.localeCompare(b.display))
    return (<>
        <CardTitle style={{ textAlign: 'center' }}>جدول شماره 1: ارزیابی تست های تشخیصی گزارش شده</CardTitle>
        <hr />
        <Table striped responsive>
            <thead>
                <tr>
                    <th>تست تشخیصی</th>
                    <th>تعداد (درصد) آزمایشگاه های استفاده کننده از تست</th>
                    <th>نتیجه مورد انتظار</th>
                    <th>پاسخ های گزارش شده</th>
                    <th>تعداد(درصد) پاسخ های گزارش شده</th>
                </tr>
            </thead>
            <tbody>
                {
                    testlist?.map((item) => {
                        let color = '';
                        let forecolor = '';
                        let result = labresult?.find(x => x.BacteryTest === item.id);
                        let expctedResult = testList?.find(x => new BacteryTestRow(x.Instance).BacteryTest === item.id);
                        if (result) {
                            color = 'lightgray'
                            forecolor = 'green'
                        }
                        return (<tr key={item.id}>
                            <td style={{ backgroundColor: color }} ><strong style={{ color: forecolor }}>{item.display}</strong></td>
                            <td>{item.qty}({((item.qty * 100) / total).toFixed(1)}%)</td>
                            <td>{new BacteryTestRow(expctedResult?.Instance)?.ResultObject?.DIS}</td>
                            <td>{item.answers.map(ans =>
                                <p style={{ backgroundColor: ans.id === result?.Result ? 'lightgray' : null, color: ans.id === result?.Result ? forecolor : null }} key={ans.id} >{ans.display}</p>
                            )}</td>
                            <td>{item.answers.map(ans =>
                                <p key={ans.id}>{ans.qty}({((ans.qty * 100) / item.qty).toFixed(1)}%)</p>
                            )}</td>
                        </tr>)
                    }
                    )
                }
            </tbody>
        </Table>
    </>);
}
const BacteryDiskTable = ({ Data, labresult, totalAnswer }) => {
    Data = Data.sort((a, b) => b.total - a.total);
    return (<>
        <CardTitle style={{ textAlign: 'center' }}>جدول شماره 2: ارزیابی پاسخ های گزارش شده در آزمایش تعیین حساسیت ضد میکروبی</CardTitle>
        <hr />
        <Table striped responsive>
            <thead>
                <tr>
                    <th colSpan={4}></th>
                    <th colSpan={4} style={{ textAlign: 'center' }}> تعداد (درصد) جواب</th>
                </tr>
                <tr>
                    <th>نام آنتی بیوتیک</th>
                    <th>تعداد(درصد) استفاده از آنتی بیوتیک</th>
                    <th>تفسیر مورد انتظار</th>
                    <th>تفسیر آزمایشگاه شما</th>
                    <th>Correct</th>
                    <th>Minor error</th>
                    <th>Major error</th>
                    <th>Very major error</th>
                </tr>
            </thead>
            <tbody>
                {
                    Data?.map((item) => {
                        let record = labresult?.find(lr => lr.AntibioticsDisk === item.id)
                        let labstate = 0;
                        if (record) {
                            if (record.AntibioticsResultInterpretation === item.ansid)
                                labstate = 1;
                            else {
                                if (((item.ansid === 'O30E12C73I1' || item.ansid === 'O30E12C73I2') && record.AntibioticsResultInterpretation === 'O30E12C73I3') ||
                                    ((record.AntibioticsResultInterpretation === 'O30E12C73I1' || record.AntibioticsResultInterpretation === 'O30E12C73I2') && item.ansid === 'O30E12C73I3'))
                                    labstate = 2;
                                else if (item.ansid === 'O30E12C73I2' && record.AntibioticsResultInterpretation === 'O30E12C73I1')
                                    labstate = 3;
                                else if (item.ansid === 'O30E12C73I1' && record.AntibioticsResultInterpretation === 'O30E12C73I2')
                                    labstate = 4;
                            }
                        }
                        return (<tr key={item.id}>
                            <td style={record ? { backgroundColor: 'lightgray' } : {}}>{record ? ' * ' : null}<strong>{item.display}</strong></td>
                            <td>{item.total}({((item.total * 100) / totalAnswer).toFixed(1)}%)</td>
                            <td>{item.ansdisplay}</td>
                            <td>{record?.AntibioticsResultInterpretationObject?.DIS ?? ''}</td>
                            {item.ansdisplay ?
                                <td style={{ color: labstate === 1 ? '#91cc75' : null }}>{item.correct}({item.correct !== 0 ? (item.correct * 100 / item.total).toFixed(0) : 0}%)</td>
                                : <td>-</td>
                            }
                            {item.ansdisplay ?
                                <td style={{ color: labstate === 2 ? '#91cc75' : null }}>{item.min}({item.min !== 0 ? (item.min * 100 / item.total).toFixed(0) : 0}%)</td>
                                : <td>-</td>
                            }
                            {item.ansdisplay ?
                                <td style={{ color: labstate === 3 ? '#91cc75' : null }}>{item.maj}({item.maj !== 0 ? (item.maj * 100 / item.total).toFixed(0) : 0}%)</td>
                                : <td>-</td>
                            }
                            {item.ansdisplay ?
                                <td style={{ color: labstate === 4 ? '#91cc75' : null }}>{item.vmaj}({item.vmaj !== 0 ? (item.vmaj * 100 / item.total).toFixed(0) : 0}%)</td>
                                : <td>-</td>
                            }
                        </tr>)
                    }
                    )
                }
            </tbody>
        </Table>
        <CardBody>
            <Row><Col><Label>
                ناحیه خاکستری (فونت سبزرنگ): گزارش آزمایشگاه شما</Label></Col></Row>
            <Row><Label><strong>Correct answer:</strong>پاسخ آزمایشگاه مطابق نتیجه مورد انتظار است</Label></Row>
            <Row><Label><strong>Minor error:</strong>هنگامی که نتیجه مورد انتظار حساس یا مقاوم بوده، اما آزمایشگاه حساسیت بینابینی گزارش کرده است، یا برعکس.</Label></Row>
            <Row><Label><strong>Major error:</strong>هنگامی که نتیجه مورد انتظار حساس بوده، اما آزمایشگاه مقاوم گزارش کرده است.</Label></Row>
            <Row><Label><strong>Very major error:</strong>هنگامی که نتیجه مورد انتظار مقاوم بوده، اما آزمایشگاه حساس گزارش کرده است.</Label></Row>
        </CardBody>
    </>);
}
const BacteryDiskChart = ({ Data, expList }) => {
    let disklist = [];
    let diskmanufacture = [];
    Data.map(item => {
        let addedItem = disklist.find(x => x.id === item.disk);
        if (!addedItem)
            disklist = [...disklist, { id: item.disk, display: item.diskdisplay }];
        let addedItemmanu = diskmanufacture.find(x => x.id === item.manufacture);
        if (!addedItemmanu)
            diskmanufacture = [...diskmanufacture, { id: item.manufacture, display: item.manufacturedisplay === '' ? 'Unselected' : item.manufacturedisplay }];

    })
    disklist.sort((a, b) => a.display.localeCompare(b.display))
    const option = () => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: disklist.map(item => item.display)
            },
            series: diskmanufacture.map(manu => {
                let resulr = disklist.map((disk) => {
                    return Data.find(item => item.disk === disk.id && item.manufacture === manu.id)?.QTY ?? 0;
                })
                return ({
                    name: manu.display,
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: resulr
                })
            })

        };
    }
    return (<>
        <CardTitle style={{ textAlign: 'center' }}>نمودار شماره 3: تعداد استفاده از آنتی بیوتیک برای آزمایش تعیین حساسیت ضدمیکروبی به تفکیک کارخانه سازنده </CardTitle>
        <hr />
        <ReactEchartsCore
            className='p-2'
            echarts={echarts}
            option={option()}
        />
    </>);
}
function AntibioticSummaryTable({ data, correctAnswerList, labResult }) {
    var summary = [];
    summary = correctAnswerList.map((item) => {
        var disk = data.filter((d) => d.disk === item.diskId);
        console.log(disk)
        var total = disk.reduce((sum, d) => sum + (d.QTY || 0), 0);
        if (disk) {
            return {
                diskLabel: disk[0].diskdisplay,
                answer: item.answerId,
                ansdisplay: item.ansdisplay,
                total: total,
                companies: disk.reduce((acc, itemd) => {
                    const existingCompany = acc.find(c => c.name === itemd.manufacturedisplay);
                    if (existingCompany) {
                        existingCompany.qty += itemd.QTY || 0;
                        existingCompany.correct = itemd.ans === item.answerId ? itemd.QTY : existingCompany.correct;
                        existingCompany.minor = (((itemd.ans === 'O30E12C73I1' || itemd.ans === 'O30E12C73I2') && item.answerId === 'O30E12C73I3') ||
                            ((item.answerId === 'O30E12C73I1' || item.answerId === 'O30E12C73I2') && itemd.ans === 'O30E12C73I3')) ? itemd.QTY : existingCompany.minor;
                        existingCompany.major = (item.answerId === 'O30E12C73I2' && itemd.ans === 'O30E12C73I1') ? itemd.QTY : existingCompany.major;
                        existingCompany.vmajor = (item.answerId === 'O30E12C73I1' && itemd.ans === 'O30E12C73I2') ? itemd.QTY : existingCompany.vmajor;
                    } else {
                        let labAnswer = labResult.find(ins => ins.GetValue('P96') === itemd.manufacture);
                        acc.push({
                            id: itemd.manufacture,
                            name: itemd.manufacturedisplay,
                            qty: itemd.QTY || 0,
                            labAnswer: labAnswer !== undefined,
                            correct: itemd.ans === item.answerId ? itemd.QTY : 0,
                            minor: (((itemd.ans === 'O30E12C73I1' || itemd.ans === 'O30E12C73I2') && item.answerId === 'O30E12C73I3') ||
                                ((item.answerId === 'O30E12C73I1' || item.answerId === 'O30E12C73I2') && itemd.ans === 'O30E12C73I3')) ? itemd.QTY : 0,
                            major: (item.answerId === 'O30E12C73I2' && itemd.ans === 'O30E12C73I1') ? itemd.QTY : 0,
                            vmajor: (item.answerId === 'O30E12C73I1' && itemd.ans === 'O30E12C73I2') ? itemd.QTY : 0
                        });
                    }
                    return acc;
                }, []),
                correct: disk.filter(d => d.ans === item.answerId).reduce((sum, d) => sum + (d.QTY || 0), 0),
                minor: disk.filter(d => ((d.ans === 'O30E12C73I1' || d.ans === 'O30E12C73I2') && item.answerId === 'O30E12C73I3') ||
                    ((item.answerId === 'O30E12C73I1' || item.answerId === 'O30E12C73I2') && d.ans === 'O30E12C73I3')).reduce((sum, d) => sum + (d.QTY || 0), 0),
                major: disk.filter(d => item.answerId === 'O30E12C73I2' && d.ans === 'O30E12C73I1').reduce((sum, d) => sum + (d.QTY || 0), 0),
                vmajor: disk.filter(d => item.answerId === 'O30E12C73I1' && d.ans === 'O30E12C73I2').reduce((sum, d) => sum + (d.QTY || 0), 0)
            };
        }
        return null;
    });

    return (
        <div className="w-full p-4" dir="rtl">
            <CardTitle style={{ textAlign: 'center' }}>جدول شماره 3- ارزیابی پاسخ های گزارش شده در آزمایش تعیین حساسیت ضد میکروبی   </CardTitle>

            <Table striped responsive>
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2">نام آنتی بیوتیک</th>
                        <th className="px-4 py-2">تفسیر مورد انتظار</th>
                        <th className="px-4 py-2">تعداد(درصد) استفاده از آنتی بیوتیک</th>
                        <th className="px-4 py-2">Correct</th>
                        <th className="px-4 py-2">Minor Error</th>
                        <th className="px-4 py-2">Major Error</th>
                        <th className="px-4 py-2">Very Major Error</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                            <td className="px-4 py-2 text-left">
                                {row.diskLabel}
                            </td>
                            <td className="px-4 py-2">
                                {row.ansdisplay}
                            </td>
                            <td className="px-4 py-2 text-left">
                                {row.companies.map((company, i) => (
                                    <div style={{ background: company.labAnswer ? 'lightGray' : '' }} key={i}>{`${company.name === '' ? 'Unselected' : company.name} (${company.qty} - ${(company.qty * 100 / row.total).toFixed(1)}%)`}</div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {row.companies.map((company, i) => (
                                    <div key={i}>{`${company.correct}`}</div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {row.companies.map((company, i) => (
                                    <div key={i}>{`${company.minor} `}</div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {row.companies.map((company, i) => (
                                    <div key={i}>{`${company.major} `}</div>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                {row.companies.map((company, i) => (
                                    <div key={i}>{`${company.vmajor} `}</div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}




const BacteryReport = ({ lab }) => {
    const domain = { id: 'O30E23C2I12', display: 'ميكروب شناسی' }
    const [sample, setSample] = useState();
    const [labratoary, setLabratoary] = useState();
    const [allData, setAllData] = useState();
    const [labResult, setLabResult] = useState();
    const [HasLabResult, setHasLabResult] = useState();
    const [loading, setLoading] = useState(false);
    const [totalAnswer, setTotalAnswer] = useState();
    const [descAnti, setDescAnti] = useState('');

    useEffect(() => {
        setLabratoary(lab);
    }, [lab])
    useEffect(() => {
        LoadData();
    }, [sample])
    const PropertyHandler = async (value, obj) => {
        if (value.includes('O30E23C4I')) {
            setSample(obj);
        }
        if (value.includes('O30E23C6I')) {
            setLabratoary(obj);
        }
    }
    const LoadData = async () => {
        setLoading(true);
        if (sample && labratoary) {
            let result = await ReportHistory.Find(`#${sample.id}#ReportCount#`);
            let tempallData = JSON.parse(result[0].Json);
            if (tempallData) {
                let da = tempallData.DiagnosisAnalysis;
                tempallData.DiagnosisAnalysis.data = [
                    { name: 'تشخیص صحیح', value: parseInt(da.Correct), itemStyle: { color: '#91cc75' }, percent: '15%' },
                    { name: 'تشخیص ناکامل', value: parseInt(da.HalfCorrect), itemStyle: { color: '#73c0de' }, percent: '15%' },
                    { name: 'تشخیص نادرست', value: parseInt(da.Error), itemStyle: { color: '#ee6666' }, percent: '15%' },
                    { name: 'تشخیص گزارش نشده', value: parseInt(da.NoAnswer), itemStyle: { color: 'gray' }, percent: '15%' },
                ]
                setTotalAnswer(parseInt(da.Correct) + parseInt(da.HalfCorrect) + parseInt(da.Error) + parseInt(da.NoAnswer));
                setAllData(tempallData)
                setDescAnti(tempallData.descAnti ?? '');

            }
            let cond = new ConditionMaker('O30E12C75');
            cond.AddCondition(PropConstIdes.Sample, '=', sample.id, 'And');
            cond.AddCondition(PropConstIdes.Lab, '=', labratoary.id);
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(cond)
                , 'P100', ['O30E12C74', 'O30E12C69', 'O30E12C67'])
            setHasLabResult(Utility.IsInstanceID(doc?.Header.ID));
            let labresult = {
                AntibioticsList: [], DiagnosisTestList: [],
                DiagnosisData: {}
            };
            if (Utility.IsInstanceID(doc?.Header.ID)) {
                doc.RelatedInstances.map((ins) => {
                    if (ins.ClassID === 'O30E12C74')
                        labresult.AntibioticsList = [...labresult.AntibioticsList, new AntibioticsRow(ins)]
                    else if (ins.ClassID === 'O30E12C69')
                        labresult.DiagnosisTestList = [...labresult.DiagnosisTestList, new BacteryTestRow(ins)]
                    else if (ins.ClassID === 'O30E12C67')
                        labresult.DiagnosisData = new BacteryDiagnosis(ins)
                })
            }
            setLabResult(labresult);
        }
        setLoading(false);
    }
    const getOption = (data, title, seriesTitle) => {
        return {

            tooltip: {
                trigger: 'item',
                formatter: '{b} : {d}%'
            },
            series: [
                {
                    name: seriesTitle,
                    type: 'pie',
                    radius: '80%',
                    label: {
                        show: true,
                        formatter: '{b}: {d}% '
                    },
                    data: data,
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
    return (
        <>
            <AdminReportHeader title={`  گزارش ميكروب شناسی `}
                domainId={domain.id}
                PropertyHandler={PropertyHandler}
                LoadTests={LoadData}
            />
            <Card style={{ minWidth: '800px' }}>
                <CardBody>
                    {!sample ? <NoData title={'نمونه  را انتخاب کنید'} /> :
                        (!loading ? (
                            HasLabResult ? <>
                                <ReportHeader Section={domain?.display}
                                    Labratoary={labratoary?.display}
                                    Sample={sample}
                                >
                                    <CardBody style={{ textAlign: 'center' }}>
                                        <p>تعداد <strong>{totalAnswer}</strong> آزمایشگاه برای نمونه<strong>{sample?.display}</strong> پاسخ ثبت کرده اند.</p>
                                    </CardBody>
                                    <Row className='m-4'>
                                        <Col>
                                            <Label><strong>تشخیص مورد انتظار:</strong></Label>
                                            <Label>{`${allData?.Diagnosis?.BacteryGender?.display} ${allData?.Diagnosis?.BacterySpices?.display}`}</Label>
                                        </Col>
                                        <Col>
                                            <Label><strong>تشخیص آزمایشگاه شما:</strong></Label>
                                            <Label
                                                style={{
                                                    color: labResult?.DiagnosisData?.BacteryGender === allData?.Diagnosis?.BacteryGender?.id &&
                                                        labResult?.DiagnosisData?.BacterySpices === allData?.Diagnosis?.BacterySpices?.id
                                                        ? 'green' : (labResult?.DiagnosisData?.BacteryGender === allData?.Diagnosis?.BacteryGender?.id ? 'orange' : 'red')
                                                }}
                                            >{`${labResult?.DiagnosisData?.BacteryGenderObj?.display ?? ''} ${labResult?.DiagnosisData?.BacterySpicesObj?.display ?? ''}`}</Label>
                                        </Col>
                                    </Row>
                                    <CardTitle style={{ textAlign: 'center' }}>نمودار شماره 1: گروه بندی گزارش آزمایشگاه ها</CardTitle>

                                    <hr />
                                    <Row>
                                        <Col xs='9' >
                                            <ReactEchartsCore
                                                className='p-2'
                                                echarts={echarts}
                                                option={getOption(allData?.DiagnosisAnalysis?.data)}
                                            />
                                        </Col>
                                        <Col xs='3' style={{ verticalAlign: 'middle' }}>
                                            <strong style={{ textAlign: 'center' }}>راهنمای گزارش</strong>
                                            <ListGroup className='p-3'>
                                                <ListGroupItemText>
                                                    گروه مربوط به گزارش آزمایشگاه شما:{labResult?.DiagnosisData?.BacteryGender === allData?.Diagnosis?.BacteryGender?.id &&
                                                        labResult?.DiagnosisData?.BacterySpices === allData?.Diagnosis?.BacterySpices?.id
                                                        ? 'تشخیص صحیح' : (labResult?.DiagnosisData?.BacteryGender === allData?.Diagnosis?.BacteryGender?.id ?
                                                            'تشخیص ناکامل' : 'تشخیص نادرست')}
                                                </ListGroupItemText>
                                                <ListGroupItemText>
                                                    تشخیص صحیح: جنس و گونه صحیح
                                                </ListGroupItemText>
                                                <ListGroupItemText>
                                                    تشخیص ناکامل: جنس صحیح و گونه نادرست یا جنس صحیح و عدم تشخیص گونه
                                                </ListGroupItemText>
                                                <ListGroupItemText>
                                                    تشخیص نادرست: جنس و گونه نادرست
                                                </ListGroupItemText>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                    <CardTitle style={{ textAlign: 'center' }}>نمودار شماره 2: ارزیابی تشخیص آزمایشگاه ها</CardTitle>

                                    <hr />
                                    <Row className='mt-3'>
                                        <Col>
                                            <ReactEchartsCore
                                                className='p-2'
                                                echarts={echarts}
                                                option={getOption(allData?.DiagnosisStatistics?.FinalList
                                                    .map(item => ({ name: (`${item.genderdisplay ?? item.display} ${item.speciesdisplay ?? ''}`), value: item.QTY }))
                                                    , 'گروه بندی تشخیص آزمایشگاه ها')}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <strong>توجه :تشخیص هایی که سهم هر یک کمتر از ۲ % کل گزارش بوده، در گروه Others آورده شده اند. گروه Others در این دوره
                                                شامل موارد زیر می باشد:</strong>
                                            <div className='mt-3' style={{ direction: 'ltr' }}>
                                                <p style={{ textJustify: 'inter-word', textAlign: 'justify', fontStyle: 'italic' }}>{allData?.DiagnosisStatistics.OthersList}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-3' style={{ pageBreakInside: 'avoid' }} >
                                        <Col>
                                            <Label>ناحیه خاکستری (فونت سبز رنگ): گزارش آزمایشگاه شما</Label>
                                            <BacteryTestTable Data={allData?.TestStatistics?.FinalList} labresult={labResult?.DiagnosisTestList}
                                                totalAnswer={totalAnswer} testList={allData?.TestList} />
                                        </Col>
                                    </Row>
                                    {allData?.DiskStatistics ?
                                        <Row className='mt-3' style={{ pageBreakInside: 'avoid' }} >
                                            <Col>
                                                <BacteryDiskTable Data={allData?.DiskStatistics} labresult={labResult?.AntibioticsList} totalAnswer={totalAnswer} />
                                                <div className="mb-2">
                                                    <Label className="form-label d-block " >
                                                        {descAnti}
                                                    </Label>
                                                </div>
                                            </Col>
                                        </Row> : null}
                                    {allData?.DiskManufactureStatistics?.FinalList ?
                                        <Row className='mt-3'>
                                            <Col>
                                                <BacteryDiskChart Data={allData?.DiskManufactureStatistics.FinalList} />
                                            </Col>
                                        </Row> : null}
                                    {allData?.DiskManufactureByAns?.FinalList ?
                                        <Row className='mt-3'>
                                            <Col>
                                                <AntibioticSummaryTable
                                                    labResult={labResult?.AntibioticsList}
                                                    data={allData?.DiskManufactureByAns.FinalList}
                                                    correctAnswerList={allData?.DiskStatistics.filter(x => x.correct > 0).map(item => ({
                                                        diskId: item.id,
                                                        answerId: item.ansid,
                                                        ansdisplay: item.ansdisplay
                                                    }))}
                                                />
                                            </Col>
                                        </Row> : null}
                                </ReportHeader>
                            </> : <div style={{ textAlign: 'center' }} ><h5>پاسخنامه ای یافت نشد</h5></div>
                        ) : <div style={{ textAlign: 'center' }} ><Spinner /></div>)}
                </CardBody>
            </Card>
        </>
    );
};

export default BacteryReport;