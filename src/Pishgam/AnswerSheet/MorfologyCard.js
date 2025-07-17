import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React,{ Component } from "react";
import { Card, CardBody, Col, Input, Label, Row, Table } from "reactstrap";
import FalconCardHeader from "../../components/common/FalconCardHeader";
import { InstanceController } from "../../Engine/InstanceController";

export default class MorfologyCard extends Component {
    static MorfologyTestList = [];
    state = {
        Tests: [],
        Answers: [{ id: '+', display: '+' }, { id: '++', display: '++' }, { id: '+++', display: '+++' }],
        SelectedTest: null,
        SelectedAnswer: null
    }
    async componentDidMount() {
        if (this.state.Tests.length === 0 && MorfologyCard.MorfologyTestList.length>0) {
            this.setState({
                ...this.state,
                Tests: MorfologyCard.MorfologyTestList.filter(x => x.type === this.props.title)
            })
        }
    }
    PTest = 'P56';
    PAnswer = 'P57';
    TestChanged = (event) => {
        let test = this.state.Tests.find(x => x.id === event.target.value)
        this.setState({ ...this.state, SelectedTest:test })
    }
    AddNewRow = (event) => {

        let selectedanswer = this.state.Answers.find(t => t.id === event.target.value);
        let object = {
            ID: 'O30E12C50', Prop: [{ PID: this.PTest, IPV: this.state.SelectedTest.id, DIS: this.state.SelectedTest.display },
                { PID: this.PAnswer, IPV: event.target.value, DIS: selectedanswer.display }]
        }
        let list = [...this.props.DataSource, object]
        this.props.onChanged(this.props.title, list);
        this.setState({
            ...this.state, SelectedTest: "notselected", SelectedAnswer: 'notselected'
        })

    }
    async Deleted(value) {
        console.log(value);
        let selectedtestIndex = this.props.DataSource.findIndex(t => t.Prop.find(p => p.PID === this.PTest && p.IPV === value));
        if (selectedtestIndex >= 0) {
            let result = await InstanceController.DeleteAsync(this.props.DataSource[selectedtestIndex].ID);
            if (result) {
                let list = [...this.props.DataSource]
                list.splice(selectedtestIndex, 1);
                this.props.onChanged(this.props.title, list);
            }
        }
    }
    IsDisable() {
        return this.state.SelectedTest === null;
    }
    render() {
        return (<Card className='mb-2'>
            <FalconCardHeader title={this.props.title} />
            <CardBody>
                <Row>
                    <Col xs={8} >
                        <Label>Morphology</Label>
                        <Input
                            bsSize="sm"
                            className="mb-1"
                            type="select"
                            onChange={this.TestChanged}
                            value={this.state.SelectedTest?.id ?? ''}
                        >
                            <option value="notselected">
                                انتخاب نشده
                            </option>
                            {
                                this.state.Tests.map(test => {
                                    if (this.props.DataSource.find(t => t.Prop.find(p => p.PID === this.PTest && p.IPV === test.id)) === undefined)
                                        return <option key={test.id} value={test.id} > {test.display}</option>;
                                    return null;
                                })
                            }
                        </Input>
                    </Col>
                    <Col xs={4} >
                        <Label>Result</Label>
                        <Input
                            bsSize="sm"
                            className="mb-1"
                            type="select"
                            onChange={this.AddNewRow}
                            disabled={this.IsDisable()}
                            value={this.state.SelectedAnswer?.id ?? ''}
                        >
                            <option value="notselected">
                                انتخاب نشده
                            </option>
                            {
                                this.state.Answers.map(ans => {
                                    return (
                                        <option key={ans.id} value={ans.id}>{ans.display}</option>
                                    );
                                })
                            }
                        </Input>
                    </Col>
                </Row>
                <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                    <tbody>
                        {
                            this.props.DataSource?.map((item, index) => {
                                return (<tr key={item.ID + index}>
                                    <td className='col-9' >{this.state.Tests?.find(x => x.id === item.Prop.find(p => p.PID === this.PTest)?.IPV)?.display}</td>
                                    <td className='col-2'>{this.state.Answers?.find(x => x.id === item.Prop.find(p => p.PID === this.PAnswer)?.IPV)?.display}</td>
                                    <td className='col-1'><FontAwesomeIcon onClick={this.Deleted.bind(this, item.Prop.find(p => p.PID === this.PTest)?.IPV)} size='1x' icon={'trash'} className="text-danger" /></td>
                                </tr>);
                            })
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>);
    }
}