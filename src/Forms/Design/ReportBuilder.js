import { faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import { ReportHistory, SearchObject } from '../../Engine/Common';
import { InstanceController } from '../../Engine/InstanceController';
import { ConstIdes, Domain, PropConstIdes, StaticCondition } from '../../Pishgam/ConstIdes';
import ReactToPrint from "react-to-print";
import AnalyticsReportFormat1 from '../Reports/AnalyticsReportFormat1';
import { round } from 'lodash';
import { toast } from 'react-toastify';
export default class ReportBuilder extends Component {
    state = {
        Data: [],
        Headers:[],
        chartType: 'bar',
        Controls: [{
            col: "3",
            pid: PropConstIdes.Lab,
            controlType: "SearchControl",
            title: "آزمایشگاه",
            source: ConstIdes.Lab,
            Value: {}
        }, {
            col: "3",
            pid: PropConstIdes.Sample,
            controlType: "SearchControl",
            title: "نمونه",
            source: ConstIdes.Sample,
            Value: {}
        }, {
            col: "3",
            pid: PropConstIdes.BioTest,
            controlType: "SearchControl",
            title: "آزمایش",
            source: ConstIdes.BioTest,
            Value: {}
            }],
        labResult: null,
        CVV: 0,
        HeadOff: true
    }

    async componentDidMount() {
        await this.QuickLoad();
    }

    async componentDidUpdate() {
        await this.QuickLoad();
    }
    async QuickLoad() {
        if (this.props.match !== undefined && this.props.match.params !== undefined) {
            let { dom, lab, smp, tst } = this.props.match.params;
            if (lab !== undefined && smp !== undefined && tst !== undefined) {
                if (this.state.Controls[0].Value.id !== lab || this.state.Controls[1].Value.id !== smp || this.state.Controls[2].Value.id !== tst) {
                    let labobj = (await SearchObject(lab, 'INS', '='))[0];
                    let smpobj = (await SearchObject(smp, 'INS', '='))[0];
                    let tstobj = (await SearchObject(tst, 'INS', '='))[0];
                    this.setState({
                        ...this.state,
                        Controls: [
                            { ...this.state.Controls[0], Value: labobj },
                            { ...this.state.Controls[1], Value: smpobj },
                            { ...this.state.Controls[2], Value: tstobj }
                        ],
                        HeadOff: true
                    });
                    await this.RunFilter();
                }
            } else if (this.state.HeadOff) {
                this.setState({ ...this.state, HeadOff: false })
            }
        }
        
    }

    PropertyHandler(pid, value, obj) {
        this.state.Controls.find(x => x.pid === pid).Value = obj;
        this.setState({
            ...this.state,
            Controls: this.state.Controls
        })
    }
    async RunFilter() {
        let domain = Domain.find(x => x.sec === this.props.match.params.dom);
        let rowresult = await ReportHistory.Find(`''${this.state.Controls[1].Value.id}'',''${this.state.Controls[2].Value.id}'',''${this.state.Controls[0].Value.id}''`)
        let groupResult = await ReportHistory.Find(`''${this.state.Controls[1].Value.id}'',''${this.state.Controls[2].Value.id}''`, 'group')
        if (rowresult.length > 0) {
            let labresult = JSON.parse(rowresult[0].Prop.find(x => x.PID === 'PC556').IPV.replaceAll("'", '"'))[0];
            let condition = StaticCondition.getReport(this.props.match.params.dom).replaceAll('#' + PropConstIdes.Sample, this.state.Controls[1].Value.id)
                .replaceAll('#' + domain.testId, this.state.Controls[2].Value.id).replaceAll('#vcfg', 0).replaceAll('#Qtype', 'list').replaceAll('#SR', '""');
            let fields = domain.fields.split(',');
            fields.map((id) => {
                condition = condition.replaceAll('#' + id, labresult[id])
            })
            let analysisresult = await InstanceController.GetReport(condition);
            for (let i = 0; i < fields.length; i++) {
                if (labresult[fields[i]] !== undefined)
                    labresult['G'+(i+1)] = (await SearchObject(labresult[fields[i]]))[0].display;
            }
            console.log(analysisresult, condition)
            //if (labresult.P13 !== undefined)
            //    labresult.G2 = (await SearchObject(labresult.P13))[0].display;
            //if (labresult.P14 !== undefined)
            //    labresult.G3 = (await SearchObject(labresult.P14))[0].display;
            let group = JSON.parse(groupResult[0].Prop.find(x => x.PID === 'PC556').IPV.replaceAll("'", '"'));

            let g1 = group.find(x => x.id === labresult[fields[0]]);
            for (let i = 1; i < fields.length; i++) {
                if (g1.children !== undefined)
                    g1 = g1.children.find(x => x.id === labresult[fields[i]])
            }
            labresult.UM = round(g1.um, 2);
            //let g1 = group.find(x => x.id === labresult.P12);
            //if (g1.children !== undefined)
            //    g1 = g1.children.find(x => x.id === labresult.P13)
            //if (g1.children !== undefined)
            //    g1 = g1.children.find(x => x.id === labresult.P14)
            //if (labresult.UM !== undefined)
            //    labresult.UM = round(g1.um, 2);
            this.setState({
                ...this.state,
                Data: analysisresult,
                Headers: ['نحوه', 'روش', 'سازنده کیت'],
                labResult: labresult,
                GroupResult: group,
            })
        }
        else
            toast.warn('داده ای یافت نشد')
    }
    Print() {

    }
    render() {
        let LabVal = null;
        return (
            <>
                {this.state.HeadOff ? null : <>
                    <Row className='pb-1'>
                        <Col>
                            <Card>

                                <CardHeader>
                                    <CardTitle className='float-left' tag="h6">{'گزارش ارزیابی خارجی کیفیت'}</CardTitle>
                                    <div className='float-right' type="inline">
                                        <ButtonIcon icon={faFilter} onClick={this.RunFilter.bind(this)} />
                                        <ReactToPrint
                                            trigger={() => <ButtonIcon icon={faPrint} onClick={this.Print.bind(this)} />}
                                            content={() => this.componentRef}
                                        />
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <JoiSearchBox Control={this.state.Controls[0]}
                                                TitleFree={false} value={LabVal !== null && LabVal !== undefined ? LabVal.Display : ''}
                                                type={this.state.Controls[0].source} onChange={this.PropertyHandler.bind(this, this.state.Controls[0].pid)}
                                                PID={this.state.Controls[0].pid} placeHolder={this.state.Controls[0].title} />

                                        </Col>
                                        <Col>
                                            <JoiSearchBox Control={this.state.Controls[1]}
                                                TitleFree={false} value={LabVal !== null && LabVal !== undefined ? LabVal.Display : ''}
                                                type={this.state.Controls[1].source} onChange={this.PropertyHandler.bind(this, this.state.Controls[1].pid)}
                                                PID={this.state.Controls[1].pid} placeHolder={this.state.Controls[1].title} />
                                        </Col>
                                        <Col>
                                            <JoiSearchBox Control={this.state.Controls[2]}
                                                TitleFree={false} value={LabVal !== null && LabVal !== undefined ? LabVal.Display : ''}
                                                type={this.state.Controls[2].source} onChange={this.PropertyHandler.bind(this, this.state.Controls[2].pid)}
                                                PID={this.state.Controls[2].pid} placeHolder={this.state.Controls[2].title} />
                                        </Col>

                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>}
                <AnalyticsReportFormat1 style={{ innerWidth: '2000' }} data={this.state} ref={(el) => (this.componentRef = el)} />
            </>
            );
        
    }
}
const isDark = false;
//const { isDark } = useContext(AppContext);