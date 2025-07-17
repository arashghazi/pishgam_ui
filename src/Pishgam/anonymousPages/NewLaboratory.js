import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardFooter, CardTitle, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Flex from '../../components/common/Flex'
import { Utility } from '../../Engine/Common'
import { ThemeCardHeader, ThemeDivider } from '../../EngineForms/ThemeControl'
import Logo from '../Logo'
import HeaderFooter from './HeaderFooter'

const NewLaboratory = ({ location, match }) => {
    const [notrobot, setNotrobot] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setUpdateFormData] = useState({});
    const [checkValidations, setCheckValidations] = useState(false);
    const [sent, setSent] = useState(false);
    const handleChange = (e) => {
        setUpdateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    };
    const onChange = (value) => {
        if (value)
            setNotrobot(true)
        else if (value === null)
            setNotrobot(false);
    }
    const SendData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setCheckValidations(undefined);
        let flag = false;
        Object.keys(formData).map((key) => {
            if (key !== 'laboratoryecoNo' && formData[key] === '')
                flag = true;
        })
        if (Object.keys(formData).length > 13 && !flag) {
            let result = await Utility.SendMali(formData);
            if (result) { setSent(true); }
            else { toast.error('ارتباط با سرور امکان پذیر نمی باشد'); }
        }
        setLoading(false);

    }
    return (
        <HeaderFooter location={location} match={match} >

            <Logo width={100} />
            <div className='mb-1' />
            {sent ? <Flex justify={'center'} >
                <Card style={{ width: '60%' }}>
                    <CardFooter />
                    <Flex justify={'center'}>
                        <CardTitle>همکار گرامی به سامانه EQAS Online خوش آمدید</CardTitle>
                    </Flex>
                    <CardBody>
                        حداکثر ظرف 48 ساعت آینده پس از تکمیل فرم عضویت، به آزمایشگاه کد اختصاصی تعلق گرفته و میتوانید از طریق آدرس {<a href='/login'>eqasonline.ir</a>} با وارد کردن شماره موبایل  ( مسئول فنی) و انتخاب رمز عبور ( طبق مشخصات خواسته شده) وارد سامانه شده و ثبت نام دوره ها را انجام دهید.
                    </CardBody>
                    <CardFooter>
                        <Flex justify={'center'}>
                            <Button color='primary' to='/' tag={Link}>بازگشت به صفحه اصلی</Button>
                        </Flex>
                    </CardFooter>
                </Card>
            </Flex> :
                <Flex justify={'center'}>
                    <Card style={{ width: '80%' }}>
                        <ThemeCardHeader title='ثبت نام آزمایشگاه جدید'>
                        </ThemeCardHeader>
                        <CardBody>
                            <Form>
                                <ThemeDivider>مشخصات مسئول آزمایشگاه</ThemeDivider>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="name">
                                                نام(مسئول)
                                            </Label>
                                            <Input
                                                id="name" invalid={checkValidations ?? !formData.name}
                                                name="name"
                                                placeholder="نام"
                                                type="text" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد نام اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="lastName">
                                                نام خانوادگی (مسئول)
                                            </Label>
                                            <Input
                                                id="lastName" invalid={checkValidations ?? !formData.lastName}
                                                name="lastName"
                                                placeholder="نام خانوادگی"
                                                type="text" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد نام خانوادگی اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="mobile">
                                                تلفن همراه
                                            </Label>
                                            <Input
                                                id="mobile" invalid={checkValidations ?? !formData.mobile}
                                                name="mobile"
                                                placeholder="تلفن همراه"
                                                type="text" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد تلفن همراه اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <ThemeDivider>مشخصات آزمایشگاه</ThemeDivider>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryName">
                                                نام آزمایشگاه
                                            </Label>
                                            <Input
                                                id="laboratoryName" invalid={checkValidations ?? !formData.laboratoryName}
                                                name="laboratoryName"
                                                placeholder="آزمایشگاه و پاتوبیولوژی رازی" onChange={handleChange}
                                            /><FormFeedback>
                                                فیلد نام آزمایشگاه اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryType">
                                                نوع آزمایشگاه
                                            </Label>
                                            <Input
                                                id="laboratoryType" invalid={checkValidations ?? !formData.laboratoryType}
                                                name="laboratoryType"
                                                placeholder="پاتو بیولوژی..." onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد نوع آزمایشگاه اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryUni">
                                                دانشگاه
                                            </Label>
                                            <Input
                                                id="laboratoryUni" invalid={checkValidations ?? !formData.laboratoryUni}
                                                name="laboratoryUni"
                                                placeholder="دانشگاه شهید بهشتی" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد دانشگاه اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryOwnerType">
                                                نوع مالکیت
                                            </Label>
                                            <Input
                                                id="laboratoryOwnerType" invalid={checkValidations ?? !formData.laboratoryOwnerType}
                                                name="laboratoryOwnerType"
                                                placeholder="خصوصی" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد نوع مالکیت اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryNo">
                                                کد ملی
                                            </Label>
                                            <Input
                                                id="laboratoryNo" invalid={checkValidations ?? !formData.laboratoryNo}
                                                name="laboratoryNo"
                                                placeholder="کد ملی" onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد کد ملی اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryecoNo">
                                                کد اقتصادی
                                            </Label>
                                            <Input
                                                id="laboratoryecoNo"
                                                name="laboratoryecoNo"
                                                placeholder="کد اقتصادی" onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <ThemeDivider>مشخصات تماس</ThemeDivider>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="laboratoryphone">
                                                تلفن
                                            </Label>
                                            <Input
                                                dir='ltr'
                                                id="laboratoryphone" invalid={checkValidations ?? !formData.laboratoryphone}
                                                name="laboratoryphone"
                                                placeholder='021 88058345-6' onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد تلفن اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="laboratoryEmail">
                                                ایمیل
                                            </Label>
                                            <Input
                                                dir='ltr'
                                                id="laboratoryEmail" invalid={checkValidations ?? !formData.laboratoryEmail}
                                                name="laboratoryEmail"
                                                placeholder='laboratoryoratory@gmail.com' onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد ایمیل اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="laboratoryState">
                                                استان
                                            </Label>
                                            <Input
                                                id="laboratoryState" invalid={checkValidations ?? !formData.laboratoryState}
                                                name="laboratoryState"
                                                placeholder='تهران' onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد استان اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="laboratoryCity">
                                                شهر
                                            </Label>
                                            <Input
                                                id="laboratoryCity" invalid={checkValidations ?? !formData.laboratoryCity}
                                                name="laboratoryCity"
                                                placeholder='تهران' onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد شهر اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="laboratoryZip">
                                                کدپستی
                                            </Label>
                                            <Input
                                                id="laboratoryZip" invalid={checkValidations ?? !formData.laboratoryZip}
                                                name="laboratoryZip"
                                                placeholder='1234567890' onChange={handleChange}
                                            />
                                            <FormFeedback>
                                                فیلد کدپستی اجباری می باشد
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <FormGroup>
                                    <Label for="laboratoryAddress">
                                        آدرس
                                    </Label>
                                    <Input
                                        id="laboratoryAddress" invalid={checkValidations ?? !formData.laboratoryAddress}
                                        name="laboratoryAddress"
                                        placeholder='تهران، ملاصدرا خیابان میرزای شیرازی ...'
                                        onChange={handleChange}
                                    />
                                    <FormFeedback>
                                        فیلد آدرس اجباری می باشد
                                    </FormFeedback>
                                </FormGroup>
                                <CardFooter>
                                    <Flex justify={'end'}>
                                        {notrobot ? (loading ? <Spinner /> : <Button type='submit' color='primary' onClick={SendData}>
                                            ارسال مشخصات
                                        </Button>) :
                                            <ReCAPTCHA style={{ visibility: notrobot ? 'hidden' : 'visible' }}
                                                sitekey="6Legy0YgAAAAAG0BR50_6qw6t4tmdmxvXdxSJWtR"
                                                onChange={onChange}
                                            />
                                        }
                                    </Flex>
                                </CardFooter>
                            </Form>
                        </CardBody>
                    </Card>
                </Flex>}
            <div style={{ height: 50 }} />
            {sent ? <div style={{ height: 250 }} /> : null}
        </HeaderFooter>
    )
}

export default NewLaboratory