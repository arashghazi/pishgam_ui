import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardTitle, Spinner } from 'reactstrap';
import JoiSearchBox from '../../../components/joi/JoiSearchBox';
import { Utility } from '../../../Engine/Common';
import { FromManagerDataTemplate } from '../../../Engine/FormDataTemplate';
import { InstanceController } from '../../../Engine/InstanceController';
import { ThemeCardHeader } from '../../../EngineForms/ThemeControl';
import { ConstIdes, PropConstIdes } from '../../ConstIdes';
import AbTest from './AbTest';
const AbExpectedAnswer = () => {
    const [values, setValues] = useState([]);
    const [ccValues, setccValues] = useState([]);
    const [interpretation, setInterpretation] = useState([]);
    const [data, setData] = useState({});
    const [reportBuilding, setreportBuilding] = useState(0);

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
    useEffect(() => {
        const fetch = async () => {
            let temp1 = await InstanceController.GetInstancesAsync('O30E12C82');
            let temp2 = await InstanceController.GetInstancesAsync('O30E12C83');
            let temp3 = await InstanceController.GetInstancesAsync('O30E12C130');
            setValues(temp1);setInterpretation(temp2);setccValues(temp3);
        }
        fetch();
    }, [])
    const onChange = (pid, value) => {
        let temp = { ...data };
        temp[pid] = value;
        setData(temp);
    }
    const BuildReport = async () => {
        setreportBuilding(1);
        let result1 = await InstanceController.InvokeMethod('O30E12C60', 'GetResultCount',
            `${data.Sample.id}#O30E12C84#P122#0`);
        if (Utility.IsInstanceID(result1) )
            setreportBuilding(2);
    }
    return (
        <Card>
            <ThemeCardHeader title='جواب مورد انتظار Ab Screening'></ThemeCardHeader>
            <CardBody>
                <JoiSearchBox Control={Sample}
                    TitleFree={false}
                    operator={`like N'%{#}%' AND P1='O30E23C2I17'`}
                    type={Sample.source} onChange={PropertyHandler}
                    PID={Sample.pid} placeHolder={Sample.title} />
                <AbTest values={values} Ab={interpretation} onChange={onChange} data={data} ccValues={ccValues} />
            </CardBody>
            <CardFooter>
                <Button onClick={Save} className="mr-2" color='primary' outline>ذخیره</Button>
                <Button onClick={BuildReport} className="mr-2" color='success' outline>ساخت گزارش</Button>
                {reportBuilding > 0 ? (reportBuilding === 1 ? <Spinner type='grow' color='success' /> : <FontAwesomeIcon color='success' icon={faCheck} />) : null}
            </CardFooter>
        </Card>
    );
};

export default AbExpectedAnswer;