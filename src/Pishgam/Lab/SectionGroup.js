import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {  Card, CardBody, CardHeader } from 'reactstrap';
import Flex from '../../components/common/Flex';
import {  ArrowLeft, ArrowRight } from "lucide-react";


const SectionGroup = ({ section,icon }) => {
    const [mouseIn,setMouseIn]=useState(false);
    return (
        
        <Card className="mb-3"
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
        style={{boxShadow: mouseIn ? '0px 4px 15px rgba(0, 0, 0, 0.8)' : '0px 2px 10px rgba(0, 0, 0, 0.1)',  minWidth: '16rem', minHeight: '15rem' }}  >
            <CardHeader style={{ backgroundColor: section.color }}>
                <h5 >
                    {icon}
                    {section.display}
                </h5>
            </CardHeader>
            <CardBody className="position-relative" style={{ backgroundColor:'#f8f9fa' }}>
                <p > {section.comment}</p>
            </CardBody>
            <Flex justify={'end'} align={'end'} className='m-3'>
                    <Link to={`/section/${section.id}`}
                    style={{opacity:mouseIn?1:0.6}}>ثبت نتایج<ArrowLeft/></Link>
            </Flex>
        </Card>
    );
};

export default SectionGroup;