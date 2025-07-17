import React, { Component } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardTitle, Col, FormGroup, Label, Row, Spinner } from 'reactstrap';
import Flex from '../components/common/Flex';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import ConditionMaker from '../Engine/ConditionMaker';
import FormManager from '../EngineForms/FormManager';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import { SendProccess } from './PishgamContext';
import moment from 'moment';

export default class SendingProccess extends Component {
    state = {
        DataLoaded: true,
        Labratory: {
            col: "3",
            pid: PropConstIdes.Lab,
            controlType: "SearchControl",
            title: "آزمایشگاه",
            source: ConstIdes.Lab,
            Value: ''
        },
        Period: {
            col: "3",
            pid: PropConstIdes.Period,
            controlType: "SearchControl",
            title: "دوره",
            source: ConstIdes.Period,
            Value: ''
        },
        ReportResult: [],
        ActiveBarcode: false
    }
    labid = '';
    periodid = '';
    async PropertyHandler(code, Value, obj) {
        let instances = [];
        this.setState({
            ...this.state,
            ReportResult: instances,
            DataLoaded: false
        })
        if (code === 0) {
            this.labid = Value;
        }
        else if (code === 1) {
            this.periodid = Value;
        }
        if (this.labid !== '' && this.periodid !== '') {
            let condition = new ConditionMaker('O30E12C64')
            condition.AddCondition('P8', '=', `${this.labid}`, 'and');
            condition.AddCondition('P3', '=', `${this.periodid}`)
            instances = await condition.GetResult();
        }
        console.log(instances)
        this.setState({
            ...this.state,
            ReportResult: instances,
            DataLoaded: true
        })
    }
    componentDidMount() {
        const gotDevices = (mediaDevices) =>
            new Promise((resolve, reject) => {
                const availableVideoInputs = []
                mediaDevices.forEach(mediaDevice => {
                    if (mediaDevice.kind === 'videoinput') {
                        availableVideoInputs.push({
                            deviceId: mediaDevice.deviceId,
                            label: mediaDevice.label
                        })
                    }
                })

                if (availableVideoInputs.length > 0) {
                    resolve(availableVideoInputs)
                } else {
                    reject(new Error('ERR::NO_MEDIA_TO_STREAM'))
                }
            });

        navigator.mediaDevices.enumerateDevices().then(gotDevices)
            .then((availableVideoInputs) =>{console.log(availableVideoInputs); this.setState({ ...this.state, availableVideoInputs })})
            .catch((err) => this.setState({ ...this.state, hasError: err }))

    }
    async Update(type) {
        this.setState({
            ...this.state,
            DataLoaded: false
        })
        let date = moment().format('MM/DD/YYYY HH:mm');
        let ReportResult = this.state.ReportResult;
        ReportResult.map(async (item) => {
            let sendProccess = new SendProccess(item);
            if (type === 0) {
                sendProccess.PakingDate = date;
            }
            else if (type === 1) {
                sendProccess.SendDate = date;
            }
            await sendProccess.SaveAsync();
        });
        this.setState({
            ...this.state,
            ReportResult,
            DataLoaded: true
        })
    }
    async Barcodered(result, error) {
        if (result) {
            let barcode = result.text;
            if (barcode.includes('/'))
                barcode = barcode.split('/')[barcode.split('/').length - 1];
            this.setState({
                ...this.state, ActiveBarcode: false,
                Labratory: { ...this.state.Labratory, Value: barcode }
            })
            this.PropertyHandler(0, barcode)
        }
    }
    render() {

        return (
            <>
                <Card className='mb-2'>
                    <CardTitle>

                    </CardTitle>
                    <CardBody>
                        <Row>
                            <Col lg='6' sm='12' >
                                <JoiSearchBox Control={this.state.Period}
                                    TitleFree={false}
                                    type={this.state.Period.source} onChange={this.PropertyHandler.bind(this, 1)}
                                    PID={this.state.Period.pid} placeHolder={this.state.Period.title} />
                            </Col>
                            {!this.state.ActiveBarcode ? <><Col lg='6' sm='12' >
                                <JoiSearchBox Control={this.state.Labratory}
                                    TitleFree={false} PValue={this.state.Labratory.Value}
                                    type={this.state.Labratory.source} onChange={this.PropertyHandler.bind(this, 0)}
                                    PID={this.state.Labratory.pid} placeHolder={this.state.Labratory.title} />
                            </Col>
                            </> :
                                <Col lg='6' sm='12'>
                                    <QrReader className='p-0 m-0' constraints={{ facingMode: 'environment' }}
                                        onResult={this.Barcodered.bind(this)} />
                                </Col>}
                        </Row>
                        <CardFooter>
                            <Row >
                                <Col>
                                    <Button block className='mb-2' onClick={() => this.setState({ ...this.state, ActiveBarcode: !this.state.ActiveBarcode })}>اسکن بارکد</Button>
                                </Col>
                                <Col>
                                    <ButtonGroup >
                                        <Button color='primary' onClick={this.Update.bind(this, 0)} >تاریخ فاکتور</Button>
                                        <Button color='success' onClick={this.Update.bind(this, 1)} >ارسال شد</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </CardFooter>
                    </CardBody>
                    {
                        this.state.DataLoaded ?
                        <FormManager  formId={'O30E12C64F1V1'} delete
                    Data={[{ formId: 'O30E12C64F1V1', data: this.state.ReportResult }]}
                     CardOff />
                            // <FormRouter  isReadonly={true}
                            //     TitleFree={true} className='pt-2' source='O30E12C64F1V1' Data={this.state.ReportResult} />
                            : <Flex inline={true} justify='center' align='center'><Spinner style={{ margin: 10 }} /></Flex>
                    }
                </Card>
            </>
        );
    }
}
