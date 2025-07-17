import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Section from '../components/common/Section';
import LoginForm from '../Pishgam/LoginForm';
import Logo from '../Pishgam/Logo';

const AuthBasicLayout = () => (
    <Section className="py-0">
        <Row className="flex-center min-vh-100 py-6">
            <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
                <Logo />
                <Card>
                    <CardBody className="fs--1 font-weight-normal p-5">
                        <LoginForm />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Section>
);

export default AuthBasicLayout;
