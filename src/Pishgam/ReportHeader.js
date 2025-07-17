import React, { useEffect, useState } from 'react';
import { CardBody, CardFooter, Col, Label, Row } from 'reactstrap';
import pishgamLogo from '../assets/img/logos/pg-logo.png'
import Logo1 from '../assets/img/logos/1.png'
import Logo2 from '../assets/img/logos/2.png'
import iscal from '../assets/img/logos/iscal.png'
import { ThemeDivider } from '../EngineForms/ThemeControl'
import BaseInstance from '../Engine/BaseInstance';
import { InstanceController } from '../Engine/InstanceController';
import NoData from './NoData';
const ReportHeader = React.forwardRef((props, ref) => {
    const { Section, Labratoary, Sample, children,style,period,noData } = props;
    const [base, setBase] = useState();
    useEffect(() => {
        const fetch = async () => {
            let instance;
            if (!Sample?.Instance) {
                instance = await InstanceController.LoadInstanceAsync(Sample.id);
            }
            else {
                instance = Sample?.Instance?.Instance ?? Sample?.Instance;
            }
            let tempBase = new BaseInstance(instance);
            setBase(tempBase);
        }
        if(Sample)
        fetch();

    }, [props])

    return (<div style={style}>
        <CardBody ref={ref} >
            <Row>
                <Col xs='2'>
                    <img src={pishgamLogo} width='80px' alt='pishgam logo' />
                </Col>
                <Col >
                    <Row>
                        <Col className='p-0'>
                            <h4 style={{ textAlign: 'center' }} className='mb-3'>گزارش ارزیابی خارجی کیفیت {Section}</h4>
                        </Col>
                        <Col xs='3' style={{ textAlign: 'end' }}>
                            <img src={iscal} width='45px' alt='iscal' />
                            <img src={Logo1} width='45px' alt='logo1' />
                            <img src={Logo2} width='45px' alt='logo2'/>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: 'start' }} >
                        <Col>
                            <Label>آزمایشگاه: </Label>&nbsp;
                            <Label ><strong> {Labratoary}</strong></Label>
                        </Col>
                        {base?<Col>
                            <Label > {base?.GetValue('P3', true)?.DIS ?? ''}</Label>&nbsp;
                            <Label>نمونه: &nbsp;</Label>
                            <Label ><strong> {base?.GetValue('P156') ?? ''}</strong></Label>
                        </Col>:<Col>
                            <Label>دوره: </Label>&nbsp;
                            <Label ><strong> {period}</strong></Label>
                        </Col>}
                    </Row>
                </Col>
            </Row>
            <ThemeDivider />
        </CardBody>
        <CardBody>{noData?<NoData title='برای این نمونه پاسخنامه ای یافت نشد' />:children}</CardBody>
        <CardFooter>

        </CardFooter>
    </div> );
});

export default ReportHeader;