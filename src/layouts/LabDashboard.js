import React, { useEffect, useState } from 'react';
import { Card, Col, Row, CardBody } from 'reactstrap';
import { useContext } from 'react';
import AppContext from '../context/Context';
import Logo from '../Pishgam/Logo';
import linechart from '../assets/img/pishgam/line-chart.png'
import moment from 'jalali-moment'
import { Utility } from '../Engine/Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { SectionGroups } from '../Pishgam/ConstIdes';
import SectionGroup from '../Pishgam/Lab/SectionGroup';
import Flex from '../components/common/Flex';
import { Droplet, TestTube, Bug, Dna, DnaOff, Microscope } from "lucide-react";
import SurveyCard from '../Pishgam/Lab/SurveyCard';
import { SurveyInstance } from '../Pishgam/survey/SurveyInstance';
import Parameters from '../Engine/Parameters';
const Welcome = () => {
    const [time, setTime] = useState();
    useEffect(() => {
        const LoadActiveParts = async () => {
            setTime((await Utility.GetNow()).date);
        }
        LoadActiveParts();
    }, [])
    return <Card style={{ opacity: 0.85 }} className='shadow-none mb-2' >
        <CardBody>
            <Row>
                <Col lg='6' md='6' sm={12}>
                    <Row>
                        <Col xs='auto' className='pr-0'>
                            <a
                                className="text-white opacity-85"
                                href="https://eqas.ir/"
                                target="https://eqas.ir/"
                                rel="noopener noreferrer"
                                style={{ fontSize: '9px' }}
                            >
                                <Logo style={{ opacity: 1 }} />
                            </a>
                        </Col>
                        <Col xs='auto' className='pr-0'>
                            <p className='pb-0 mb-0 pt-2'><strong>خوش آمدید</strong></p>
                            <small> سامانه آنلاین برنامه ارزیابی خارجی کیفیت</small>
                        </Col>
                        <Col className='d-xl-inline d-lg-inline' style={{ display: 'none' }}>
                            <img src={linechart} style={{ height: '60px', marginRight: -38 }} />

                        </Col>
                    </Row>
                </Col>
                <Col lg='6' md='6' sm={12} className=' d-flex align-items-center justify-content-end' >
                    {time ? <>
                        <a className='pr-2 pl-2' href='https://eqas.ir/wp-content/uploads/2023/04/Report-viewing-guide.pdf'>راهنمای مشاهده گزارشات</a>
                        <FontAwesomeIcon icon={faCalendar} className='mr-2' />
                        <small className='pr-2'>تاریخ امروز:</small>
                        <strong>{moment(time, 'MM/DD/YYYY')
                            .locale('fa')
                            .format('YYYY/M/D')}</strong>
                    </> : null}
                </Col>
            </Row>
        </CardBody>
    </Card>;
}


export const LabRegister = () => {
    return (
        <Card className='mb-2'>
            <CardBody>
                <Flex justify={'center'}>
                    <Row>
                        <Col className='d-xl-inline d-lg-inline' style={{ display: 'none' }}>
                            <img src={linechart} style={{ height: '60px', marginLeft: -38 }} />
                        </Col>
                        <Col xs='auto' className='pr-0'>

                            <h4 className='mt-3'><a href='https://eqasonline.ir/downloads/brochure.pdf'>جهت ثبت نام دوره های سال 1404 بر روی این لینک کلیک نمایید</a></h4>
                        </Col>
                        <Col className='d-xl-inline d-lg-inline' style={{ display: 'none' }}>
                            <img src={linechart} style={{ height: '60px', marginRight: -38 }} />

                        </Col>
                    </Row>

                </Flex>
            </CardBody>
        </Card>
    )
}

const LabDashboard = () => {
    const [full, setFull] = useState(false);
    const { setCurrentTitle } = useContext(AppContext);
    const [hasSurveyResult, setSurveyResult] = useState();
    const pageName = 'صفحه اصلی';
    useEffect(() => {
        const getOrgId=async()=>{
            var org = await Parameters.GetValue('@orgid');
            return localStorage.getItem('@hasSurvey'+org) !== SurveyInstance.year.toString();
        }
        const CheckSurvey = async () => {
            var result = await SurveyInstance.HasData();
            let org = await Parameters.GetValue('@orgid');
            if (result)
                localStorage.setItem('@hasSurvey'+org, SurveyInstance.year);
        }
        const init = async () => {
            const shouldCheck = await getOrgId();
            if (shouldCheck) {
                await CheckSurvey();
            } else {
                setSurveyResult(true);
            }
        };
        init();
    }, [])
    useEffect(() => {
        const LoadActiveParts = async () => {
            setCurrentTitle(pageName);
            setFull(true)
        }
        if (!full)
            LoadActiveParts();

    })
    return (hasSurveyResult ? <>
        <Welcome />
        <LabRegister />
        <Row>
            <Col>
                <SectionGroup section={SectionGroups[0]} icon={<TestTube />} />
            </Col>
            <Col>
                <SectionGroup section={SectionGroups[1]} icon={<Droplet />} />
            </Col>
            <Col>
                <SectionGroup section={SectionGroups[5]} icon={<Microscope />} />
            </Col>
        </Row>
        <Row >
            <Col>
                <SectionGroup section={SectionGroups[2]} icon={<DnaOff />} />
            </Col>
            <Col>
                <SectionGroup section={SectionGroups[3]} icon={<Dna />} />
            </Col>
            <Col>
                <SectionGroup section={SectionGroups[4]} icon={<Bug />} />
            </Col>
        </Row>

    </> : <SurveyCard onSkip={() => setSurveyResult(true)} />
    );
};

export default LabDashboard;