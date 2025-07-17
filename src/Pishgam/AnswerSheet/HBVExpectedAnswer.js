import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Input, Label, Row, Spinner } from 'reactstrap';
import Divider from '../../components/common/Divider';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import BaseInstance from '../../Engine/BaseInstance';
import ConditionMaker from '../../Engine/ConditionMaker';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import { ConstIdes, PropConstIdes } from '../ConstIdes';
import { TbSample } from '../TBSample';

const HBVampleAnswer = ({ resultdoc, listDiagnosis, listLevel }) => {
    //const listsr = ['R', 'S'];
    const [v1, setV1] = useState(resultdoc.Result);
    useEffect(() => {
        setV1(resultdoc.Result);

    }, [resultdoc])
    const resultChanged = ({ target }) => {
        resultdoc.Result = target.value;
        setV1(target.value);
    }
    return (
        <Row>
            <Col>
                <Label>نمونه</Label>
                <Input type='text' readOnly value={resultdoc.SampleObj?.GetValue('P156')} />
            </Col>
            <Col>
                <Label>نتیجه</Label>
                <Input type='select' onChange={resultChanged} value={v1}>
                    <option>انتخاب نشده</option>
                    {
                        listDiagnosis?.map((item) => (<option key={item.ID} value={item.ID}>
                            {item.DIS}
                        </option>))
                    }
                </Input>
            </Col>
            {resultdoc.SDA ?<> <Col>
            <Label>SD Acceptable</Label>
            <Input value={resultdoc.SDA} readOnly></Input></Col> 
            
            </>: null}
        </Row>
    );
};

const HBVExpectedAnswerSheet = () => {
    const [loading, setLoading] = useState(false);
    //const [samples, setSamples] = useState([]);
    const [listDiagnosis, setListDiagnosis] = useState([]);
    const [listLevel, setListLevel] = useState([]);
    const [resultSample, setResultSample] = useState([]);
    const [period, setPeriod] = useState();
    const [FMDT, setFMDT] = useState();
    const Sample = {
        col: "3",
        pid: PropConstIdes.Period,
        controlType: "SearchControl",
        title: "دوره",
        source: ConstIdes.Period
    };
    useEffect(() => {
        const fetch = async () => {
            let result = await InstanceController.GetInstancesAsync('O30E12C29');
            let level = await InstanceController.GetInstancesAsync('O30E12C123');
            setListDiagnosis(result);
            setListLevel(level.sort((a, b) => a.ID.localeCompare(b.ID)));
        };
        fetch();
    }, [])
    const SetNew = (samresult) => {
        let resultSMP = [];
        samresult.map(smp => {
            let temp = new TbSample();
            temp.Sample = new BaseInstance(smp);
            resultSMP = [...resultSMP, temp];
            return smp;
        });
        setResultSample(resultSMP);
    }
    const SaveDoc = async () => {
        setLoading(true);
        let temp;
        if (FMDT) {
            temp = FMDT;
        }
        else {
            temp = new FromManagerDataTemplate();
        }
        temp.ConditionValue = `#${period}#O30E23C2I16#expected#`;
        temp.Json = JSON.stringify(resultSample);
        await temp.SaveAsync();
        setFMDT(temp);
        setLoading(false);
    }
    const PropertyHandler = async (value, pid) => {
        setPeriod(value);

        let tempData = await FromManagerDataTemplate.LoadByAsync(`#${value}#O30E23C2I16#expected#`);

        if (tempData?.ID) {

            setFMDT(tempData);
            let rows = JSON.parse(tempData.Json);
            let result = [];
            for (let index = 0; index < rows.length; index++) {
                const element = rows[index];
                let val = new TbSample(element.Instance);
                val.Sample = new BaseInstance(val.SampleObj.Instance);
                result = [...result, val];
            }
            setResultSample(result);
        }
        else {
            let samcon = new ConditionMaker('O30E23C4');
            samcon.AddCondition('P3', '=', value, 'AND')
                .AddCondition('P1', '=', 'O30E23C2I16');

            let samresult = await samcon.GetResult();
            //setSamples(samresult);
            SetNew(samresult);
        }
    }
    const DeleteDoc = async () => {
        await FMDT.DeleteAsync();
    }
    const BuildReport = async () => {
        setLoading(true)
        var allsample = await resultSample[0].CalculateSDI(period);
        for (let index = 0; index < allsample.length; index++) {
            const sampleResult = allsample[index];
            if (sampleResult.result && sampleResult.result!=='0') {
                var templist =resultSample.find(x => x.Sample === sampleResult.sample);
                if(templist?.List)
                templist.List = [...templist.List,(parseFloat(sampleResult.result))];
            }
        }
        let positiveResults = resultSample.filter(x => x.Result === 'O30E12C29I2');
        try {
            for (let index = 0; index < positiveResults.length; index++) {
                const positiveResult = positiveResults[index];
                positiveResult.List2 = positiveResult.List.map((item)=>Math.log10(item));
                if(positiveResult.List2?.length>0)
                positiveResult.sda = (positiveResult.List2.reduce((a, b) => a + b) / positiveResult.List2.length).toFixed(2);
                positiveResult.SDA =positiveResult.sda;
            }
        } catch (error) {
            console.log(error)
        }
        // for (let index = 0; index < resultSample.length; index++) {
        //     await resultSample[index].SaveAsync();
        // }
        setResultSample([...resultSample]);
        setLoading(false);
    }
    
    return (
        <Card>
            <FalconCardHeader title="نتایج مورد انتظار ملکول عفونی HBV">
                {loading ? <Spinner color='primary' /> : null}
            </FalconCardHeader>
            <Row>
                <CardBody>
                    <JoiSearchBox Control={Sample}
                        TitleFree={false}
                        operator={`like N'%{#}%'`}
                        type={Sample.source} onChange={PropertyHandler}
                        PID={Sample.pid} placeHolder={Sample.title} />
                </CardBody>
            </Row>
            <CardBody>
                <Divider >نمونه ها</Divider>
                {
                    resultSample?.map((resultsmp) => <HBVampleAnswer key={resultsmp.Sample} resultdoc={resultsmp}
                        listLevel={listLevel}
                        listDiagnosis={listDiagnosis} />)
                }
            </CardBody>
            <CardFooter>
                {loading ? <Spinner/> : <>
                    <Button color="primary" outline onClick={SaveDoc}>ذخیره </Button>
                    <Button onClick={BuildReport} className="mr-2 ml-2" color='success' outline>ساخت گزارش</Button>
                    <Button color='danger' onClick={DeleteDoc}>حذف</Button>
                </>}
            </CardFooter>
        </Card>
    );
};

export default HBVExpectedAnswerSheet;


