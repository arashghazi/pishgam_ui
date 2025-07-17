import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardFooter, Col, Row, Spinner } from "reactstrap";
import Divider from "../../../components/common/Divider";
import FalconCardHeader from "../../../components/common/FalconCardHeader";
import { AuthenticationController } from "../../../Engine/Authentication";
import BaseInstance, { NewInstance } from "../../../Engine/BaseInstance";
import { Utility } from "../../../Engine/Common";
import ConditionMaker from "../../../Engine/ConditionMaker";
import { InstanceController } from "../../../Engine/InstanceController";
import FormManager from "../../../EngineForms/FormManager";
import { PropConstIdes } from "../../ConstIdes";
import Antibiotics from "./Antibiotics";
import { AntibioticsRow, BacteryDiagnosis, BacteryTestRow } from "./BacteryContext";
import Diagnosis from "./Diagnosis";
import DiagnosisTest from "./DiagnosisTest";

export default class BacteryAnswerSheet extends Component {
    state = {
        Header: NewInstance(),
        DiagnosisData: {},
        DiagnosisTestList: [],
        AntibioticsList: [],
        loading: true,
        isAdmin: undefined
    }
    async componentDidMount() {
        if (!this.state.isAdmin) {
            let isAdmin = await AuthenticationController.HasRole('R2');
            this.setState({
                ...this.state,
                isAdmin
            })
        }
        if (this.props.match?.params?.id)
            this.Load(this.props.match?.params?.id);
    }
    async componentDidUpdate() {
        if (this.props.location?.state?.Active === false) {
            this.props.location.state.Active = true;
            let values = this.props.location?.state.values;
            let ins = new BaseInstance(NewInstance('O30E12C75'));

            for (let i = 0; i < values.length; i++) {
                const element = values[i];
                ins.SetValue(element.pid, element.value);
            }
            await this.Load(ins);
        }
    }
    Validation() {
        if (!this.formLoad) {
            toast.error('صبور باشید تا فرم کامل بارگزاری شود');
            return false;
        }

        if (this.state.AntibioticsList.length > 12) {
            toast.error("تعداد آنتی بیوتیک های ثبت شده نمی تواند بیشتر از 12 ردیف باشد")
            return false;
        }
        return true;
    }
    async SaveDoc() {
        this.setState({
            ...this.state,
            loading: true
        })
        let result = null;
        if (this.Validation() && this.state.Header !== null) {

            let relatives = [...Utility.ObjToInsList(this.DiagnosisTestList), ...Utility.ObjToInsList(this.AntibioticsList), this.DiagnosisData.Instance];
            result = await InstanceController.SaveRelatedInstancesAsync(this.state.Header, 'P100', relatives);
            await this.Load();

        }

        this.setState({
            ...this.state,
            loading: false
        })
        return result;
    }
    DiagnosisData = new BacteryDiagnosis();
    DiagnosisTestList = [];
    AntibioticsList = [];
    Header;
    async PropertyChanged(objValue, property, instance) {
        this.Header = instance;
        if ((property === 'P9' || property === 'P8') &&
            (instance.Prop.find(x => x.PID === 'P8')?.IPV !== undefined &&
                instance.Prop.find(x => x.PID === 'P9')?.IPV !== undefined)) {
            await this.Load();
        }
    }
    DiagnosisChanged(instance) {
        this.DiagnosisData = instance;
    }
    DiagnosisTestChanged(data) {
        this.DiagnosisTestList = data;
    }
    AntibioticsChanged(data) {
        this.AntibioticsList = data;
    }
    async Load(header) {
        this.setState({
            ...this.state,
            loading: true
        })
        if (!header)
            header = new BaseInstance(this.Header);

        let cond = new ConditionMaker('O30E12C75');
        if (typeof header === "string") {
            cond.AddCondition("ID", '=', header);
        }
        else {
            cond.AddCondition(PropConstIdes.Sample, '=', header.GetValue('P9'), 'And');
            cond.AddCondition(PropConstIdes.Lab, '=', header.GetValue('P8'));
        }
        let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(cond)
            , 'P100', ['O30E12C74', 'O30E12C69', 'O30E12C67'])
        this.DiagnosisData = new BacteryDiagnosis();
        this.DiagnosisTestList = [];
        this.AntibioticsList = [];
        if (Utility.IsInstanceID(doc?.Header.ID)) {
            doc.RelatedInstances.map((ins) => {
                if (ins.ClassID === 'O30E12C74')
                    this.AntibioticsList = [...this.AntibioticsList, new AntibioticsRow(ins)]
                else if (ins.ClassID === 'O30E12C69')
                    this.DiagnosisTestList = [...this.DiagnosisTestList, new BacteryTestRow(ins)]
                else if (ins.ClassID === 'O30E12C67')
                    this.DiagnosisData = new BacteryDiagnosis(ins)
                return ins;
            })

            this.setState({
                ...this.state,
                DiagnosisData: this.DiagnosisData,
                DiagnosisTestList: this.DiagnosisTestList,
                AntibioticsList: this.AntibioticsList,
                Header: doc.Header
            })
        }
        else {
            let head = { ...header.Instance };
            head.ID = 'O30E12C75';
            this.setState({
                ...this.state,
                DiagnosisData: new BacteryDiagnosis(),
                DiagnosisTestList: [],
                AntibioticsList: [],
                Header: head
            })
        }
        this.setState({
            ...this.state,
            loading: false
        })
    }
    async DeleteDoc() {
        //if (Utility.IsInstanceID(this.state.header?.ID)) {
        let relatives = [...Utility.ObjToInsList(this.DiagnosisTestList), ...Utility.ObjToInsList(this.AntibioticsList), this.DiagnosisData.Instance];
        await InstanceController.DeleteRelatedInstancesAsync(this.state.Header, 'P100', relatives);

        //}
    }
    formLoad = false;
    formLoaded(formid) {
        this.formLoad = true;
    }
    render() {
        return (<>
            <FormManager formLoaded={this.formLoaded.bind(this)} formId='O30E12C75F0V1'
                location={{ ...this.props.location, state: { ...this.props.location?.state, formid: 'O30E12C75F0V1' } }}
                Data={[{ formId: 'O30E12C75F0V1', data: this.state.Header }]}
                onChange={this.PropertyChanged.bind(this)} title= "فرم ثبت نتایج میکروب شناسی">
                {/* <FalconCardHeader title="فرم ثبت نتایج میکروب شناسی">
                    {this.state.loading && this.Header ? <Spinner color='primary' /> : null}
                </FalconCardHeader> */}
                <CardBody>
                    {/* <Row>
                        <CardBody>

                        </CardBody>
                    </Row> */}
                    <Row>
                        <Col>
                            <CardBody>
                                <Divider >تشخیص</Divider>
                                <Diagnosis Changed={this.DiagnosisChanged.bind(this)} Data={this.state.DiagnosisData} />
                            </CardBody>
                            <CardBody>
                                <Divider >تستهای تشخیصی</Divider>
                                <DiagnosisTest Changed={this.DiagnosisTestChanged.bind(this)} Data={this.state.DiagnosisTestList} />
                            </CardBody>
                        </Col>
                        <Col>
                            <CardBody>
                                <Divider >آنتی بیوتیک ها</Divider>
                                <Antibiotics Changed={this.AntibioticsChanged.bind(this)} Data={this.state.AntibioticsList} />
                            </CardBody>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    {this.state.loading ? null : <><Button color="primary" outline  className="mr-1 ml-1"
                        onClick={this.SaveDoc.bind(this)}>ذخیره </Button>
                        {this.state.isAdmin ? <Button color='danger'
                            onClick={this.DeleteDoc.bind(this)}
                        >حذف</Button> : null}
                    </>}
                </CardFooter>
            </FormManager></>
        )
    }
}