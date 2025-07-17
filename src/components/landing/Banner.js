import React from 'react';
import Typed from 'react-typed';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import bg1 from '../../assets/img/generic/bg-1.jpg';
import dashboard from '../../assets/img/generic/dashboard-alt-light1.jpg';

import Section from '../common/Section';

const Banner = () => {
  return (
    <Section className="py-0 overflow-hidden" image={bg1} position="center bottom" overlay>
      <Row className="justify-content-center align-items-center pt-8 pt-lg-10 pb-lg-9 pb-xl-0">
        <Col md={11} lg={8} xl={4} className="pb-7 pb-xl-9 text-center text-xl-left">
          <Button disabled tag={Link} color="outline-danger" className="mb-4 fs--1 border-2x rounded-pill" to="/register">
            <span className="mr-2" role="img" aria-label="Gift">
              🎁
            </span>
            عضویت آزمایشگاه جدید
          </Button>
          <h3 className="text-white font-weight-bold">
            ارزیابی خارجی کیفیت
            <br />
            پیشگام ایرانیان
            <br />
            </h3>
          <h3 className="text-white font-weight-light">
            <br />
            بخش&nbsp;
            <Typed
              strings={['بیوشیمی', 'هماتولوژی', 'تشخیص مولکولی', 'سرولوژی','میکروب شناسی']}
              typeSpeed={90}
              backSpeed={20}
              className="font-weight-bold pl-2"
              loop
            />
          </h3>
          <p className="lead text-white opacity-75">
آزمایشگاه های متقاضی می توانند با مطالعه جزئیات برنامه، زمان ارسال نمونه و هزینه هر برنامه موارد در خواستی خود را انتخاب نموده و ارسال فرمایند.
          </p>
          <Link className="btn btn-outline-light border-2x rounded-pill btn-lg mt-4 fs-0 py-2" to="/login">
            <FontAwesomeIcon icon="play" transform="shrink-6 down-1 right-5" />
            ورود به سامانه ارزیابی
          </Link>
        </Col>
        <Col xl={{ size: 7, offset: 1 }} className="align-self-center">
          <Link to="/" className="img-landing-banner">
            <img className="img-fluid" src={dashboard} alt="" />
          </Link>
        </Col>
      </Row>
    </Section>
  );
};

export default Banner;
