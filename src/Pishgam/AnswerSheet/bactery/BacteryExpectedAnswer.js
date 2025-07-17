import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Col, Input, Label, Row, Spinner } from "reactstrap";
import Divider from "../../../components/common/Divider";
import FalconCardHeader from "../../../components/common/FalconCardHeader";
import JoiSearchBox from "../../../components/joi/JoiSearchBox";
import { Utility } from "../../../Engine/Common";
import { FromManagerDataTemplate } from "../../../Engine/FormDataTemplate";
import { InstanceController } from "../../../Engine/InstanceController";
import { ConstIdes, PropConstIdes } from "../../ConstIdes";
import Antibiotics from "./Antibiotics";
import { AntibioticsRow, BacteryDiagnosis, BacteryTestRow } from "./BacteryContext";
import Diagnosis from "./Diagnosis";
import DiagnosisTest from "./DiagnosisTest";
const BacteryExpectedAnswer = () => {
    const Sample = {
        col: "3",
        pid: PropConstIdes.Sample,
        controlType: "SearchControl",
        title: "نمونه",
        source: ConstIdes.Sample
    };
    const [data, setData] = useState({});
    const [DiagnosisData, setDiagnosisData] = useState(new BacteryDiagnosis());
    const [DiagnosisTestList, setDiagnosisTestList] = useState([]);
    const [reportBuilding, setreportBuilding] = useState(0);
    const [AntibioticsList, setAntibioticsList] = useState([]);
    const [selected, setSelected] = useState('labselect');
    const [descAnti, setDescAnti]=useState('');
    const PropertyHandler = async (objValue, obj) => {
        let tempData = await FromManagerDataTemplate.LoadByAsync(`#${obj.id}#expected#`);
        if (tempData) {
            let temp = JSON.parse(tempData.Json);

            temp.ID = tempData.ID;
            temp.Sample = obj;
            setSelected(temp.ReportType??'labselect');
            setDescAnti(temp.descAnti??'');
            setDiagnosisData(new BacteryDiagnosis(temp.DiagnosisData.Instance));
            setDiagnosisTestList(temp?.DiagnosisTestList.map(item => new BacteryTestRow(item.Instance)));
            setAntibioticsList(temp?.AntibioticsList.map(item => new AntibioticsRow(item.Instance)));
            setData(temp);
        }
        else {
            let newdata = {};
            newdata.Sample = obj;
            setData({ ...newdata });
        }
    }
    const DiagnosisChanged = (instance) => {
        setDiagnosisData(instance)
    }
    const DiagnosisTestChanged = (data) => {
        setDiagnosisTestList(data)
    }
    const AntibioticsChanged = (data) => {
        setAntibioticsList(data);
    }
    const SaveDoc = async () => {
        if (data && data.Sample) {
            let maindata = { DiagnosisData, DiagnosisTestList, AntibioticsList, ReportType: selected,descAnti:descAnti }
            let temp = new FromManagerDataTemplate();
            if (data.ID)
                temp.ID = data.ID;
            temp.ConditionValue = `#${data.Sample.id}#expected#`;
            temp.Json = JSON.stringify(maindata);
            await temp.SaveAsync();
        }
    }
    const BuildReport = async () => {
        setreportBuilding(1);
        let result1 = await InstanceController.InvokeMethod('O30E12C60', 'BacteryReport',
            `${data.Sample.id}`);

        if (Utility.IsInstanceID(result1))
            setreportBuilding(2);
    }
    return (
        <Card>
            <FalconCardHeader title="فرم ثبت نتیجه مورد انتظار میکروب شناسی">

            </FalconCardHeader>
            <CardBody>
                <Row>
                    <Col>
                        <JoiSearchBox Control={Sample}
                            TitleFree={false}
                            operator={`like N'%{#}%' AND P1='O30E23C2I12'`}
                            type={Sample.source} onChange={PropertyHandler}
                            PID={Sample.pid} placeHolder={Sample.title} />
                    </Col>
                    <Col>
                        <div className="mb-2">
                            <Label className="form-label d-block text-truncate" htmlFor="option">
                                نحوه انتخاب آنتی بیوتیک
                            </Label>
                        </div>
                        <ButtonGroup>
                            <Button
                                color={selected === 'labselect' ? 'primary' : 'secondary'}
                                onClick={() => setSelected('labselect')}
                                active={selected === 'labselect'}
                            >
                                به انتخاب آزمایشگاه
                            </Button>
                            <Button
                                color={selected === 'pishselect' ? 'primary' : 'secondary'}
                                onClick={() => setSelected('pishselect')}
                                active={selected === 'pishselect'}
                            >
                                به انتخاب مرکز
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CardBody>
                            <Divider >تشخیص</Divider>
                            <Diagnosis Changed={DiagnosisChanged} Data={DiagnosisData} />
                        </CardBody>
                        <CardBody>
                            <Divider >تستهای تشخیصی</Divider>
                            <DiagnosisTest Changed={DiagnosisTestChanged} Data={DiagnosisTestList} />
                        </CardBody>
                    </Col>
                    <Col>
                        <CardBody>
                            <Divider >آنتی بیوتیک ها</Divider>
                            <Antibiotics Changed={AntibioticsChanged} Data={AntibioticsList} />
                        </CardBody>
                    </Col>
                </Row>
                <Row>
                    <Divider >متن بعد از جدول انتی بیوتیک</Divider>
                    <Col>
                        <Input 
                        value={descAnti}
                        onChange={(event)=>setDescAnti(event.target.value)}></Input>
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <Button className="mr-2" color="primary" outline
                    onClick={SaveDoc}>ذخیره </Button>
                <Button onClick={BuildReport} className="mr-2" color='success' outline>ساخت گزارش</Button>
                {reportBuilding > 0 ? (reportBuilding === 1 ? <Spinner type='grow' color='success' /> : <FontAwesomeIcon color='success' icon={faCheck} />) : null}

            </CardFooter>
        </Card>
    )
};

export default BacteryExpectedAnswer;