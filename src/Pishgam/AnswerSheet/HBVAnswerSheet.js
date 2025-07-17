import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Input, Label, Row, Spinner } from 'reactstrap';
import Divider from '../../components/common/Divider';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import { AuthenticationController } from '../../Engine/Authentication';
import BaseInstance, { NewInstance } from '../../Engine/BaseInstance';
import { Utility } from '../../Engine/Common';
import ConditionMaker, { EngineCondition } from '../../Engine/ConditionMaker';
import { InstanceController } from '../../Engine/InstanceController';
import ObjectClassController from '../../Engine/ObjectClassController';
import FormManager from '../../EngineForms/FormManager';
import { PropConstIdes } from '../ConstIdes';
import { HbvSample } from '../HBVSample';

const HBVampleAnswer = ({ resultdoc, listDiagnosis }) => {
    //const listsr = ['R', 'S'];
    const [v1, setV1] = useState(resultdoc.Result);
    const [v2, setV2] = useState(resultdoc.IntResult);
    const [v3, setV3] = useState(resultdoc.CtInternal1);
    const [v4, setV4] = useState(resultdoc.Ct1);
    useEffect(() => {
        setV1(resultdoc.Result);
        setV2(resultdoc.IntResult);
        setV3(resultdoc.CtInternal1);
        setV4(resultdoc.Ct1);
    }, [resultdoc.IntResult, resultdoc.Result,resultdoc.CtInternal1,resultdoc.Ct1])
    const resultChanged = ({ target }) => {
        resultdoc.Result = target.value;
        setV1(target.value);
    }
    const IntresultChanged = ({ target }) => {
        resultdoc.IntResult = target.value;
        setV2(target.value);
    }
    const v3Changed = ({ target }) => {
        resultdoc.CtInternal1 = target.value;
        setV3(target.value);
    }
    const v4Changed = ({ target }) => {
        resultdoc.Ct1 = target.value;
        setV4(target.value);
    }
    return (
        <Row className='p-2'>
            <Col >
                <Label>نمونه</Label>
                <Input type='text' readOnly value={resultdoc.SampleObj?.GetValue('P156')} />
            </Col>
            <Col >
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
                <Label>Ct مشاهده شده نمونه مجهول</Label>
                <Input type='number' onChange={IntresultChanged} defaultValue={v2} />
            </Col>
            <Col>
                <Label>بار ویروسی (IU/mL)</Label>
                <Input  onChange={v3Changed} defaultValue={v3} />
            </Col>
            <Col>
                <Label>Ct کنترل داخلی</Label>
                <Input onChange={v4Changed} defaultValue={v4} />
            </Col>
        </Row>
    );
};

const HBVAnswerSheet = ({  match }) => {
    const formID = match.path === "/forms/expectedhbvanswer" ? 'O30E12C39F0V2' : 'O30E12C39F0V1';
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [Header, setHeader] = useState(NewInstance('O30E12C39'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [samples, setSamples] = useState([]);
    const [listDiagnosis, setListDiagnosis] = useState();
    const [listLevel, setListLevel] = useState([]);
    const [labratoary, setLabratory] = useState();
    const [resultSample, setResultSample] = useState([]);
    const [period, setPeriod] = useState();
    useEffect(() => {
        const fetch = async () => {

            let value = await AuthenticationController.HasRole('R2');
            setIsAdmin(value);
            let con = new ConditionMaker('O30E23C3');
            if (value) {
                con.AddCondition('PC17', '=', "1");
            }
            else {
                con.AddCondition('Convert(DateTime,PC13)', '<', new Date(), 'AND').AddCondition('Convert(DateTime,PC14)', '>', new Date());
            }
            let result = await con.GetResult();
            if (result.length > 0) {
                let comsample = new EngineCondition();
                comsample.ID = 'O30E23C4';
                let samcon = new ConditionMaker('O30E23C4');
                samcon.AddCondition('P3', '=', result[0].ID, 'AND')
                    .AddCondition('P1', '=', 'O30E23C2I16');
                comsample.sqlCondition = samcon;
                comsample.returnProperties = 'P156';
                let samresult = await samcon.GetResult();
                setPeriod(result[0].ID);
                setSamples(samresult);
                SetNew(result[0].ID,samresult);
                ///////////////////////////////
                if(location?.state?.values?.length>0){
                    (new BaseInstance(Header)).SetValue('P8', location.state.values[0].value);
                    (new BaseInstance(Header)).SetValue('P3', result[0].ID);
                    setLabratory(location.state.values[0].value);
                    await Loader(undefined, samresult);
                }
                if (value && match.params.id && Utility.IsInstanceID(match.params.id)) {
                    await Loader(match.params.id, samresult);
                }
            }

        }

        if (formID === 'O30E12C39F0V1') {
            fetch();
        }
    }, [match.params.id])
    useEffect(() => {
        const fetch = async () => {
            if (!listDiagnosis) {
                let result = await InstanceController.GetInstancesAsync('O30E12C29');
                let level = await InstanceController.GetInstancesAsync('O30E12C123');
                setListDiagnosis(result);
                setListLevel(level.sort((a, b) => a.ID.localeCompare(b.ID)));
            }
        };
        fetch();
    }, [])
    //answer
    useEffect(() => {
        const fetch = async () => {
            let comsample = new EngineCondition();
            comsample.ID = 'O30E23C4';
            let samcon = new ConditionMaker('O30E23C4');
            samcon.AddCondition('P3', '=', period, 'AND')
                .AddCondition('P1', '=', 'O30E23C2I16');
            comsample.sqlCondition = samcon;
            //comsample.returnProperties = 'P156';
            let samresult = await comsample.GetResult();
            setSamples(samresult);
            (new BaseInstance(Header)).SetValue('P3', period);
            SetNew(period, samresult,Header);
            setLoading(true);
            let rows = await HbvSample.loaderExAnswer(samresult, period);
            setResultSample(rows);
            setLoading(false);
        }
        if (formID === 'O30E12C34F0V2' && period) {
            fetch();
        }
    }, [period])
    useEffect(() => {
        const loaadDoc = async () => {
            await Loader();
        }
        loaadDoc();
    }, [labratoary])

    const SetNew = (resultid, samresult,header) => {
        let _header =header??{...Header};
        (new BaseInstance(_header)).SetValue('P3', resultid);
        setHeader(_header);
        let resultSMP = [];
        samresult.map(smp => {
            let temp = new HbvSample();
            temp.Sample = new BaseInstance(smp);
            resultSMP = [...resultSMP, temp];
        });
        setResultSample(resultSMP);
    }
    const formLoaded = () => { };
    const PropertyChanged = (value, pid, ins, obj) => {
        if (pid === 'P8' && !labtag) {
            labtag = value;
            setLabratory(value)
        }
        if (formID === 'O30E12C34F0V2' && pid === 'P3') {
            setPeriod(value.id);
        }
    }
    let labtag;
    const Validation = async () => {
        let oc = await ObjectClassController.LoadAsync(Utility.GetClassID(Header.ID));
        let result = true;
        let headerIns = new BaseInstance(Header);
        for (let i = 0; i < oc?.Extended?.Required?.length; i++) {
            const propid = oc.Extended?.Required[i];
            const prop = headerIns.GetProperty(propid);
            prop.hasError = (!prop.IPV || prop.IPV === '');
            if (prop.hasError) {
                result = false;
            }

        }
        setHeader({ ...headerIns.Instance })
        return result;
    }
    const SaveDoc = async () => {
        setLoading(true);
        let result = null;
        if (formID === 'O30E12C34F0V2') {
            let rows = [];
            resultSample.map(row => rows = [...rows, row.Instance]);
            result = await InstanceController.SaveRelatedInstancesAsync(NewInstance(period), 'P167', rows);
            if (Utility.IsInstanceID(result?.Header?.ID)) {
                result.RelatedInstances.map(row => {
                    let tempins = new HbvSample(row);
                    resultSample.map(rs => {
                        if (rs.Sample === tempins.Sample) {
                            rs.Instance.ID = tempins.ID;
                        }
                    })
                });
                setResultSample(resultSample);
            }
        }
        else if (Header !== null && await Validation()) {
            let rows = [];
            resultSample.map(row => rows = [...rows, row.Instance]);
            result = await InstanceController.SaveRelatedInstancesAsync(Header, 'P167', rows);
            if (Utility.IsInstanceID(result?.Header?.ID)) {
                Header.ID = result.Header.ID;
                result.RelatedInstances.map(row => {
                    let tempins = new HbvSample(row);
                    resultSample.map(rs => {
                        if (rs.Sample === tempins.Sample) {
                            rs.Instance.ID = tempins.ID;
                        }
                    })
                });
                setHeader({ ...Header });
                setResultSample(resultSample);
                setLoading(false);
            }
        }
    }
    const Loader = async (id, Loadedsamples) => {
        let cond = new ConditionMaker('O30E12C39');
        let tempheader = new BaseInstance(Header);
        let localSample = samples?.length > 0 ? samples : Loadedsamples;
        let iab = labratoary?labratoary:tempheader.GetValue('P8',true);
        if (localSample?.length > 0) {
            if (typeof id === "string") {
                cond.AddCondition("ID", '=', id);
            }
            else if (tempheader.GetValue('P3') !== null && iab.id) {
                cond.AddCondition('P3', '=', tempheader.GetValue('P3'), 'And');
                cond.AddCondition(PropConstIdes.Lab, '=', iab.id);
            }
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(cond)
                , 'P167', ['O30E12C122'])
            if (doc?.Header?.ID) {
                let rows = [];
                doc.RelatedInstances.map(row => {
                    let tempins = new HbvSample(row);
                    rows = [...rows, tempins];
                });
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    element.Sample = new BaseInstance(await InstanceController.LoadInstanceAsync(element.Sample));
                }
                setHeader(doc.Header);
                setResultSample(rows);
            }
            else {
                let head = new BaseInstance(NewInstance('O30E12C39'));
                head.SetValue('P8', iab);
                head.SetValue('P3', tempheader.GetValue('P3'));
                SetNew(tempheader.GetValue('P3'), localSample,head.Instance);
            }

        }
    }
    const DeleteDoc = async () => {
        let ins = [];
        resultSample.map(row => ins = [...ins, row.Instance]);
        let doc = await InstanceController.DeleteRelatedInstancesAsync(Header
            , 'P167', ins);
        if (doc) {
            let head = new BaseInstance(NewInstance('O30E12C39'));
            head.SetValue('P8', labratoary);
            head.SetValue('P3', period);
            SetNew(period, samples,head);
        }
    }
    return (
        <Card>
            <FalconCardHeader title={formID === 'O30E12C34F0V2' ? 'جواب مورد انتظار HBV' : "فرم ثبت نتایج مولکولی عفونی HBV"}>
                {loading && Header ? <Spinner color='primary' /> : null}
            </FalconCardHeader>
            <CardBody>
                <FormManager formLoaded={formLoaded} formId={formID}
                    location={{ ...location, state: { ...location?.state, formid: formID } }}
                    Data={[{ formId: formID, data: Header }]}
                    onChange={PropertyChanged} CardOff />
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
                    {isAdmin ? <Button className='ml-1 mr-1' color='danger'
                        onClick={DeleteDoc}
                    >حذف</Button> : null}
                </>}
            </CardFooter>
        </Card>
    );
};

export default HBVAnswerSheet;