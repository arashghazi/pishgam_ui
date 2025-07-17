import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Card } from 'reactstrap';
import Flex from '../../components/common/Flex';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
import CertificateComponent from '../Certificate/CertificateComponent';
import { Certificate } from '../Certificate/CertificateContext';

const LabCertificate = () => {
  const [all, setAll] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      let temp = await Certificate.getAllCerts();
      setAll(temp);
    };
    fetch();
  })
  return (<Card>
    <ThemeCardHeader title='لیست گواهی ها'></ThemeCardHeader>
    <div>
      {
        all?.map((cert) => <Flex key={cert.CertID} className='m-5' justify={'center'}  ><CertificateComponent data={cert} /></Flex>)
      }
    </div></Card>
  )
}

export default LabCertificate