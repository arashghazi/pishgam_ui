import React, { Component } from 'react'
import { Badge, CardTitle, Label, ListGroupItem, Row, Col, Card, CardBody, Table } from 'reactstrap';
import FalconCardHeader from '../components/common/FalconCardHeader';
import { SearchCondition, SearchObject, Utility } from '../Engine/Common'
import { FormDataTemplate } from '../Engine/FormDataTemplate';
import FormManager from '../EngineForms/FormManager';
import { Domain, StaticCondition } from './ConstIdes';
export default class ExpectedResult extends Component {
    state = {
        ExpectedInstances: null,
        LabInstances: null,
        PIDTest: '',
        PIDResult: ''
    }
    async LoadResults() {
        if (this.state.LabInstances === null && this.state.ExpectedInstances === null
            && this.props.Sample.id !== undefined
            && this.props.Labratory.id !== undefined) {
            let domain = this.props.Domain;
        console.log(this.state, this.props)
            if (domain !== undefined) {
                let formid = ''
                let labResult = null, expResult = null
                if (domain.id !== 'O30E23C2I9' && domain.id !== 'O30E23C2I8') {
                    let resultCondition = StaticCondition.ResultOtherLab;

                    resultCondition = resultCondition.replaceAll('#P9', this.props.Sample.id)
                        .replaceAll('#P8', this.props.Labratory.id).replaceAll('#ResultClassID', domain.resultId)
                    labResult = await SearchCondition(resultCondition);
                    let expResultTemplate = await FormDataTemplate.LoadData(domain.AnswerPanelID, '', `P9${this.props.Sample.id},%`);
                    if (expResultTemplate !== null) {
                        let tempdata = JSON.parse(expResultTemplate.getJson());
                        expResult = tempdata[1].TempData;
                        let formid = tempdata[1].formID;
                        for (var i = 0; i < expResult.length; i++) {
                            for (var j = 0; j < expResult[i].Prop.length; j++) {
                                try {
                                    if (Utility.IsInstanceID(expResult[i].Prop[j].IPV))
                                        expResult[i].Prop[j].DIS = (await SearchObject(expResult[i].Prop[j].IPV, 'INSTANCE', '='))[0].display;
                                    else
                                        expResult[i].Prop[j].DIS = expResult[i].Prop[j].IPV;
                                } catch (e) {

                                }
                            }
                        }
                    }
                }
                else {
                    console.log(StaticCondition.ResultParaBKLab.replaceAll('#P9', this.props.Sample.id)
                        .replaceAll('#P8', this.props.Labratory.id).replaceAll('#resultId', domain.resultId),
                        StaticCondition.expResultParaBKLab.replaceAll('#P9', this.props.Sample.id)
                            .replaceAll('#AnswerId', domain.AnswerId))
                    labResult = await SearchCondition(StaticCondition.ResultParaBKLab.replaceAll('#P9', this.props.Sample.id)
                        .replaceAll('#P8', this.props.Labratory.id).replaceAll('#resultId', domain.resultId));
                    expResult = await SearchCondition(StaticCondition.expResultParaBKLab.replaceAll('#P9', this.props.Sample.id)
                        .replaceAll('#AnswerId', domain.AnswerId));
                    formid = '';

                    console.log(labResult, expResult)
                }
                this.setState({
                    ...this.state,
                    ExpectedInstances: expResult,
                    LabInstances: labResult,
                    PIDResult: domain.PIDResult,
                    PIDTest: domain.PIDTest,
                    FormID: formid
                })
            }
        }
    }

    async componentDidMount() {
        await this.LoadResults();
    }
    async componentDidUpdate() {
        await this.LoadResults();
    }
    LabResult(test) {
        let row = this.state.LabInstances.find(ins => ins.Prop.find(x => x.IPV === test.IPV))
        return row;
    }
    render() {
        return (<div className='mt-1'>{this.state.FormID !== undefined
            ? <FormManager isReadonly={true} Data={this.state.LabInstances} formId={this.state.FormID} />
            : null
        }
            <Card>
                <FalconCardHeader titleTag='h6' title='نتایج مورد انتظار' />
                <CardBody>
                    <Row>
                        {this.state.ExpectedInstances !== null && this.state.LabInstances !== null ?
                            this.state.ExpectedInstances.map((expItem) => {
                                let test = expItem.Prop.find(x => x.PID === this.state.PIDTest)
                                let correctanswer = expItem.Prop.find(x => x.PID === this.state.PIDResult);
                                let labanswer = this.LabResult(test).Prop.find(x => x.PID === this.state.PIDResult);

                                return (<Col className='p-1 m-0' key={test.IPV}>
                                    <CardTitle tag="h4">{this.LabResult(test).Prop.find(x => x.PID === this.state.PIDTest).DIS}</CardTitle>
                                    <Label>
                                        <Badge color={'soft-success'} className="mr-1">{correctanswer.DIS}</Badge>
                                    </Label>{'/'}
                                    <Label>
                                        <Badge color={'soft-light'
                                            //+ (labanswer.IPV === correctanswer.IPV ? 'success' :'danger')
                                        } className="mr-1">{labanswer.DIS}</Badge>
                                    </Label>
                                </Col>);
                            })
                            : null}</Row>
                </CardBody>
            </Card>
        </div>
        );
    }
}
