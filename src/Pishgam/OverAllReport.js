import React, { Component } from 'react';
import { Card, CardBody, Col, Label, Row, Button, Table, CardFooter } from 'reactstrap';
import ConditionMaker from '../Engine/ConditionMaker';
import { ConstIdes, Domain, PropConstIdes } from './ConstIdes';
import { FromManagerDataTemplate } from "../Engine/FormDataTemplate";
import { ReportHistory } from '../Engine/EngineContext';
import { toast } from 'react-toastify';
import ReportHeader from './ReportHeader';
import NoData from './NoData';
import { SetLocalLink } from '../Engine/Common';
import AdminReportHeader from './AdminReportHeader';
import { InstanceController } from '../Engine/InstanceController';
import BaseInstance from '../Engine/BaseInstance';
import Flex from '../components/common/Flex';

export const SDIChart = () => {
    return (
        <Flex justify={'center'} align={'center'}>
            <Table style={{ width: '420px', direction: 'ltr' }} bordered size="sm">
                <thead>
                    <tr>
                        <th style={{ maxWidth: '75px' }}>
                            SDI≤0.99
                        </th>
                        <th style={{ maxWidth: '75px' }}>
                            1≤SDI≤1.99
                        </th>
                        <th style={{ maxWidth: '85px' }}>
                            2≤SDI≤2.99
                        </th>
                        <th style={{ maxWidth: '50px' }}>
                            SDI≥3
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="table-success" >
                            حوب
                        </td>
                        <td className="table-info">
                            قابل قبول
                        </td>
                        <td className="table-warning">
                            هشدار
                        </td>
                        <td className="table-danger">
                            غیرقابل قبول
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Flex>
    )
}

export default class OverAllReport extends Component {
    state = {
        Form: {
            Form1ID: '',
            Form2ID: '',
            Domain: '',
            Condition: `%P9#P9%`
        },
        Sample: {
            col: "3",
            pid: PropConstIdes.Sample,
            controlType: "SearchControl",
            title: "نمونه",
            source: ConstIdes.Sample,
            Value: {}
        },
        Labratory: {
            col: "3",
            pid: PropConstIdes.Lab,
            controlType: "SearchControl",
            title: "آزمایشگاه",
            source: ConstIdes.Lab,
            Value: {}
        },
        Tests: [],
        propid: 'P11',
        RunMethod: false
    }
    constructor(props) {
        super(props);
    }
    async PropertyHandler(pid, value, obj) {
        if (pid.includes(ConstIdes.Sample + 'I')) {
            this.setState({
                ...this.state,hasResult:false,
                loading: true
            });
            value.Instance = new BaseInstance(await InstanceController.LoadInstanceAsync(value.id));
            this.state.Sample.Value = value;
            this.setState({
                ...this.state,
                Sample: this.state.Sample,
                sampleUpdate: true
            });
        }
        else if (pid.includes(ConstIdes.Lab + 'I')) {
            this.state.Labratory.Value = value;
            this.setState({
                ...this.state,
                Labratory: this.state.Labratory
            })
        }
    }
    async LoadTests() {
        if (this.state.Labratory.Value && this.state.Sample.Value) {
            this.setState({
                ...this.state,
                loading: true
            })
            let FormData = await FromManagerDataTemplate.LoadByAsync(`${this.state.Form.Form1ID}@P9:${this.state.Sample.Value.id}&`);
            if (FormData !== null) {
                let condition = new ConditionMaker('E0C24');
                condition.AddCondition('PC19', 'like', `#${this.state.Labratory.Value.id}#%`)
                let rowresult = await condition.GetResult();
                if (rowresult?.length > 0) {
                    let tempdata = JSON.parse(FormData.Json);

                    let data = tempdata.find(x => x.formId === this.state.Form.Form2ID).data;
                    let testlist = [];
                    let TestResults = [];
                    if (Array.isArray(data))
                        data.map((item) => {
                            let row = item.Prop.find(x => x.PID === this.state.Form.Domain.testId);
                            (testlist = [...testlist, { id: row.IPV, display: row.DIS }])
                        });

                    let rowobjects = [];
                    rowresult.map(x => rowobjects = [...rowobjects, new ReportHistory(x)]);
                    for (var i = 0; i < testlist.length; i++) {

                        let labresult = rowobjects.find(x => x.Refrence === `#${this.state.Labratory.Value.id}#${testlist[i].id}#`);
                        let unitins = await InstanceController.LoadInstanceAsync(testlist[i].id);
                        let unit = (new BaseInstance(unitins)).GetValue("PC320", true);
                        if (!unit)
                            unit = (new BaseInstance(unitins)).GetValue("P35", true);

                        if (labresult) {
                            TestResults = [...TestResults, {
                                Test: { ...testlist[i], Unit: unit }, Result: JSON.parse(labresult.Json).find(x => x?.smp === this.state.Sample.Value.id)

                            }]
                        }
                    }
                    let hasResult = false;
                    for (let index = 0; index < TestResults.length; index++) {
                        const element = TestResults[index];
                        if (element.Result) {
                            hasResult = true;
                            break;
                        }
                    }
                    this.setState({
                        ...this.state,
                        Tests: TestResults, hasResult
                    });
                }
                else {
                    toast.warn("داده ای یافت نشد")
                }

            }
            this.setState({
                ...this.state,
                loading: false
            })
        }

    }
    async componentDidMount() {
        await this.SetParameter();
    }
    async componentDidUpdate() {
        await this.SetParameter();
        if (this.state.sampleUpdate) {
            this.setState({
                ...this.state,
                sampleUpdate: false
            });
            await this.LoadTests();
        }
    }
    async SetParameter() {
        try {

            if (this.state.Form.Form1ID === '' && this.props.match?.params?.fid1 !== undefined && this.props.match?.params?.fid2 !== undefined) {
                let domain = new BaseInstance(await InstanceController.LoadInstanceAsync(this.props.match.params.dom));
                domain.Instance.id = domain.ID;
                domain.Instance.display = domain.DIS;
                domain.Instance.testId = domain.GetValue("PC19").split('#')[3];
                this.setState({
                    ...this.state,
                    Form: {
                        ...this.state.Form,
                        Form1ID: this.props.match.params.fid1,
                        Form2ID: this.props.match.params.fid2,
                        Domain: domain.Instance
                    }
                });
            }
            else if (this.props.report && this.state.Form?.Domain?.ID !== this.props.report?.ID) {
                let domSetting = JSON.parse(this.props.report.GetValue('PC556'));
                if (Array.isArray(domSetting))
                    domSetting = domSetting[0];
                let params = domSetting?.report;
                let fid1 = params?.split(',')[0];
                let fid2 = params?.split(',').length > 0 ? params?.split(',')[1] : '';
                let domain = this.props.report;
                domain.Instance.id = domain.ID;
                domain.Instance.display = domain.DIS;
                domain.Instance.testId = domain.GetValue("PC19").split('#')[3];
                this.setState({
                    ...this.state,
                    Form: {
                        ...this.state.Form,
                        Form1ID: fid1,
                        Form2ID: fid2,
                        Domain: domain.Instance,
                    },
                    Tests: []
                });
            }
            if (this.props.labratoary && !this.state.Labratory.Value?.id) {
                let lab = { ...this.state.Labratory, Value: this.props.labratoary };
                this.setState({
                    ...this.state,
                    Labratory: lab
                });
            }
            if (this.props.labratoary && !this.state.Labratory.Value?.id) {
                let lab = { ...this.state.Labratory, Value: this.props.labratoary };
                this.setState({
                    ...this.state,
                    Labratory: lab
                });
            }
        } catch (error) {

        }
    }
    RowBuilder() {
        let counter = 1;
        let result = [];
        let header = <thead key='head'>
            <tr  >
                <th>#</th>
                <th>
                    Test
                </th>
                <th>
                    Your Result
                </th>
                <th>
                    Target
                </th>
                <th>
                    CV
                </th>
                <th>
                    SDI
                </th>
                <th>
                    %Dev
                </th>
                {
                this.state.Sample.Value.Instance.GetValue('P166') === 'true' ? 
                <th>
                    UM
                </th> : null
                }
                <th>

                </th>
            </tr>
        </thead>;
        this.state.Tests.map(({ Test, Result }) => {
            return (Result ?
                result = [...result, <tr key={Test.id}>
                    <td>{counter++}</td>
                    <td style={{ fontWeight: 'bolder' }}>
                        {Test !== null ? Test.display : null}
                    </td>
                    <td>
                        <Label>{Result ? Result.ans : 0}</Label>
                    </td>
                    <td>
                        <Label>{Result ? parseFloat(Result.avg).toFixed(2) : 0}</Label>
                    </td>
                    <td>
                        <Label>{Result?.cv}</Label>
                    </td>
                    <td>
                        <Label >{
                            Result?.sdi < 5 && Result?.sdi > -5 ? parseFloat(Result.sdi).toFixed(2) : 'OOR'}</Label>
                    </td>
                    <td>
                        <Label>{
                            Result?.sdi < 5 && Result?.sdi > -5 ? Math.abs(parseFloat(Result.dev).toFixed(2)) + '%' : 'OOR'}</Label>
                    </td>
                    {this.state.Sample.Value.Instance.GetValue('P166') === 'true' ? 
                    <td>
                        <Label>{parseFloat(Result.um).toFixed(3)}</Label>
                    </td>: null
                    }
                    <td>
                        <Button style={{
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            color: '#069',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }} onClick={() => {
                            let id = SetLocalLink(
                                {
                                    domain: this.state.Form.Domain,
                                    labratoary: this.state.Labratory.Value,
                                    sample: this.state.Sample.Value,
                                    test: Test
                                });
                            const newWindow = window.open('/reportbuilder/show/' + id, '_blank')
                            if (newWindow) newWindow.opener = null
                            //this.props.history.push('/reportbuilder/show/' +id )
                        }} >
                            جزئیات
                        </Button>
                    </td>
                </tr>] : null
            )
        })
        return [header, <tbody key='body'>{result}</tbody>];
    }
    reactToPrintContent = () => {
        return this.componentRef;
    };
    reactToPrintTrigger = () => {
        return <button>Print using a Class Component</button>;
    };
    render() {
        return (
            <>
                <AdminReportHeader title={"گزارش کلی " + this.state.Form?.Domain?.display} loading={this.state.loading}
                    domainId={this.state.Form.Domain.id} PropertyHandler={this.PropertyHandler.bind(this)}
                    LoadTests={this.LoadTests.bind(this)}
                />
                <Card >
                    <CardBody>
                        {
                            this.state.Tests?.length > 0 ? 
                            (this.state.hasResult ? <>
                                <ReportHeader Ref={this.componentRef} Section={this.state.Form.Domain.display}
                                    Labratoary={this.state.Labratory.Value.display}
                                    Sample={this.state.Sample.Value}
                                />
                                <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                                    {this.RowBuilder()}
                                </Table></> : <NoData loading={this.state.loading} title='برای این نمونه پاسخنامه ای یافت نشد' />)
                                : <NoData loading={this.state.loading} title='نمونه مورد نظر را انتخاب نمایید' />
                        }
                    </CardBody>

                    {/* {this.state.hasResult?
                        <CardBody>
                            {this.state.Tests?.length > 0 ? <>
                                <ReportHeader Ref={this.componentRef} Section={this.state.Form.Domain.display}
                                    Labratoary={this.state.Labratory.Value.display}
                                    Sample={this.state.Sample.Value}
                                />
                                <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                                    {this.RowBuilder()}
                                </Table></> : <NoData loading={this.state.loading} title='نمونه مورد نظر را انتخاب نمایید' />
                            }
                        </CardBody>
                    : <NoData loading={this.state.loading} title='برای این نمونه پاسخنامه ای یافت نشد' />} */}
                    <CardFooter >
                        <SDIChart />
                    </CardFooter>
                </Card>
            </>
        );
    }
}
