import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Background from '../components/common/Background';
import Flex from '../components/common/Flex';
import Section from '../components/common/Section';
import AppContext from '../context/Context';

import bgShape from '../assets/img/illustrations/bg-shape.png';
import shape1 from '../assets/img/illustrations/shape-1.png';
import halfCircle from '../assets/img/illustrations/half-circle.png';
import LoginForm from '../Pishgam/LoginForm';
import Logo from '../Pishgam/Logo';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import ResetPassword from '../Pishgam/Lab/ResetPassword';
import ErrorLayout from './ErrorLayout';
const AuthCardLayout = ({ leftSideContent }) => {
    const { isDark } = useContext(AppContext);
    let location = useLocation();
    const [blink, setBlink] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setBlink(!blink);
        }, 1000);
    })
    return (
        <>
            <Section fluid className="py-0">
                <Row noGutters className="min-vh-100 flex-center">
                    <Col lg={8} className="col-xxl-5 py-3">
                        <img className="bg-auth-circle-shape" src={bgShape} alt="" width="250" />
                        <img className="bg-auth-circle-shape-2" src={shape1} alt="" width="150" />
                        <Card className="overflow-hidden z-index-1">
                            <CardBody className="p-0">
                                <Row noGutters className="h-100">
                                    <Col md={5} className="text-white text-center bg-card-gradient">
                                        <div className="position-relative p-4 pt-md-5 pb-md-7">
                                            <Background image={halfCircle} className="bg-auth-card-shape" />
                                            <div className="z-index-1 position-relative">
                                                <Switch>
                                                    <Route path="/errors" exact component={ErrorLayout} />
                                                    <Route path="/authentication/forget-password" exact component={ResetPassword} />
                                                    <Route component={LoginForm} />
                                                </Switch>
                                            </div>
                                        </div>
                                        <div className="mt-3 mb-4 mt-md-4 mb-md-5">{leftSideContent}</div>
                                    </Col>
                                    <Col md={7} tag={Flex} align="center" justify="center">
                                        <div className="p-4 p-md-5 flex-grow-1">{
                                            <><Logo className='mb-5' />
                                                <h1 className='text-center'>EQAS</h1>
                                                <p className='text-center'>
                                                    ابزار ارتقای کیفیت آزمایشگاه های پزشکی
                                                </p><hr />
                                                {location.pathname === "/authentication/forget-password" ?
                                                    <ol>
                                                        <li>
                                                            شماره موبایل خود را وارد نمایید
                                                        </li>
                                                        <li>
                                                            من ربات نیستم را تیک بزنید(I am not robot)
                                                        </li>
                                                        <li>
                                                            بر روی دکمه "درخواست کد یکبار مصرف" کلیک نمایید
                                                        </li>
                                                        <li>
                                                            کد ارسال شده را قبل از تمام شدن مهلت وارد نموده و بر روی کلید ارسال کد کلیک نمایید
                                                        </li>
                                                        <li>
                                                            با توجه به اینکه کلمه عبور
                                                            <strong style={{ color: 'red' }}>باید</strong>
                                                            بین 8 تا 19 کاراکتر باشد و
                                                            دارای حروف انگلیسی (کوچک و بزرگ) حداقل یک عدد و حداقل یکی از نمادهای ( @ # $ % ^ & *)
                                                            باشد پسورد را وارد نمایید
                                                        </li>
                                                        <li>
                                                            در باکس بعدی همان کلمه عبور را مجدد وارد نمایید
                                                        </li>
                                                        <li>
                                                            برروی دکمه تغییر کلمه عبور کلیک نمایید
                                                        </li>
                                                    </ol> : null}
                                                {location.pathname !== "/authentication/forget-password" ? <>
                                                    <h5 style={{ color: blink?'red':'yellowgreen' }} >
                                                        توجه توجه
                                                    </h5>
                                                    <h6>
                                                        اگر نام کاربری و کلمه عبور دریافت نکرده اید ویا رمز عبور کار نمی کند
                                                        <Link className="fs--1" style={{ color: 'red' }} to={`/authentication/forget-password`}>
                                                            اینجا را کلیک 
                                                        </Link>
                                                        &nbsp;کنید
                                                    </h6>
                                                    <br />

                                                    </>
                                                    : null}
                                                <hr />
                                                <small>شماره پشتیبانی:</small>&nbsp;
                                                <small dir='ltr'> 88058345-6</small><br/>
                                                <small > جهت مشاهده گزارش های قبلی  با نام کاربری و کلمه عبور قبلی به لینک </small>
                                                    <a href='http://old.eqasonline.ir/'>old.eqasonline.ir</a>&nbsp;
                                                    <small >مراجعه فرمایید</small>
                                            </>
                                        }</div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Section>
            <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
        </>

    );
};

export default AuthCardLayout;
