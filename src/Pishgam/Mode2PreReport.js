import React, { Component } from 'react';
import { Card, CardBody, Col, Label, Row, Button, Input, InputGroup } from 'reactstrap';
import FalconCardHeader from '../components/common/FalconCardHeader';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import BaseInstance from '../Engine/BaseInstance';
import { FromManagerDataTemplate } from '../Engine/FormDataTemplate';
import { InstanceController } from '../Engine/InstanceController';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import TestControl from './TestControl';

export default class Mode2PreReport extends Component {
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
        Tests: [],
        propid: 'P11',
        RunMethod: false, MinGroup: 2,
        Turn: 0
    }
    PropertyHandler(value, obj) {
        let sample = { ...this.state.Sample, Value: obj };
        this.setState({
            ...this.state,
            Sample: sample
        })
    }
    TemplateConditionMaker() {
        let keyValue = this.state.Form.Form1ID + '@';
        keyValue += 'P9:' + this.state.Sample.Value.id + '&';
        return keyValue;
    }
    async LoadTests() {
        let FormData = await FromManagerDataTemplate.LoadByAsync(this.TemplateConditionMaker())
        // let con = this.state.Form.Condition.replace('#P9', this.state.Sample.Value.id);
        // let FormData = await FormDataTemplate.LoadData(this.state.Form.Form1ID, this.state.Form.Form2ID, con);
        if (FormData !== null) {
            let tempdata = JSON.parse(FormData.Json);
            let testlist = [];
            for (let i = 0; i < tempdata.length; i++) {
                const element = tempdata[i];
                if (Array.isArray(element.data)) {
                    element.data.map((item) => (testlist = [...testlist, item.Prop.find(x => x.PID === this.state.propid).IPV]))
                }

            }
            this.setState({
                ...this.state,
                Tests: testlist
            })
        }
    }
    async componentDidMount() {
        await this.SetParameter();
    }
    async componentDidUpdate() {
        await this.SetParameter();
    }
    async SetParameter() {
        if ((this.state.Form.Form1ID === '' && this.props.Params.fid1 !== undefined && this.props.Params.fid2 !== undefined)
            || (this.props.Params.fid1 !== this.state.Form.Form1ID)) {
            let domain = await InstanceController.LoadInstanceAsync(this.props.Params.dom);
            domain.display = domain.DIS;
            domain.id = domain.ID;
            let propid = 'P11';
            if (domain.id === 'O30E23C2I10')
                propid = 'P33'
            if (domain.id === 'O30E23C2I14')
                propid = 'P18'
            this.setState({
                ...this.state,
                Form: {
                    ...this.state.Form,
                    Form1ID: this.props.Params.fid1,
                    Form2ID: this.props.Params.fid2,
                    Domain: new BaseInstance(domain)
                },
                propid
            });
        }
    }
    Run() {
        this.setState({
            ...this.state,
            RunMethod: true
        })
    }
    EndProccess() {
        let count = this.state.Turn+1;
        let RunMethod=true;
        if(this.state.Tests.length<=count){
            RunMethod=false;
            count=0;
        }

        this.setState({
            ...this.state,
            Turn: count,RunMethod
        })
    }
    RowBuilder() {
        let result = [];
        if (this.state.Tests.length > 0) {
            let total = Math.ceil(this.state.Tests.length / 3);
            for (var i = 0; i < total; i++) {
                result = [...result, < Row key={i} >
                    {this.state.Tests.map((testid, key) => {
                        if (key >= i * 3 && key < ((i + 1) * 3)) {
                            return (
                                <Col key={testid}>
                                    <TestControl Domain={this.state.Form.Domain}
                                        MinGroup={this.state.MinGroup}
                                        RunMethod={this.state.RunMethod && this.state.Tests[this.state.Turn] === testid}
                                        Sample={this.state.Sample.Value}
                                        EndProccess={this.EndProccess.bind(this)}
                                        TestId={testid} />
                                </Col>);
                        }
                        else
                            return null;
                    })}
                </Row>];
            }
        }
        return result;
    }
    render() {
        let domainid = this.state.Form.Domain.ID;
        if (domainid === 'O30E23C2I20')
            domainid = 'O30E23C2I18';
        return (
            <>
                <Card>
                    <FalconCardHeader title={"ساخت گزارش نهایی " + this.state.Form.Domain.DIS} titleTag="h6" className="py-2">
                        <InputGroup>
                        <Label></Label>
                        <Input type='checkbox'/>
                        </InputGroup>
                    </FalconCardHeader>
                    <CardBody>
                        <Row>
                            <Col xs='6'>
                                <JoiSearchBox Control={this.state.Sample}
                                    TitleFree={false}
                                    operator={`like N'%{#}%' AND P1='${domainid}'`}
                                    type={this.state.Sample.source} onChange={this.PropertyHandler.bind(this)}
                                    PID={this.state.Sample.pid} placeHolder={this.state.Sample.title} />
                            </Col>
                            <Col>
                                <Label>حداقل تعداد در گروه</Label>
                                <Input value={this.state.MinGroup} onChange={(event) => {
                                    this.setState({
                                        ...this.state,
                                        MinGroup: event.currentTarget.value
                                    })
                                }} />
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Button onClick={this.LoadTests.bind(this)}>بارگزاری </Button>
                                <Button onClick={this.Run.bind(this)}>ساخت گزارشات </Button>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardBody>
                        {this.RowBuilder()}
                    </CardBody>
                </Card>
            </>
        );
    }
}
