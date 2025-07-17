import React, { Component } from "react";
import { Card, CardBody, CardFooter, Col, CustomInput, Button, FormGroup, Input, Label, Row, InputGroup, InputGroupText, ButtonGroup, Badge, Spinner } from "reactstrap";
import FalconCardHeader from "../../components/common/FalconCardHeader";
import iconPaypalFull from '../../assets/img/icons/CardToCard.png';
import iconpaymentdoc from '../../assets/img/icons/paymentdoc.png';
import iconMellat from '../../assets/img/icons/mellat.png';
import iconSepah from '../../assets/img/icons/sepah.png';
import DateControl from '../../components/joi/DateControl'
import Flex from "../../components/common/Flex";
import { PaymentDocument } from "../ShopContext";
import { MoneyFormat, Utility } from "../../Engine/Common";
import { AuthenticationController } from "../../Engine/Authentication";
import AppContext from "../../context/Context";
import { BankController } from "../../Pishgam/Bank/BankController";
export default class PaymentType extends Component {
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
                                            {/* <Col xs="auto">
                                            <CustomInput
                                                type="radio"
                                                id="bankmelat"
                                                value={1}
                                                checked={this.state.selectedBank === 1}
                                                onChange={({ target }) => {
                                                    this.setState({ ...this.state, selectedBank: parseInt(target.value) })
                                                    this.ChangeValue('mellat', 'ReciverAccount')
                                                }}
                                                label={
                                                    <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconMellat} height={60} alt="بانک ملت" />
                                                }
                                            />
                                        </Col> */}
                                            <Col xs="auto">
                                                <CustomInput
                                                    type="radio"
                                                    id="banksepah"
                                                    value={2}
                                                    checked={true}//{this.state.selectedBank === 2}
                                                    onChange={({ target }) => {
                                                        this.setState({ ...this.state, selectedBank: parseInt(target.value) })
                                                        this.ChangeValue('sepah', 'ReciverAccount')
                                                    }}
                                                    label={
                                                        <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconSepah} height={60} alt="بانک سپه" />
                                                    }
                                                />
                                            </Col>
                                        </Row> : null}
                                </> : null}
                                {(this.state.ActiveMethod & 2) === 2 ? <>
                                    <CustomInput
                                        type="radio"
                                        id="card"
                                        value={2}
                                        checked={(this.state.ActiveMethod & 2 === parseInt(this.state.paymentdocument.PaymentType))}
                                        onChange={({ target }) => this.ChangeValue(target.value, 'PaymentType')}
                                        label={
                                            <span className="d-flex align-items-center">
                                                <span className="fs-1 text-nowrap">کارت به کارت</span>
                                                <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconPaypalFull} height={20} alt="" />
                                            </span>
                                        }
                                    />
                                    <p className="fs--1 mb-4">
                                        پس از انتقال وجه فاکتور بصورت کارت به کارت، مشخصات پرداخت را اینجا وارد نمایید
                                    </p>
                                    {(this.state.ActiveMethod & 2) === parseInt(this.state.paymentdocument.PaymentType) ? <div className='ml-4'>
                                        <Row >
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="amount">
                                                        مبلغ پرداخت شده
                                                    </Label>
                                                    <Input
                                                        placeholder="مبلغ پرداخت شده"
                                                        id="amount"
                                                        value={this.state.paymentdocument.Amount}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'Amount')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="cardName">
                                                        کد پیگیری
                                                    </Label>
                                                    <Input
                                                        placeholder="کد پیگیری / شناسه پرداخت"
                                                        id="cardName"
                                                        value={this.state.paymentdocument.trackNumber}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'trackNumber')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="cardNumber">
                                                        چهار رقم آخر شماره کارت
                                                    </Label>
                                                    <InputGroup>
                                                        <Input
                                                            placeholder="9999"
                                                            id="cardNumber" style={{ width: '90px' }}
                                                            value={this.state.paymentdocument.CardNumber}
                                                            maxLength={4}
                                                            onChange={({ target }) => this.ChangeValue(target.value, 'CardNumber')}
                                                        />
                                                        <InputGroupText>
                                                            XXXX XXXX XXXX
                                                        </InputGroupText>
                                                    </InputGroup>

                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="cardmeNumber">
                                                        شماره کارت
                                                    </Label>
                                                    <Input
                                                        placeholder="مبلغ پرداخت شده"
                                                        id="cardmeNumber"
                                                        type="select"
                                                        value={this.state.paymentdocument.ReciverAccount}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'ReciverAccount')}
                                                    >
                                                        <option value='mellat'>
                                                            ۶۱۰۴۳۳۷۷۷۰۰۵۰۴۴۹ بانک ملت
                                                        </option>
                                                        <option value='sepah'>
                                                            ۵۸۹۲۱۰۷۰۴۴۰۷۰۳۳۵ بانک سپه
                                                        </option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <DateControl
                                                        placeholder="John Doe"
                                                        id="time" Title='زمان واریزی'
                                                        value={this.state.paymentdocument.PaymentTime}
                                                        onChange={(value, hour) => this.ChangeValue(value + ' ' + hour, 'PaymentTime')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div> : null}

                                </> : null}
                                {(this.state.ActiveMethod & 4) === 4 ? <>
                                    <CustomInput
                                        type="radio"
                                        id="BankReceipt"
                                        value={4}
                                        checked={this.state.ActiveMethod & 4 === parseInt(this.state.paymentdocument.PaymentType)}
                                        onChange={({ target }) => this.ChangeValue(target.value, 'PaymentType')}
                                        label={
                                            <span className="d-flex align-items-center">
                                                <span className="fs-1 text-nowrap">فیش بانکی</span>
                                                <img className="d-none d-sm-inline-block ml-2 mt-lg-0" src={iconpaymentdoc} height={20} alt="" />
                                            </span>
                                        }
                                    />
                                    <p className="fs--1 mb-4">
                                        پس از پرداخت وجه فاکتور توسط بانک، اطلاعات فیش بانکی را اینجا وارد نمایید
                                    </p>

                                    {(this.state.ActiveMethod & 4) === parseInt(this.state.paymentdocument.PaymentType) ?
                                        <div className='ml-4'> <Row >
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="cardNumber">
                                                        مبلغ پرداخت شده
                                                    </Label>
                                                    <Input
                                                        placeholder="مبلغ پرداخت شده"
                                                        id="amount"
                                                        value={this.state.paymentdocument.Amount}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'Amount')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col xs='Auto' className='ml-1 mr-1'>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="paymentDoc">
                                                        شماره فیش پرداختی
                                                    </Label>
                                                    <Input
                                                        placeholder="XXXXXXXXXXXX"
                                                        id="paymentDoc"
                                                        value={this.state.paymentdocument.trackNumber}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'trackNumber')}
                                                    />
                                                </FormGroup>
                                            </Col>

                                        </Row>
                                            <Row>
                                                <Col xs='Auto' className='ml-1 mr-1'>
                                                    <FormGroup>
                                                        <Label className={this.labelClasses} for="cardmeNumber">
                                                            شماره حساب
                                                        </Label>
                                                        <Input
                                                            placeholder="شماره حساب"
                                                            id="cardmeNumber"
                                                            type="select"
                                                            value={this.state.paymentdocument.ReciverAccount}
                                                            onChange={({ target }) => this.ChangeValue(target.value, 'ReciverAccount')}
                                                        >
                                                            <option value='mellat'>
                                                                ۱۹۴۵۷۳۲۸۲۷ بانک ملت
                                                            </option>
                                                            <option value='sepah'>
                                                                ۱۲۶۴۸۰۰۲۳۴۵۱۱ بانک سپه
                                                            </option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col xs='Auto' className='ml-1 mr-1'>
                                                    <FormGroup>
                                                        <DateControl
                                                            placeholder="John Doe"
                                                            id="time" Title='زمان واریزی'
                                                            value={this.state.paymentdocument.PaymentTime}
                                                            onChange={(value, hour) => this.ChangeValue(value + ' ' + hour, 'PaymentTime')}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                        : null}
                                </> : null}
                                {(this.state.ActiveMethod & 16) === 16 ? <>
                                    <CustomInput
                                        type="radio"
                                        id="cash"
                                        value={16}
                                        checked={this.state.ActiveMethod & 16 === parseInt(this.state.paymentdocument.PaymentType)}
                                        onChange={({ target }) => this.ChangeValue(target.value, 'PaymentType')}
                                        label={
                                            <span className="d-flex align-items-center">
                                                <span className="fs-1 text-nowrap">پرداخت نقدی</span>
                                            </span>
                                        }
                                    />
                                    <p className="fs--1 mb-4">
                                        پرداخت وجه نقد
                                    </p>
                                    {(this.state.ActiveMethod & 16) === parseInt(this.state.paymentdocument.PaymentType) ?
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label className={this.labelClasses} for="cardNumber">
                                                        مبلغ پرداخت شده
                                                    </Label>
                                                    <Input
                                                        placeholder="مبلغ پرداخت شده"
                                                        id="amount"
                                                        value={this.state.paymentdocument.Amount}
                                                        onChange={({ target }) => this.ChangeValue(target.value, 'Amount')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <DateControl

                                                        id="time" Title='زمان پرداخت'
                                                        value={this.state.paymentdocument.PaymentType}
                                                        onChange={(value, hour) => this.ChangeValue(value + ' ' + hour, 'PaymentTime')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row> : null}
                                </> : null}
                                {(this.state.ActiveMethod & 8) === 8 ? <>
                                    <CustomInput
                                        type="radio"
                                        id="credit"
                                        value={8}
                                        checked={this.state.ActiveMethod & 8 === parseInt(this.state.paymentdocument.PaymentType)}
                                        onChange={({ target }) => this.ChangeValue(target.value, 'PaymentType')}
                                        label={
                                            <span className="d-flex align-items-center">
                                                <span className="fs-1 text-nowrap">پرداخت اعتباری</span>
                                            </span>
                                        }
                                    />
                                    <p className="fs--1 mb-4">
                                        تخصیص اعتبار به اندازه فاکتور انتخابی
                                    </p>
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
                                            console.log((this.state.ActiveMethod & 1))
                                            if (parseInt(this.state.paymentdocument.PaymentType) !== 1) {
                                                this.setState({
                                                    ...this.state,
                                                    Working: true
                                                })
                                                await this.state.paymentdocument.SaveAsync();
                                                let Header = this.state.Header;
                                                Header.state = 'O30E12C63I2';
                                                this.setState({
                                                    ...this.state,
                                                    Header,
                                                    Working: false
                                                })
                                            }
                                            else {
                                               await BankController.GetToken(this.state.Header.total,this.state.Header.ID)
                                            }
                                        }}  >ثبت</Button>
                                </> : null)
                            }
                        </Flex>
                    </CardFooter>
                </Card> : null}
        </>);
    }
}
PaymentType.defaultProps = {
    Amount: 0,
    Docid: ''
}
