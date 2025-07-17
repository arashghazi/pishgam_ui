import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Row, Col, FormGroup, Input, CustomInput, Label, Tooltip } from 'reactstrap';
import { AuthenticationController } from '../Engine/Authentication';
import { Link, useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Utility } from '../Engine/Common';

const LoginForm = ({ setRedirect, hasLabel, layout }) => {
    let history = useHistory();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [orgList, setOrgList] = useState([]);
    const [notrobot, setNotrobot] = useState(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipOpenpass, setTooltipOpenpass] = useState(false);
    const selectedChanged = (event) => {
        let selOrg = orgList.find(x => x.id === event.target.value);
        localStorage.setItem('org', JSON.stringify(selOrg));

        history.replace("/");
        window.location.reload(false);
    }
    
    const HandelLogin = async (e) => {
        if (notrobot) {
            e.preventDefault();
            setIsDisabled(true);
            if (!Utility.Pasword(password)) {
                setTooltipOpenpass(true);
            }
            else {
                let autenResult = await AuthenticationController.Login(userName, password,undefined,notrobot);
                if (autenResult === false) {
                    setIsDisabled(false);
                    toast.error(`نام کاربری یا کلمه عبور اشتباه است`);
                }
                else if (autenResult) {
                    let userInfo = localStorage.getItem('user-info');
                    userInfo = JSON.parse(userInfo);
                    if (userInfo?.organizations.length === 1) {
                        localStorage.setItem('org', JSON.stringify(userInfo?.organizations[0]));
                        history.replace("/");
                        window.location.reload(false);
                    }
                    else {
                        setOrgList(userInfo?.organizations);
                    }
                    // history.push("/");
                    // window.location.reload(false);
                }
            }
        }
    };

    useEffect(() => {
        setIsDisabled(!userName || !password);
    }, [userName, password]);
    const onChange = (value) => {
            setNotrobot(value)
    }
    return (<>
        {
            orgList.length > 0 ? <Input
                className="form-control-sm form-control"
                type="select"
                onChange={selectedChanged}
            >
                <option key={'None'} value={'None'}>
                    لطفا یک آزمایشگاه را انتخاب فرمایید
                </option>
                {
                    orgList.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.display}
                            </option>
                        );
                    })
                }
            </Input>
                :
                (<>
                    <h5 className={'mb-3 text-100'}>فرم ورود به سامانه</h5>
                    <div >
                        <FormGroup>
                            {hasLabel && <Label>نام کاربری</Label>}
                            <Tooltip style={{ backgroundColor: 'red' }} isOpen={tooltipOpen} target="username" >
                                همکار محترم در این قسمت شماره موبایل را وارد نمایید!
                            </Tooltip>
                            <Input id='username'
                                placeholder={!hasLabel ? 'نام کاربری' : ''}
                                value={userName}
                                onChange={({ target }) => {
                                    if (target.value.toLowerCase().includes('pi'))
                                        setTooltipOpen(true);
                                    else
                                        setTooltipOpen(false);


                                    setUserName(target.value)
                                }}
                                type="Phone"
                            />
                        </FormGroup>
                        <FormGroup>
                            {hasLabel && <Label>کلمه عبور</Label>}
                            <Tooltip style={{ backgroundColor: 'red' }} isOpen={tooltipOpenpass} target="password" >
                                همکار محترم لطفا در وارد کردن پسورد دقت لازم را بفرمایید
                            </Tooltip>
                            <Input maxLength={19}
                                id='password'
                                placeholder={!hasLabel ? 'کلمه عبور' : ''}
                                value={password}
                                onChange={({ target }) =>{ 
                                    setTooltipOpenpass(false);
                                    setPassword(target.value);
                                }}
                                type="password"
                            />
                        </FormGroup>
                        <Row className="justify-content-between align-items-center">
                            <Col xs="auto">
                                <CustomInput
                                    id="customCheckRemember"
                                    label="بخاطر سپردن"
                                    checked={remember}
                                    onChange={({ target }) => setRemember(target.checked)}
                                    type="checkbox"
                                />
                            </Col>
                            <Col xs="auto">
                                <Link className="fs--1" style={{ color:'white'  }} to={`/authentication/forget-password`}>
                                    تغییر کلمه عبور
                                </Link>
                            </Col>
                        </Row>
                        {notrobot!==null ? <FormGroup>
                            <Button color="primary" onClick={HandelLogin} block className="mt-3" disabled={isDisabled}>
                                ورود
                            </Button>
                        </FormGroup> : null}
                        <ReCAPTCHA style={{ visibility: notrobot ? 'hidden' : 'visible' }}
                            sitekey="6Legy0YgAAAAAG0BR50_6qw6t4tmdmxvXdxSJWtR"
                            onChange={onChange}
                        />


                        {/* <hr /> */}
                        {/* <FormGroup>
                            <Button color="primary" block className="mt-3" >
                                ثبت نام
                            </Button>
                        </FormGroup> */}
                    </div> </>)
        }
    </>);
};

LoginForm.propTypes = {
    layout: PropTypes.string,
    hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
    layout: 'basic',
    hasLabel: true
};

//export default withRedirect(LoginForm);
export default LoginForm;
