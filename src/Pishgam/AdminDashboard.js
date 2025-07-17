import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, CardBody, CardFooter, CardGroup, Col, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Avatar from '../assets/img/illustrations/lab.png';
import Flex from '../components/common/Flex';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import { Utility } from '../Engine/Common';
import RelationController from '../Engine/RelationController';
import { ThemeCardHeader, ThemeDivider } from '../EngineForms/ThemeControl';
import PeriodStats from './SectionStatus/PeriodStats';
import OnlineUser from './OnlineUser';
import Logo from '../Pishgam/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'jalali-moment'
import linechart from '../assets/img/pishgam/line-chart.png'
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
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
                            <Logo style={{ opacity: 1 }} />
                        </Col>
                        <Col xs='auto' className='pr-0'>
                            <p className='pb-0 mb-0 pt-2'><strong>راهبر گرامی خوش آمدید</strong></p>
                            <small> سامانه آنلاین برنامه ارزیابی خارجی کیفیت</small>
                        </Col>
                        <Col className='d-xl-inline d-lg-inline' style={{ display: 'none' }}>
                            <img src={linechart} style={{ height: '60px', marginRight: -38 }} />

                        </Col>
                    </Row>
                </Col>
                <Col lg='6' md='6' sm={12} className=' d-flex align-items-center justify-content-end' >
                    {time ? <>
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
const AdminDashboard = () => {
    useEffect(() => {
        const fetch = async () => {
            let temp = await Utility.ActiveUsers();
            setUsersList([temp]);
        }
        fetch();
    }, [])

    const [list, setList] = useState([])
    const [usersList, setUsersList] = useState([])
    const Person = {
        col: "12",
        pid: 'Person',
        controlType: "SearchControl",
        title: "نام یا شماره موبایل",
        source: 'E11C8'
    };
    const PersonChanged = async (value) => {
        let data = {};
        data.baseID = value;
        data.relationTypeID = 'E0C12I1';
        let related = await RelationController.GetRelationBaseAsync(data);
        setList(related.dependencyIDes);
    }
    return (<>

        <Welcome />
        <CardGroup >
            <Card className='mr-2'  >
                <ThemeCardHeader title='آزمایشگاه های مرتبط' >
                    <JoiSearchBox Control={Person}
                        TitleFree={true} NoEmptyValue
                        operator={`like N'%{#}%'`}
                        type={Person.source} onChange={PersonChanged} 
                        PID={Person.pid} placeHolder={Person.title} />
                </ThemeCardHeader>
                <CardBody className='p-0'>
                    {list?.length > 0 ?
                        <ListGroup style={{ height: '320px', overflow: 'auto' }}>
                            {
                                list?.map((item) => <ListGroupItem action tag='a'
                                    href={"/O30E23C6F0V1/" + item.id} numbered='true'
                                    key={item.id} >
                                    {item?.display}
                                </ListGroupItem>)
                            }
                        </ListGroup> : <>
                            <Flex align='end' className='mt-2' justify='center'>
                                <div className="avatar avatar-5xl ">
                                    <img className="rounded-circle" src={Avatar} alt="" />
                                </div>

                            </Flex>
                            <Label className='m-4'  >
                                جهت بررسی آزمایشگاه های یه فرد در قسمت جستجو نام، نام خانوادگی ویا شماره موبایل شخص را وارد نمایید پس از نمایش آزمایشگاهای مرتبط به آن شخص برروی آزمایشگاه کلیک نمایید.
                            </Label></>
                    }
                </CardBody>
                <CardFooter className='bg-light'>
                    تعداد:&nbsp;{list?.length}
                </CardFooter>
            </Card>
            <OnlineUser />
        </CardGroup>
        <ThemeDivider />
        <PeriodStats />

    </>
    )
}

export default AdminDashboard;