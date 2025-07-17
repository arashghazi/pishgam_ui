import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import bg2 from '../../assets/img/generic/bg-2.jpg';
import partnerList from '../../data/partner/partnerList';
import Section from '../common/Section';
const Partner = props => (
  <Col xs={3} sm="auto" className="my-1 my-sm-3 px-card">
    <img className="landing-cta-img" {...props} alt="Partner" />
  </Col>
);
const Cta = () => (
  <Section overlay image={bg2} position="center top">
      <Row className="flex-center">
        {partnerList.map((partner, index) => (
          <Partner key={index} {...partner} />
        ))}
      </Row>
    <Row className="justify-content-center text-center">
      <Col lg={8}>
        <p className="fs-3 fs-sm-4 text-white">
          به خانواده بزرگ پیشگام ایرانیان با بیش از 2000 عضو بپیوندید
        </p>
        {/* <Button  tag={Link} color="outline-light" size="lg" to='/register' className="border-2x rounded-pill mt-4 fs-0 py-2" >
          عضویت در سامانه ارزیابی کیفیت
        </Button> */}
      </Col>
    </Row>
  </Section>
);

export default Cta;
