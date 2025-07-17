import React, { Component } from 'react';
import Logo from '../Pishgam/Logo';
import { Badge, Button, Card, CardBody, CardFooter, Col, Row, Spinner, Table } from 'reactstrap';
import createMarkup from '../helpers/createMarkup';
import { MoneyFormat, Utility } from '../Engine/Common';
import { CartContextClass, Labratoary } from './ShopContext';
import AppContext from '../context/Context';
import NoData from '../Pishgam/NoData';
import moment from 'jalali-moment';
export default class Invoice extends Component {
    address = 'تهران، میدان ونک، خیابان ملاصدرا، ابتدای شیراز شمالی، بن بست کاج، پلاک 4، طبقه سوم کد پستی: 1991715515'
    institution = 'پیشگام ایرانیان'
    state = {
        Loading: 1,
        Data: {
            Header: {
                ID: '',
                Date: null,
                PaymentDue: 0,
                subtotal: 0,
                total: 0,
                user: {}
            },
            Details: []
        }
    }
    async componentDidMount() {
        await this.SetParameters();
    }
    async componentDidUpdate() {
        await this.SetParameters();

    }
    async SetParameters() {
        if (this.props.location.state?.Data !== undefined && this.state.Data.Header.ID !== this.props.location.state.Data.Header.ID) {
            this.setState({
                ...this.state,
                Loading: 1,
                Data: this.props.location.state.Data
            })
        }
        else if (this.props?.match?.params?.id &&
            this.state.Data.Header.ID !== this.props?.match?.params?.id) {
            let data = this.state.Data;
            data.Header.ID = this.props?.match?.params?.id;
            this.setState({
                ...this.state,
                Loading: 1,
                Data: data
            })
            data = await CartContextClass.LoadInvoice(this.props.match.params.id)
            if (Utility.IsInstanceID(data.Header.ID)) {
                if (Utility.IsInstanceID(data.Header.user)) {
                    data.Header.Customer = await Labratoary.LoadAsync(data.Header.user);
                }
                this.setState({
                    ...this.state,
                    Loading: 0,
                    Data: data
                });
            }
            else {
                this.setState({
                    ...this.state,
                    Loading: 2,
                });
            }
        }
    }

    render() {
        let invoice = this.state.Data;
        return (<><AppContext.Consumer>
            {({ setCurrentTitle }) => setCurrentTitle('پیش فاکتور')}
        </AppContext.Consumer>

            {this.state.Loading===1 ? <Spinner /> :(
                this.state.Loading===0 ?<Card className='p-2'>
                    <CardBody>
                        <Row className="align-items-center text-center mb-3" >
                            <Col className="text-sm-left mt-3 mt-sm-0">
                                <h2 className="mb-3">پیش فاکتور</h2>
                                <h5>{this.institution}</h5>
                                {this.address && <p className="fs--1 mb-0"
                                    dangerouslySetInnerHTML={createMarkup(this.address)} />}
                            </Col>
                            <Col sm={2} className="text-sm-right">
                                <Logo />
                            </Col>
                            <Col xs={12}>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="justify-content-between align-items-center">
                            <Col>
                                <h6 className="text-500">جهت ارائه به</h6>
                                <h5>{invoice.Header.Customer?.Name}</h5>
                                <p className="fs--1" dangerouslySetInnerHTML={createMarkup(invoice.Header.Customer?.Address)} />
                                <h6>کد اقتصادی:
                                    <strong className="fs--1" >{invoice.Header.Customer?.EcoCode}</strong>
                                </h6>
                                {invoice.Header.Customer?.NationalCode ? <h6>کد ملی:
                                    <strong className="fs--1" >{invoice.Header.Customer?.NationalCode}</strong>
                                </h6> : null}
                                <h6>کد آزمایشگاه:
                                    <strong>{invoice.Header.Customer?.OldCode}</strong>
                                </h6>
                                <p className="fs--1">
                                    شماره تماس:
                                    <a href={`tel:${invoice.Header.Customer?.Tel?.split('-')?.join('')}`}>{invoice.Header.Customer?.Tel}</a>
                                </p>
                            </Col>
                            <Col sm="auto" className="ml-auto">
                                <div className="table-responsive">
                                    <Table size="sm" borderless className="fs--1">
                                        <tbody>
                                            <tr>
                                                <th className="text-sm-right">شماره فاکتور:</th>
                                                <td>{invoice.Header.ID}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-sm-right">تاریخ فاکتور:</th>
                                                <td>{ moment(invoice.Header.Date, 'MM/DD/YYYY')
                                                .locale('fa').format('YYYY/M/D')}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-sm-right">مبلغ پرداخت شده:</th>
                                                <td>{MoneyFormat(invoice.Header.PaymentDue)}</td>
                                            </tr>
                                            <tr className="alert-success font-weight-bold">
                                                <th className="text-sm-right">مانده قابل پرداخت</th>
                                                <td>{MoneyFormat(invoice.Header.total - invoice.Header.PaymentDue)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Col>
                                        {this.state.Data.Header.state === 'O30E12C63I5' ? <>
                                            <Badge color='danger'><strong>ابطال شده</strong></Badge>
                                        </> : <>
                                            <Button className='btn-block' color={
                                                this.state.Data.Header.state === 'O30E12C63I1' ? 'primary' :
                                                    (this.state.Data.Header.state === 'O30E12C63I2' ? 'warning' : 'success')
                                            }
                                                onClick={() => {
                                                    this.props.history.push('/e-commerce/payment/' + this.state.Data.Header.ID)
                                                }}
                                            >پرداخت</Button>

                                            {this.state.Data.Header.state !== 'O30E12C63I4' &&
                                                this.state.Data.Header.state !== 'O30E12C63I3' &&
                                                this.state.Data.Header.state !== 'O30E12C63I2' ? <><hr />
                                                <Button className='btn-block' color='danger'
                                                    onClick={async () => {
                                                        this.state.Data.Header.state = 'O30E12C63I5';
                                                        let result = await this.state.Data.Header.SaveAsync();
                                                        if (result)
                                                            this.setState({
                                                                ...this.state,
                                                                Data: { ...this.state.Data }
                                                            })
                                                    }}
                                                >ابطال</Button></> : null}</>}
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="table-responsive mt-4 fs--1">
                                <Table striped className="border-bottom">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th className="border-0">شرح خدمات</th>
                                            <th className="border-0 text-center">تعداد</th>
                                            <th className="border-0 text-right">مبلغ</th>
                                            <th className="border-0 text-right">مجموع</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.Details &&
                                            invoice.Details.map((invoicerow, index) => {
                                                console.log(invoicerow, invoicerow.productobject)
                                                //let prod = invoicerow.productobject;
                                                return (
                                                    <tr key={index}>
                                                        <td className="align-middle">
                                                            <h6 className="mb-0 text-nowrap">{invoicerow.productobject?.title}</h6>
                                                            <p className="mb-0">{invoicerow.productobject?.description}</p>
                                                        </td>
                                                        <td className="align-middle text-center">{invoicerow.quantity}</td>
                                                        <td className="align-middle text-right">{MoneyFormat(invoicerow.realPrice)}</td>
                                                        <td className="align-middle text-right">{MoneyFormat(invoicerow.total)}</td>
                                                    </tr>)
                                            })}
                                    </tbody>
                                </Table>
                            </div>
                        </Row>
                        <Row noGutters className="justify-content-end">
                            <Col xs="auto">
                                <Table size="sm" borderless className="fs--1 text-right">
                                    <tbody>
                                        <tr>
                                            <th className="text-900">جمع فاکتور:</th>
                                            <td className="font-weight-semi-bold">{MoneyFormat(invoice.Header.subtotal)}</td>
                                        </tr>
                                        <tr className="border-top">
                                            <th className="text-900">جمع کل:</th>
                                            <td className="font-weight-semi-bold">{MoneyFormat(invoice.Header.total)}</td>
                                        </tr>
                                        <tr className="border-top border-2x font-weight-bold text-900">
                                            <th>قابل پرداخت:</th>
                                            <td>{MoneyFormat(invoice.Header.total - invoice.Header.PaymentDue)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className="bg-light">
                        <p className="fs--1 mb-0">
                            <strong>توجه : </strong>شرایط ثبت نام را خواندام و کاملا با آن موافقم
                        </p>
                    </CardFooter>
                </Card>:<NoData title='این شماره فاکتور یافت نشد'/>)
            }</>
        )
    }
}
