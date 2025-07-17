import React from 'react'
import Flex from '../../components/common/Flex'
import Section from '../../components/common/Section'
import CertificateComponent from '../Certificate/CertificateComponent'
import NavbarStandard from '../../components/navbar/NavbarStandard'

const CertificationPage = ({ match, location }) => {
    return (<div >
        <NavbarStandard collapsed={true} hideMenu={true} className='no' location={location} match={match} />
        <div>
            <div style={{ height: 40 }} className='mt-5' />
            <Flex justify={'center'}>
                <h2>اعتبار سنجی گواهی</h2>
            </Flex>
            <div style={{ overflowX: 'auto' }}>
                <Section>
                    <Flex justify={'center'}>
                        <CertificateComponent match={match} />
                    </Flex>
                </Section>
            </div>
        </div>
    </div>)
}

export default CertificationPage