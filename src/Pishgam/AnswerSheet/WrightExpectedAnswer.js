import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Row, Spinner } from 'reactstrap';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import { Utility } from '../../Engine/Common';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
import { ConstIdes, PropConstIdes } from '../ConstIdes';
import TorchAnswerRow from './TorchAnswerRow';

const WrightExpectedAnswer = () => {
    const [reportBuilding, setreportBuilding] = useState(0);
    const [data, setData] = useState({});
    const [tests, setTests] = useState([]);
    const [answers, setResults] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            let temp1 = await InstanceController.GetInstancesAsync('E12C3');
            let temp2 = await InstanceController.GetInstancesAsync('E12C4');
            setTests(temp1);
            setResults(temp2)
        }
        fetch();
    }, [])
    const Sample = {
        col: "3",
        pid: PropConstIdes.Sample,
        controlType: "SearchControl",
        title: "نمونه",
        source: ConstIdes.Sample
    };

    const PropertyHandler = async (value, obj, pid) => {
        let tempData = await FromManagerDataTemplate.LoadByAsync(`#${obj.id}#expected#`);
        if (tempData) {
            let temp = JSON.parse(tempData.Json);
            temp.ID = tempData.ID;
            console.log(temp)
            setData(temp);
        }
        else {
            let newdata = { Rows: [] };
            tests.map(test => newdata.Rows.push({
                Test: { id: test.ID, display: test.DIS }
                , Diagnosis: {}
            }))
            newdata.Sample = obj;
            setData({ ...newdata });
        }

    }
    const Save = async () => {
        if (data && data.Sample) {
            let temp = new FromManagerDataTemplate();
            if (data.ID)
                temp.ID = data.ID;
            temp.ConditionValue = `#${data.Sample.id}#expected#`;
            temp.Json = JSON.stringify(data);
            await temp.SaveAsync();
        }
    }
    const BuildReport = async () => {
        setreportBuilding(1);
        let result = await InstanceController.InvokeMethod('O30E12C60', 'GetResultCount',
            `${data.Sample.id}#E12C7#PC481,PC482#0#O30E12C104#P159`);
        if (Utility.IsInstanceID(result))
            setreportBuilding(2);
    }
    const onChanged = (test, answer) => {
        data.Rows.map(row => {
            if (row.Test.id === test.ID) {
                let dig = answers.find(x => x.ID === answer);
                row.Diagnosis = { id: dig.ID, display: dig.DIS };
            }
        })
        setData({ ...data })
    }
    return (
        <Card>
            <ThemeCardHeader title={'جواب مورد انتظار wright'} />
            <CardBody>
                <Row>
                    <Col>
                        <JoiSearchBox Control={Sample}
                            TitleFree={false}
                            operator={`like N'%{#}%' AND P1='O30E23C2I7'`}
                            type={Sample.source} onChange={PropertyHandler}
                            PID={Sample.pid} placeHolder={Sample.title} />
                    </Col>
                </Row>
                <CardBody>
                    {tests.map(test => (
                        <TorchAnswerRow key={test.ID} test={test} answers={answers} value={data?.Rows?.find(x => x.Test.id === test.ID)?.Diagnosis?.id} onChanged={onChanged} />
                    ))}
                </CardBody>
            </CardBody>
            <CardFooter>
                <Button className="mr-2" outline color='primary' onClick={Save}>ذخیره </Button>
                <Button className="mr-2" outline color='success' onClick={BuildReport}>ساخت گزارش </Button>
                {reportBuilding > 0 ? (reportBuilding === 1 ? <Spinner type='grow' color='success' /> : <FontAwesomeIcon color='success' icon={faCheck} />) : null}
            </CardFooter>
        </Card>
    );
};

export default WrightExpectedAnswer;