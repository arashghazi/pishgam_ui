import React, { useContext, useEffect, useState } from 'react';
import { CardTitle, Col, Row, Spinner } from 'reactstrap';
import Flex from '../../components/common/Flex';
import AppContext from '../../context/Context';
import BaseInstance from '../../Engine/BaseInstance';
import { InstanceController } from '../../Engine/InstanceController';
import Parameters from '../../Engine/Parameters';
import { SectionGroups } from '../ConstIdes';
import LabDataEntryCard from './LabDataEntryCard';
import SampleSelectionWelcome from './SampleSelectionWelcome';

const SectionDetail = ({ match }) => {
    const [partList, setPartList] = useState(null);
    const { setCurrentTitle } = useContext(AppContext);
    const [ sectionGroup, setSectionGroup ] = useState();
    const [orgid, setOrgid] = useState();

    useEffect(() => {
        let temp =SectionGroups.find(x => x.id ===parseInt(match.params.id))
        setSectionGroup(temp);

    },[match.params.id])
    useEffect(() => {
        const fetch = async () => {
            let org = await Parameters.GetValue('@org');
            setOrgid(org)
            setCurrentTitle(`صفحه اصلی / ${sectionGroup.display}`);
            let list = await InstanceController.InvokeMethod('O30E12C60', 'GetActivePeriods', `${org.id}#${sectionGroup.id}`);
            //let list = await InstanceController.InvokeMethod('O30E12C60', 'GetActivePeriods', `${"O30E23C6I2099"}#${sectionGroup.id}`);
            setPartList(list);
        }
        if(sectionGroup)
        fetch();
    }, [sectionGroup,setCurrentTitle])
    return (<>
    <SampleSelectionWelcome/>
        {partList === null ? <Flex justify={'center'}><Spinner /></Flex> : partList?.length > 0 ? <>
            <CardTitle>{sectionGroup.display}</CardTitle>
            <Row>
                {partList?.map(part => {
                    let insPart = new BaseInstance(part);
                    return (
                        <Col key={insPart.ID} lg={4} md='6' sm='12' >
                            <LabDataEntryCard title={insPart.GetProperty('P1').DIS}
                                color={'success'} orgid={orgid}
                                P1={insPart.GetValue('P1')}
                                P3={insPart.GetValue('P3')} />
                        </Col>
                    )
                })}
            </Row>
        </> : null}</>
    );
};

export default SectionDetail;