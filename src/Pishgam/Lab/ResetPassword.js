import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { Button, CardBody, CardTitle, FormGroup, Input, Label, ListGroup, ListGroupItem, Spinner, Tooltip } from 'reactstrap';
import { AuthenticationController } from '../../Engine/Authentication';
import { Utility } from '../../Engine/Common';
import { ThemeDivider } from '../../EngineForms/ThemeControl';

const TokeTimer = ({ startTime, EndTime }) => {
    const [time, setTime] = useState(startTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => {
                if (time <= 0) {
                    clearInterval(interval);
                    EndTime();
                }
                return time - 1
            });
        }, 1000);
        return () => clearInterval(interval);
    },[])
    const totime = (sec_num) => {
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return minutes + ':' + seconds;
    }
    return (
        <span>
            {totime(time)}
        </span>
    );
};

const ResetPassword = ({ history }) => {
    const [validMobile, setValidMobile] = useState();
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState();
    const [token, setToken] = useState();
    const [step, setStep] = useState(1);
    const [code, setCode] = useState();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipOpenRepass, setTooltipOpenRepass] = useState(false);
    const [notrobot, setNotrobot] = useState(false);
    const ChangeMobile = ({ target }) => {
        if (!target.value.match(/^\d+$/) && target.value)
            setTooltipOpen(true);
        else
            setTooltipOpen(false);
        if (target.value.match(/^(\+\d{1,3}[- ]?)?\d{11}$/))
            setValidMobile(target.value);
        else
            setValidMobile('')
    }
    const ChangePassword = ({ target }) => {
        setPassword(target.value);
        setTooltipOpenRepass(false);
    }
    const GetCode = async () => {
        setToken(0);
        let result = await AuthenticationController.GetCode(validMobile);

        if (result.id) {
            setToken(result.id);
            setStep(2);
        }
        else if (result.message) {
            setToken();
            toast.error(result.message)
        }
    }
    const EndTime = () => {
        setToken();
        setStep(1);
    }
    const SendCode = async () => {
        let result = await AuthenticationController.CheckChangePasswordCode(code, token);
        if (result.id) {
            setToken(result.id);
            setStep(3);
        }
        else if (result.message) {
            setToken();
            setStep(1);
            toast.error(result.message)
        }
    }
    const ChangePass = async () => {
        let result = await AuthenticationController.ChangePassword(password, token);
        if (result.message) {
            setToken();
            setStep(1);
            toast.error(result.message)
        }
        else if (result.id) {
            history.push("/");
            toast.success("کلمه عبور با موفقیت بروزرسانی شد")
        }

    }
    const onChange = (value) => {
        if (value)
            setNotrobot(true)
    }
    return (<>
        <CardTitle>تغییر کلمه عبور</CardTitle>
        <CardBody style={{ minHeight: '300px' }}>
            {step === 1 || step === 2 ? <><FormGroup>
                <Tooltip style={{ backgroundColor: 'red' }} isOpen={tooltipOpen} target="mobile" >
                    لطفا بادقت شماره موبایل را وارد نمایید
                </Tooltip>
                <Label>شماره موبایل مسئول آزمایشگاه را وارد نمایید</Label>
                <Input className={validMobile === '' ? 'border-danger' : ''}
                    id='mobile'
                    maxLength='11'
                    onChange={ChangeMobile} type='text' />
            </FormGroup>
                <ReCAPTCHA
                    sitekey="6Legy0YgAAAAAG0BR50_6qw6t4tmdmxvXdxSJWtR"
                    onChange={onChange}
                />
                {notrobot ? <Button color="primary" visible={notrobot.toString()}
                    block disabled={!validMobile} onClick={GetCode}
                    className="mt-3" >درخواست کد یکبار مصرف
                    {token === 0 ? <Spinner type='grow' /> : null}
                </Button> : null}
                <ThemeDivider /></> : null}
            {step === 2 ? <>
                <FormGroup >
                    <Label>ثبت کد {token && token !== 0 ? <TokeTimer startTime={180} EndTime={EndTime} /> : null}</Label>
                    <Input maxLength='5' onChange={({ target }) => setCode(target.value)} disabled={!validMobile} type='text' />
                </FormGroup>
                <Button color="primary"
                    block disabled={code?.length !== 5} onClick={SendCode}
                    className="mt-3" >ارسال کد
                    {token === 0 ? <Spinner type='grow' /> : null}
                </Button></> : null}
            {step === 3 ? <>
                <FormGroup>
                    <Label>کلمه عبور جدید</Label>
                    <Input onChange={ChangePassword}
                        className={password === '' ? 'border-danger' : ''} disabled={!validMobile} type='password' />
                </FormGroup>
                <ListGroup >
                    <ListGroupItem className='p-1' style={{ fontSize: '10px' }} color={password.match(/^(?=.*[a-z])/) ? 'success' : 'danger'} >
                        حروف انگلیسی (کوچک)
                    </ListGroupItem>
                    <ListGroupItem className='p-1' style={{ fontSize: '10px' }} color={password.match(/^(?=.*[A-Z])/) ? 'success' : 'danger'}>حروف انگلیسی (بزرگ)</ListGroupItem>
                    <ListGroupItem className='p-1' style={{ fontSize: '10px' }} color={password.match(/(?=.*[0-9])/) ? 'success' : 'danger'}>اعداد</ListGroupItem>
                    <ListGroupItem className='p-1' style={{ fontSize: '10px' }} color={password.match(/(?=.*[@#$%^&*])/) ? 'success' : 'danger'}>نشانه ها(@ # $ % ^ &)</ListGroupItem>
                    <ListGroupItem className='p-1' style={{ fontSize: '10px' }} color={(password.length > 7 && password.length < 20) ? 'success' : 'danger'}>تعداد بین 8 تا 19</ListGroupItem>
                </ListGroup>

                <Tooltip style={{ backgroundColor: 'red' }} isOpen={tooltipOpenRepass} target="rePassword" >
                    توجه: تمامی موارد بالا باید سبز شود تا کلمه عبور صحیح باشد
                </Tooltip>
                <FormGroup>
                    <Label>تکرار کلمه عبور جدید</Label>
                    <Input onChange={({ target }) => {
                        if (!Utility.Pasword(password)) {
                            setTooltipOpenRepass(true);
                        }
                        else{
                            setTooltipOpenRepass(false);
                        }
                        setRePassword(target.value);
                    }}
                        id='rePassword'
                        className={rePassword && rePassword !== password ? 'border-danger' : ''} type='password' />
                    {rePassword && rePassword !== password && <span className="text-danger fs--1">{"کلمه عبور باهم برابر نیست"}</span>}
                </FormGroup>
                <Button color="primary"
                    block disabled={!(password && password === rePassword)} onClick={ChangePass}
                    className="mt-3" >تغییر کلمه عبور
                    {token === 0 ? <Spinner type='grow' /> : null}
                </Button>
            </> : null}
        </CardBody>
    </>
    );
};

export default ResetPassword;