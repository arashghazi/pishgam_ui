import React, { Component } from "react";
import { Card, CardBody, CardFooter, Col, CustomInput, Button, FormGroup, Input, Label, Row, InputGroup, InputGroupText, ButtonGroup, Badge, Spinner } from "reactstrap";
import FalconCardHeader from "../../components/common/FalconCardHeader";
import iconMellat from '../../assets/img/icons/mellat.png';
import iconSepah from '../../assets/img/icons/sepah.png';
import Flex from "../../components/common/Flex";
import { PaymentDocument } from "../ShopContext";
import { MoneyFormat, Utility } from "../../Engine/Common";
import { AuthenticationController } from "../../Engine/Authentication";
import AppContext from "../../context/Context";
import { BankController } from "../../Pishgam/Bank/BankController";
export default class LabPaymentType extends Component {
    state = {
        Header: { ID: '' },
        amount: 0,
        cusomer: {},
        paymentdocument: null,
        ActiveMethod: 31,
        selectedBank: 1
    }
    labelClasses = 'ls text-600 font-weight-semi-bold mb-0 text-truncate';
    async componentDidMount() {
        await this.initial();
    }
    async componentDidUpdate() {
        await this.initial();
    }
    isadmin = false;
    async initial() {
        if (this.state.paymentdocument === null) {
            this.isadmin = await AuthenticationController.HasRole('R2');
            if (this.props?.match?.params?.id &&
                this.state.Header.ID !== this.props?.match?.params?.id) {
                let invoiceDoc = await PaymentDocument.LoadInvoice(this.props?.match?.params?.id);
                let doc = {};
                if (invoiceDoc.Payments.length === 0) {
                    doc = new PaymentDocument(undefined, invoiceDoc.Header);
                    doc.PaymentType = 1;
                    doc.ReciverAccount = 'mellat';
                    doc.RegisterDate = (await Utility.GetNow()).toString;
                }
                else
                    doc = invoiceDoc.Payments[0];
                let method = this.isadmin ? 31 : 7;
                this.setState({
                    ...this.state,
                    Header: invoiceDoc.Header,
                    ActiveMethod: method,
                    paymentdocument: doc
                });
            }
        }
    }

    async ChangeValue(value, prop) {
        if (prop === 'PaymentType')
            await this.initial();
        this.state.paymentdocument[prop] = value;
        this.setState({
            ...this.state,
            paymentdocument: this.state.paymentdocument
        });
    }
    async HeaderState(id) {
        this.setState({
            ...this.state,
            Working: true
        })
        let Header = this.state.Header;
        Header.state = id;
        await Header.SaveAsync();
        this.setState({
            ...this.state,
            Header,
            Working: false
        })
    }
    render() {
        return (<>
            <AppContext.Consumer>
                {({ setCurrentTitle }) => setCurrentTitle('نحوه پرداخت')}
            </AppContext.Consumer>
            {this.state.paymentdocument !== null ?
                <Card className="h-100">
                    <FalconCardHeader title={"نحوه پرداخت  /فاکتور شماره: " + this.state.Header.ID} light={false} >
                        {MoneyFormat(this.state.Header.total)}
                        <span> مبلغ قابل پرداخت</span>
                        <Badge color={this.state.Header.state === 'O30E12C63I1' ? 'primary' :
                            (this.state.Header.state === 'O30E12C63I2' ? 'warning' : 'success')}>
                            {this.state.Header.state === 'O30E12C63I1' ? 'ایجاد شده' :
                                (this.state.Header.state === 'O30E12C63I2' ? 'در انتظار تایید' : 'تایید شده')}
                        </Badge>
                    </FalconCardHeader>
                    <CardBody className="bg-light">
                        <Row >
                            <Col>
                                {(this.state.ActiveMethod & 1) === 1 ? <>
                                    <CustomInput
                                        type="radio"
                                        id="online"
                                        value={1}
                                        checked={this.state.ActiveMethod & 1 === parseInt(this.state.paymentdocument.PaymentType)}
                                        onChange={({ target }) => this.ChangeValue(target.value, 'PaymentType')}
                                        label={
                                            <span className="d-flex align-items-center">
                                                <span className="fs-1 text-nowrap">پرداخت آنلاین</span>
                                            </span>
                                        }
                                    />
                                    <p className="fs--1 mb-4">جهت اقدام به پرداخت آنلاین یکی از درگاه های زیر را انتخاب نمایید</p>
                                    {(this.state.ActiveMethod & 1) === parseInt(this.state.paymentdocument.PaymentType) ?
                                        <Row className='m-4'>
                                            <Col xs="auto">
                                                <CustomInput
                                                    type="radio"
                                                    id="banksepah"
                                                    value={1}
                                                    checked={this.state.selectedBank === 1}
                                                    onChange={({ target }) => {
                                                        this.setState({ ...this.state, selectedBank: parseInt(target.value) })
                                                        this.ChangeValue('sepah', 'ReciverAccount')
                                                    }}
                                                    label={
                                                        <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconSepah} height={60} alt="بانک سپه" />
                                                    }
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <CustomInput
                                                    type="radio"
                                                    id="bankmelat"
                                                    value={2}
                                                    checked={this.state.selectedBank === 2}
                                                    onChange={({ target }) => {
                                                        this.setState({ ...this.state, selectedBank: parseInt(target.value) })
                                                        this.ChangeValue('mellat', 'ReciverAccount')
                                                    }}
                                                    label={
                                                        <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconMellat} height={60} alt="بانک ملت" />
                                                    }
                                                />
                                            </Col>
                                        </Row> : null}
                                </> : null}
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Flex justify="end" align="end">
                            {this.state.Working ? <Spinner /> :
                                (this.state.Header?.state !== 'O30E12C63I3' ? <>
                                    {
                                        this.isadmin && Utility.IsInstanceID(this.state.paymentdocument.ID) ? <ButtonGroup>
                                            <Button color='success' onClick={this.HeaderState.bind(this, 'O30E12C63I3')} >تایید پرداخت</Button>
                                        </ButtonGroup> : null
                                    }
                                    <Button color='primary' style={{ minWidth: '150px' }}
                                        onClick={async () => {
                                            this.setState({
                                                ...this.state,
                                                Working: true
                                            })
                                            await BankController.GetToken(this.state.Header.total, this.state.Header.ID);
                                            this.setState({
                                                ...this.state,
                                                Working: false
                                            })
                                        }}  >پرداخت</Button>
                                </> : null)
                            }
                        </Flex>
                    </CardFooter>
                </Card> : null}
        </>);
    }
}