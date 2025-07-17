import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import ReportHeader from './ReportHeader';
import * as echarts from 'echarts';
import FalconCardHeader from '../components/common/FalconCardHeader';
import { InstanceController } from '../Engine/InstanceController';
import { ReportHistory } from '../Engine/EngineContext';
import NoData from './NoData';
import TreeData from '../Forms/Reports/TreeData';
import { useParams } from 'react-router-dom';
import { GetLocalLink, Utility } from '../Engine/Common';
import { AuthenticationController } from '../Engine/Authentication';
import Flex from '../components/common/Flex';
const MOMChart = ({ Data }) => {
    let levels = ['<1', '[1-2)', '[2-3)', '>3'];
    Data.map(item => {
        let tempLevels = [];
        levels.map((lvl, index) => {
            let row = item.levels.find(x => x.level === (index + 1))
            if (!row)
                row = { level: (index + 1), QTY: 0 };
            tempLevels = [...tempLevels, row]
        })
        item.levels = tempLevels;
    })
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
            name:'تعداد / نرم افزار',
            type: 'value', nameLocation: 'middle', 
        },
        yAxis: {
            name:'MOM',
            type: 'category',
            data: levels
        },
        series: Data.map((manu) => {
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
                data: manu.levels.map(item => item.QTY)
            })
        })

    };
    return (<>
        <CardTitle style={{ textAlign: 'center' }}>گزارش براساس مقادیر MOM و نرم افزار مورد استفاده</CardTitle>
        <hr />
        <ReactEchartsCore
            className='m-2 p-2'
            echarts={echarts}
            option={option}
        />
    </>);
}
const AnalyticsReport = () => {
    const [section, setSection] = useState();
    const params = useParams();
    const colors = ['#2c7be5', '#a496de', '#ffc19c','#ccc'];
    const [labratoary, setLabratoary] = useState();
    const [sample, setSample] = useState();
    const [test, setTest] = useState();
    const [mainData, setMainData] = useState();
    const [MOMData, setMOMData] = useState();
    const [labResult, setLabResult] = useState();
    const [historlist, sethistoList] = useState([]);
    const [xAxis, setxAxis] = useState([]);
    const [hasHeader, setHasHeader] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            if (!Utility.IsInstanceID(params.dom)) {
                let settings = GetLocalLink(params.dom);
                if (settings) {
                    setSection(settings.domain);
                    setSample(settings.sample);
                    setTest(settings.test);
                    setLabratoary(settings.labratoary);
                    await Changedtest(settings.test, settings.sample);
                }
            }
            else {
                if (AuthenticationController.HasRole('R2')) {
                    setHasHeader(true);
                    let temp = await InstanceController.GetDisplay(params.dom);
                    setSection(temp);
                }
            }
        }

        if (params.dom && !section) {
            fetch();
        }
    }, [test, sample])
    useEffect(() => {
        const fetch = async () => {
            await LabChanged();
        }
        fetch();
    }, [mainData])
    const Controls = [{
        col: "3",
        pid: PropConstIdes.Lab,
        controlType: "SearchControl",
        title: "آزمایشگاه",
        source: ConstIdes.Lab
    }, {
        col: "3",
        pid: PropConstIdes.Sample,
        controlType: "SearchControl",
        title: "نمونه",
        source: ConstIdes.Sample
    }, {
        col: "3",
        pid: PropConstIdes.BioTest,
        controlType: "SearchControl",
        title: "آزمایش",
        source: ConstIdes.BioTest
    }];

    const LabChanged = async (value) => {
        if (value)
            setLabratoary(value);
        else
            value = labratoary;
        if (value && test && sample) {
            let result = await ReportHistory.Find(`#${value.id}#${test.id}#`);
            if (result?.length > 0) {
                let labres = JSON.parse(result[0].Json);
                for (let i = 0; i < labres.length; i++) {
                    const element = labres[i];
                    element.smpName = (await InstanceController.GetDisplay(element.smp)).display;

                }
                setLabResult(labres)
                let thisresult = labres.find(x => x.smp === sample.id);
                let data = dataFormTree(mainData, thisresult.G1);
                data = checkValue(data);
                let histogramlist = data ? [data.Values] : [];
                //let histogramlist = data?.list ? [data.list] : ( data ? [data.Values] : []);
                if (data?.children && thisresult.G2) {
                    data = dataFormTree(data.children, thisresult.G2);

                    if (data)
                        histogramlist = [...histogramlist, data.Values];
                }
                if (data?.children && thisresult.G3) {
                    data = dataFormTree(data.children, thisresult.G3);
                    if (data)
                        histogramlist = [...histogramlist, data.Values];
                }
                let xaxis = [];

                histogramlist.map((histogram) => {
                    histogram.map((item) => xaxis = [...xaxis, item.leveldis]);
                })
                xaxis = xaxis.sort((a, b) => a - b);
                let levelCount = histogramlist[0]?.length > 33 ? 33 : histogramlist[0]?.length + 1;
                let levelHight = (xaxis[xaxis.length - 1] - xaxis[0]) / levelCount;
                if (levelHight === 0) levelHight = 1;
                let xaxis2 = [];
                for (let index = 0; index < levelCount + 1; index++) {
                    xaxis2 = [...xaxis2, (xaxis[0] + (index * levelHight)).toFixed(2)]
                }
                setxAxis(xaxis2);
                sethistoList(histogramlist)

            }
        }
    }
    const checkValue=(data)=>{
        if(data?.list){
            data.Values=data.list;
            for (let index = 0; index < data?.children?.length; index++) {
                const element = data.children[index];
                checkValue(element);
            }
        }
        return data;
    }
    const dataFormTree = (list, group) => {
        return list.find(x => x.id === group);

    }
    const Changedsample = async (value) => {
        setSample(value);
        if (value && test) {
            let result = await ReportHistory.Find(`#${value.id}#${test.id}#group#`);
            console.log(JSON.parse(result[0].Json))
            if (result?.length > 0) {
                setMainData(JSON.parse(result[0].Json))
            }
            let result1 = await ReportHistory.Find(`#${value.id}#${test.id}#MOM#group#`);
            if (result1?.length > 0) {
                setMOMData(JSON.parse(result1[0].Json))
            }
        }
    }
    const Changedtest = async (value, samplevalue) => {
        if (value)
            setTest(value);
        else
            value = test;
        if (!samplevalue)
            samplevalue = sample;

        if (samplevalue && value) {
            let result = await ReportHistory.Find(`#${samplevalue.id}#${value.id}#group#`);
            if (result?.length > 0) {
                setMainData(JSON.parse(result[0].Json))
            }
            let result1 = await ReportHistory.Find(`#${samplevalue.id}#${value.id}#MOM#group#`);
            if (result1?.length > 0) {
                setMOMData(JSON.parse(result1[0].Json))
            }
        }
    }
    const getOption = (data, colors) => {
        let headers = ['نحوه انجام آزمایش', 'روش انجام آزمایش', 'سازنده کیت'];
        if (test.id === 'O30E12C5I1')
            headers = ['نحوه انجام آزمایش', 'ISI', 'سازنده کیت'];
        if (test.id === 'O30E12C5I2')
            headers = ['نحوه انجام آزمایش', ' کیت'];
        if (test.id.includes('O30E12C23I'))
            headers = ['CellCounter'];
        let labPoint = labResult?.find(x => x.smp === sample.id)?.ans;
        let series = data.map((value, index) => {
            let data1 = [];
            let xindex = -1;
            let yindex = 0;
            xAxis.map((x, xAxisindex) => {
                let list = value.filter(item => xAxis.length > (xAxisindex + 1) && item.leveldis >= x && item.leveldis < xAxis[xAxisindex + 1]);

                let val = 0;
                for (let Lindex = 0; Lindex < list?.length; Lindex++) {
                    const element = list[Lindex];
                    val += element.QTY;
                }
                data1 = [...data1, val];
                if (xAxis.length > (xAxisindex + 1) && parseFloat(labPoint) >= x && parseFloat(labPoint) < xAxis[xAxisindex + 1]) {
                    xindex = x;
                    yindex = val;
                }
            });
//console.log(data1,data,labResult,xAxis)
            return {
                name: headers[index],
                type: 'bar',
                color: colors[index],
                data: data1,
                markPoint: data.length === index + 1 && xindex > -1 ? {
                    data: [
                        {
                            name: 'نتيجه شما', value: labPoint,
                            xAxis: xindex,
                            yAxis: yindex
                        }
                    ]
                } : {},
            }
        });
        return {
            title: {
                text: 'توزیع فراوانی نتایج',
                subtext: 'هم گروه',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'left',
                left: 15,
                data: headers
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: { show: true, type: ['line', 'bar'], title: ['بارچارت', 'خطی'] },
                    saveAsImage: { show: true, title: 'دانلود نمودار' }
                }
            },
            xAxis: [
                {
                    name: 'محدوده نتايج',
                    nameLocation: 'middle', nameGap: 58,
                    type: 'category',
                    data: xAxis,
                    axisLabel: { interval: 0, rotate: 30 }
                }
            ],
            yAxis: [
                {
                    name: 'تعداد شركت كنندگان', nameLocation: 'middle', nameGap: 30,
                    type: 'value'
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: series

        };
    };
    const getOptionSD10 = (data, colors) => {
        let sdata = [];
        let flag = false;
        if (data) {
            let a =data.map((item) => {
                if (!flag){
                    sdata = [...sdata, item];
                }
                if (item.smp === sample.id) {
                    flag = true;
                }
                return sdata;
            });
        }
        return (
            {
                title: {
                    text: 'پایش SDI دوره ها'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    name: 'شماره نمونه',

                    axisLabel: {
                        interval: 0, rotate: 30
                    },
                    data: sdata?.map(function (d) {
                        return d.smpName
                    })
                },
                yAxis: {
                    name: 'SDI',
                    type: 'value',
                    min: -3,
                    max: 3,
                },
                series: [
                    {
                        name: 'Highest',
                        type: 'scatter',
                        color: colors[0],
                        data: sdata.map(function (d) {
                            return d.sdi
                        }),
                    }
                ],

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            });
    };
    const getOptionDEV10 = (data, colors) => {
        let sdata = [];
        let flag = false;
        if (data) {
            let a =data.map((item) => {
                if (!flag){
                    sdata = [...sdata, item];
                }
                if (item.smp === sample.id) {
                    flag = true;
                }
                return sdata;
            });
        }
        let resultAvrage = [];
        let header=[];
        let Values=[];
        for (let index = 1; index < sdata.length; index++) {
            const element1 = sdata[index-1].dev;
            const element2 = sdata[index].dev;
            resultAvrage=[...resultAvrage,undefined,((element1+element2)/2)?.toFixed(2)];
            header=[...header,sdata[index-1].smpName,''];
            Values=[...Values,sdata[index-1].dev?.toFixed(2),undefined];
        }
        if(sdata?.length > 0){
            header=[...header,sdata[sdata.length-1].smpName];
            Values=[...Values,sdata[sdata.length-1].dev?.toFixed(2)];
        }
        return (
            {
                title: {
                    text: 'پایش Dev% دوره ها'
                },
                tooltip: {
                    trigger: 'item'
                },
                xAxis:[{
                    type: 'category',
                    name: 'شماره نمونه',
                    axisLabel: {
                        interval: 0, rotate: 30
                    },
                    data: header,
                }],axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                      backgroundColor: '#777'
                    }
                  },
                yAxis: {
                    type: 'value',
                    name: 'دامنه انحراف',
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    min: -30,
                    max: 30,
                },
                series: [
                    {
                        type: 'scatter',
                        data: Values,
                        color: colors[1],
                    },
                    {
                        type: 'scatter',
                        data: resultAvrage,
                        color: colors[3],
                    }
                ],

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            });
    };
console.log(labResult)
    let SDI = parseFloat(labResult?.find(x => x.smp === sample.id)?.sdi).toFixed(2);
    let DEV = parseFloat(labResult?.find(x => x.smp === sample.id)?.dev).toFixed(2);
    if (SDI > 5 || SDI < -5) {
        SDI = 'OOR';
        DEV = 'OOR';
    }

    return (
        <div>
            {hasHeader ?

                <Card className='mb-2'>
                    <FalconCardHeader title={'آنالیز ارزیابی خارجی کیفیت ' + section?.display}>
                    </FalconCardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <JoiSearchBox Control={Controls[1]}
                                    TitleFree={false}
                                    type={Controls[1].source} onChange={async (a, value) => { await Changedsample(value); }}
                                    PID={Controls[1].pid} placeHolder={Controls[1].title} />
                            </Col>
                            <Col>
                                <JoiSearchBox Control={Controls[2]}
                                    TitleFree={false}
                                    type={Controls[2].source} onChange={async (a, value) => { await Changedtest(value); }}
                                    PID={Controls[2].pid} placeHolder={Controls[2].title} />
                            </Col>
                            <Col>
                                <JoiSearchBox Control={Controls[0]}
                                    TitleFree={false}
                                    type={Controls[0].source} onChange={async (a, value) => { await LabChanged(value); }}
                                    PID={Controls[0].pid} placeHolder={Controls[0].title} />

                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                : null}
            <Card className='mb-2 d-print-none'>
                <CardBody>
                    <Flex justify='end' >
                        <Button color={'primary'} style={{ width: '100px' }} onClick={() => window.print()}>چاپ</Button>
                    </Flex>
                </CardBody>
            </Card>
            <Card>{!mainData ? <NoData title='این نمونه یا آزمایش پردازش نشده است' /> :
                <CardBody>
                    <ReportHeader Labratoary={labratoary?.display} Sample={sample} Section={section.display} >
                        <CardBody>
                            <Row style={{ textAlign: 'left', direction: 'ltr' }}>
                                <Col>
                                    <Label style={{ fontWeight: 'bold' }}>Test:&nbsp;</Label>
                                    <Label><h5>{test.display}</h5></Label>&nbsp;
                                    <Label >({test?.Unit?.DIS})</Label>

                                </Col>
                                <Col>
                                    <Label style={{ fontWeight: 'bold' }}>Your Result:&nbsp;</Label>
                                    <Label><h5>{labResult?.find(x => x.smp === sample.id)?.ans}</h5></Label>
                                </Col>
                                <Col>
                                    <Label style={{ fontWeight: 'bold' }}>
                                        <p>SDI:&nbsp;</p>
                                    </Label>
                                    <Label><h5>{SDI}</h5></Label>
                                </Col>
                                <Col >
                                    <Label style={{ fontWeight: 'bold' }}>
                                        <p>DEV%:&nbsp;</p>
                                    </Label>
                                    <Label><h5>{DEV}</h5></Label>
                                </Col>
                                 {/* <Col >
                                    <Label style={{ fontWeight: 'bold' }}>
                                        <p>UM:&nbsp;</p>
                                    </Label>
                                    <Label><h5>{UM}</h5></Label>
                                </Col> */}
                            </Row>
                            <ReactEchartsCore
                                className='p-2'
                                echarts={echarts}
                                option={getOption(historlist, colors)}
                            />

                            <Row className='mt-5'>
                                <Col>
                                    <ReactEchartsCore
                                        className='p-2'
                                        echarts={echarts}
                                        option={getOptionSD10(labResult, colors)}

                                    />
                                    <ReactEchartsCore
                                        className='p-2'
                                        echarts={echarts}
                                        option={getOptionDEV10(labResult, colors)}

                                    />
                                </Col>
                                <Col>

                                    <TreeData chartType='group' Test={test} Data={mainData} labResult={labResult?.find(x => x.smp === sample.id)} />
                                </Col>
                            </Row>
                            <Row>
                                {MOMData ? <Col className='m-3'><MOMChart Data={MOMData} /></Col> : null}
                            </Row>
                        </CardBody>
                    </ReportHeader>
                </CardBody>}
            </Card>

        </div>
    );
};

export default AnalyticsReport;