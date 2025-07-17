import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Label, Row } from 'reactstrap';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import { SearchObject } from '../Engine/Common';
import { InstanceController } from '../Engine/InstanceController';
import { ConstIdes, Domain, PropConstIdes, StaticCondition } from './ConstIdes';
import * as echarts from 'echarts';
import FalconCardHeader from '../components/common/FalconCardHeader';
import TreeDataGrid from './TreeDataGrid';
export default class Mode2PreReportCA extends Component {
    state = {
        Form: {
            Form1ID: '',
            Form2ID: '',
            Domain: '',
            Condition: `''P9''%''#P9''`
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
        Data: []
    }
    async componentDidMount() {
        if (this.state.Form.Domain === '' && this.props.match.params !== undefined) {
            let domain = Domain.find(x => x.sec === this.props.match.params.dom);
            //await SearchObject(this.props.match.params.dom, 'INSTANCE', '=')

            this.state.Form.Domain = { ...domain, id: domain.sec };
            this.setState({
                ...this.state,
                Form: this.state.Form
            })
        }
    }
    async PropertyHandler(pid, value, obj) {

        if (pid.includes(ConstIdes.Sample + 'I')) {
            this.state.Sample.Value = value;
            this.setState({
                ...this.state,
                Sample: this.state.Sample
            })
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
        let domain = this.state.Form.Domain;//Domain.find(x => x.sec === this.state.Form.Domain.id);
        let conditiongroup = StaticCondition.ReportGroupTorch;
        if (domain.sec === 'O30E23C2I9' && domain.id !== 'O30E23C2I8') {
            conditiongroup = StaticCondition.ParaBKCondition;
        }

        conditiongroup = conditiongroup.replaceAll('#P9', this.state.Sample.Value.id)
            .replaceAll('#Qtype', 'group')
            .replaceAll('#Props', domain.Props)
            .replaceAll('#PIDTest', domain.PIDTest)
            .replaceAll('#resultId', domain.resultId)
            .replaceAll('#PIDResult', domain.PIDResult)
            .replaceAll('#SR', ` `);
        //.replaceAll('#SR', `{"title":"","ID":"E0C24","ref":"''${this.props.Sample.id}'',''${this.props.TestId}''"}`);

        let result = await InstanceController.GetReport(conditiongroup);
        await this.groupArrayOfObjects(result)
        this.setState({
            ...this.state,
            Data: result
        })
    }
    async groupArrayOfObjects(list) {
        for (var i = 0; i < list.length; i++) {
            let item = list[i];
            item.value = item.QTY;
            item.name = (await SearchObject(item.id, 'INSTANCE', '='))[0].display + ' ' + (item.children === undefined ? item.QTY : '');
            if (item.children !== undefined)
                await this.groupArrayOfObjects(item.children);
        }
    };
    getOption(data) {
        return {
            tooltip: {
                text: 'Torch',
            },
            visualMap: {
                type: 'continuous',
                min: 0,
                max: 10,
                inRange: {
                    color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
                }
            },
            series: {
                type: 'sunburst',
                nodeClick: false,
                data: data,
                radius: [0, '100%'],
                textStyle: {
                    fontSize: 9
                },
                label: {
                    rotate: 'radial'
                },
            },

        };
    };
    render() {
        return (
            <>
                <Card>
                    <CardBody>
                        <Row>
                            <Col >
                                <JoiSearchBox Control={this.state.Sample}
                                    TitleFree={false}
                                    operator={`like N'%{#}%' AND P1='${this.state.Form.Domain.id}'`}
                                    type={this.state.Sample.source} onChange={this.PropertyHandler.bind(this)}
                                    PID={this.state.Sample.pid} placeHolder={this.state.Sample.title} />
                            </Col>
                            <Col>
                                <JoiSearchBox Control={this.state.Labratory}
                                    TitleFree={false}
                                    type={this.state.Labratory.source} onChange={this.PropertyHandler.bind(this)}
                                    PID={this.state.Labratory.pid} placeHolder={this.state.Labratory.title} />

                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Button onClick={this.LoadTests.bind(this)}>بارگزاری </Button>
                                <Button onClick={this.LoadTests.bind(this)}>ساخت گزارشات </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {/* <ExpectedResult Domain={this.state.Form.Domain} Labratory={this.state.Labratory.Value} Sample={this.state.Sample.Value} /> */}
                <Row>
                    <Col className="d-flex flex-column pt-1 m-0">
                        <Card style={{ flex: 1 }}>
                            <FalconCardHeader titleTag="h6" className="py-2" title={'نمودار فراوانی ' + this.state.Form.Domain.display} />
                            <CardBody>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={this.getOption([...this.state.Data])}
                                    style={{ minHeight: '33.75rem' }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    {
                        this.state.Form.Domain.sec !== 'O30E23C2I9' && this.state.Form.Domain.id !== 'O30E23C2I8' ?
                            <Col className="pl-0 pt-1 m-0">
                                <TreeDataGrid setting={this.state.Form.Domain.chartSetting} title={"گزارش فراواني  " + this.state.Form.Domain.display} CompeletedData='true' Data={[...this.state.Data]} />
                            </Col> : null

                    }
                </Row>
            </>
        );
    }
}
