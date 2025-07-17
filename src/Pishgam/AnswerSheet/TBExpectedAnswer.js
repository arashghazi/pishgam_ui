import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Input, Label, Row, Spinner } from 'reactstrap';
import Divider from '../../components/common/Divider';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import BaseInstance from '../../Engine/BaseInstance';
import ConditionMaker from '../../Engine/ConditionMaker';
import { FormDataTemplate, FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import { ConstIdes, PropConstIdes } from '../ConstIdes';
import { TbSample } from '../TBSample';

const HBVampleAnswer = ({ resultdoc, listDiagnosis, listLevel }) => {
    //const listsr = ['R', 'S'];
    const [v1, setV1] = useState(resultdoc.Result);
    const [v2, setV2] = useState(resultdoc.infectionLevel);
    useEffect(() => {
        setV1(resultdoc.Result);
        setV2(resultdoc.infectionLevel);

    }, [resultdoc])
    const resultChanged = ({ target }) => {
        resultdoc.Result = target.value;
        setV1(target.value);
    }
    const levelChanged = ({ target }) => {
        resultdoc.infectionLevel = target.value;
        setV2(target.value);
    }
    console.log(resultdoc.SampleObj)
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
            <Col>
                <Label>میزان عفونت</Label>
                <Input type='select' onChange={levelChanged} value={v2}  >
                    <option>انتخاب نشده</option>
                    {
                        listLevel?.map((item) => (<option key={item.ID} value={item.ID}>
                            {item.DIS}
                        </option>))
                    }
                </Input>
            </Col>
        </Row>
    );
};

const TBExpectedAnswerSheet = () => {
    const [loading, setLoading] = useState(false);
    const [samples, setSamples] = useState([]);
    const [listDiagnosis, setListDiagnosis] = useState([]);
    const [listLevel, setListLevel] = useState([]);
    const [resultSample, setResultSample] = useState([]);
    const [period, setPeriod] = useState();
    const [FMDT, setFMDT] = useState(new FormDataTemplate());
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
        });
        setResultSample(resultSMP);
    }
    const SaveDoc = async () => {
        setLoading(true);
        let temp;
        if (FMDT)
            temp = FMDT;
        else
        temp = new FromManagerDataTemplate();
        temp.ConditionValue = `#${period}#O30E23C2I15#expected#`;
        temp.Json = JSON.stringify(resultSample);
        await temp.SaveAsync();
        console.log(`#${period}#$O30E23C2I15#expected#`)
        setLoading(false);
    }
    const PropertyHandler = async (value, pid) => {
        let tempData = await FromManagerDataTemplate.LoadByAsync(`#${value}#O30E23C2I15#expected#`);

        if (tempData?.ID) {
            setFMDT(tempData);
            let rows = JSON.parse(tempData.Json);
            let result=[];
            for (let index = 0; index < rows.length; index++) {
                const element = rows[index];
                let val =new TbSample(element.Instance);
                val.Sample=new BaseInstance(val.SampleObj.Instance);
                result=[...result,val];
            }
        console.log(result)

            setResultSample(result);
        }
        else {
            let samcon = new ConditionMaker('O30E23C4');
            samcon.AddCondition('P3', '=', value, 'AND')
                .AddCondition('P1', '=', 'O30E23C2I15');

            let samresult = await samcon.GetResult();
            setPeriod(value);
            setSamples(samresult);
            SetNew(samresult);
        }
    }
    const DeleteDoc = () => { }
    return (
        <Card>
            <FalconCardHeader title="نتایج مورد انتظار ملکول عفونی TB">
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
                {loading ? null : <><Button color="primary" outline
                    onClick={SaveDoc}>ذخیره </Button>
                    <Button className='ml-1 mr-1' color='danger'
                        onClick={DeleteDoc}
                    >حذف</Button>
                </>}
            </CardFooter>
        </Card>
    );
};

export default TBExpectedAnswerSheet;


