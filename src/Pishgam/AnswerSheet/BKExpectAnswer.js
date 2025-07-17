import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Row, Spinner } from 'reactstrap';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import { Utility } from '../../Engine/Common';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
import { ConstIdes, PropConstIdes } from '../ConstIdes';
const BKExpectAnswer = () => {
    const [reportBuilding, setreportBuilding] = useState(0);
    const [data, setData] = useState({});

    const Sample = {
        col: "3",
        pid: PropConstIdes.Sample,
        controlType: "SearchControl",
        title: "نمونه",
        source: ConstIdes.Sample
    };
    const parasite = {
        col: "3",
        pid: 'PC440',
        controlType: "SearchControl",
        title: "جواب مورد انتظار BK",
        source: 'E12C9'
    };
    const PropertyHandler = async (value, obj, pid) => {
        let tempData = await FromManagerDataTemplate.LoadByAsync(`#${obj.id}#expected#`);
        console.log(tempData, obj,value)
        if (tempData!==null) {
            let temp = JSON.parse(tempData.Json);
            temp.ID = tempData.ID;
            setData(temp);
        }
        else {
            let newdata = {};
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
        console.log(data)
        let result = await InstanceController.InvokeMethod('O30E12C60', 'GetResultCount',
        `${data.Sample.id}#O30E12C11#PC490#1`);
        if(Utility.IsInstanceID(result))
            setreportBuilding(2);
    }
    return (
        <Card>
            <ThemeCardHeader title={'جواب مورد انتظار BK'} />
            <CardBody>
                <Row>
                    <Col>
                        <JoiSearchBox Control={Sample}
                            TitleFree={false}
                            operator={`like N'%{#}%' AND P1='O30E23C2I8'`}
                            type={Sample.source} onChange={PropertyHandler}
                            PID={Sample.pid} placeHolder={Sample.title} />
                    </Col>
                    <Col>
                        <JoiSearchBox Control={parasite}
                            TitleFree={false} Instance={{ Prop: [{ IPV: data?.Diagnosis?.id, DIS: data?.Diagnosis?.display, PID: parasite.pid }] }}
                            type={parasite.source} onChange={(vale, obj) => setData({ ...data, Diagnosis: obj })}
                            PID={parasite.pid} placeHolder={parasite.title} />
                    </Col>
                </Row>

            </CardBody>
            <CardFooter>
                <Button className="mr-2" outline color='primary' onClick={Save}>ذخیره </Button>
                <Button className="mr-2" outline color='success' onClick={BuildReport}>ساخت گزارش </Button>
                {reportBuilding > 0 ? (reportBuilding === 1 ? <Spinner type='grow' color='success' /> : <FontAwesomeIcon color='success' icon={faCheck} />) : null}
            </CardFooter>
        </Card>
    );
};

export default BKExpectAnswer;