import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardBody, Col, Input, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import Background from '../../components/common/Background';
import corner1 from '../../assets/img/illustrations/corner-1.png';
import corner2 from '../../assets/img/illustrations/corner-2.png';
import corner3 from '../../assets/img/illustrations/corner-3.png';
import ConditionMaker from '../../Engine/ConditionMaker';
import { InstanceController } from '../../Engine/InstanceController';
import BaseInstance from '../../Engine/BaseInstance';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import RelationController from '../../Engine/RelationController';
import { ExternalLink } from '../PishgamContext';
import { Utility } from '../../Engine/Common';
import Flex from '../../components/common/Flex';

const getImage = color => {
    switch (color) {
        case 'warning':
            return corner1;
        case 'info':
            return corner2;
        case 'success':
            return corner3;
        default:
            return corner1;
    }
};

const LabDataEntryCard = ({ title, rate, orgid, to, color, P1, P3 }) => {
    const [samples, setSamples] = useState(null)
    const [section, setSection] = useState(null)
    const [sample, setSample] = useState(null);
    const [links, setLinks] = useState();
    const [documents, setDocuments] = useState();

    useEffect(() => {
        const LoadSample = async () => {
            if (samples === null) {
                let condition = new ConditionMaker('O30E23C4');
                condition = condition.AddCondition('P1', '=', P1, 'AND')
                    .AddCondition('P3', '=', P3,);
                let list = await condition.GetResult();
                setSamples(list);
                if (P1 === 'O30E23C2I15' || P1 === 'O30E23C2I16') {
                    setSample(list[0]);
                }

                let sec = await InstanceController.LoadInstanceAsync(P1);
                let inssec = new BaseInstance(sec);
                if (inssec.GetValue('PC556')) {
                    let sec = JSON.parse(inssec.GetValue('PC556'));
                    if (!Array.isArray(sec))
                        sec = [sec];
                    setSection(sec);
                }

            }
            let data = {};
            data.baseID = P1;
            data.relationType = { ID: 'E0C12I4', FormID: 'O30E23C2F0V1', DIS: 'لینکها', Refrence: 'O30E0C1', Type: 6 };
            data.relationTypeID = "E0C12I4";
            let related = await RelationController.GetRelationAsync(data);
            let tempDocuments = [];
            if (related.dependencyIDes.length > 0) {
                for (let index = 0; index < related.dependencyIDes.length; index++) {
                    const element = related.dependencyIDes[index];
                    let ins = new BaseInstance(await InstanceController.LoadInstanceAsync(element.id));
                    if (ins.GetValue('PC533') === '1' || ins.GetValue('PC533') === '16')
                        tempDocuments = [...tempDocuments, ins];
                }
                setDocuments(tempDocuments)
            }
        }
        LoadSample();
    }, [P1,P3,samples])
    const selectSample = async ({ target }) => {
        if (Utility.IsInstanceID(target.value)) {
            let data = {};
            data.baseID = target.value;
            data.relationTypeID = 'E0C12I4';
            data.relationType = { id: 'E0C12I4', display: 'لینکها' };
            let related = await RelationController.GetRelationAsync(data);
            let templinks = [];
            for (let index = 0; index < related.dependencyIDes.length; index++) {
                const element = related.dependencyIDes[index];
                let loadobject = new ExternalLink(await InstanceController.LoadInstanceAsync(element.id));
                if (loadobject && (!loadobject.Type || loadobject.Type === ''))
                    templinks = [...templinks, loadobject];

            }
            setLinks(templinks)
            setSample(samples.find(x => x.ID === target.value))
        }
    }
    return (
        <Card className="mb-3 overflow-hidden" style={{ minWidth: '12rem' }}>
            <Background image={getImage(color)} className="bg-card" />
            <CardBody className="position-relative">
                <Flex justify='between'>
                    <div>
                        <h6>
                            {title}
                        </h6>
                    </div>
                    <div>
                        {
                            documents?.map((doc) => <a key={doc.ID} className="font-weight-semi-bold fs--1 text-nowrap" href={doc.GetValue('P164')}>
                                {doc.GetValue('PC95')}
                            </a>)
                        }
                    </div>
                </Flex>
                {(P1 !== 'O30E23C2I15' && P1 !== 'O30E23C2I16') ?
                    <Input type="select" bsSize='sm' onChange={selectSample}>
                        <option>انتخاب نشده</option>
                        {samples !== null ? samples.map((sample) => (
                            <option key={sample.ID} value={sample.ID}>{sample.DIS}</option>
                        )) : null}
                    </Input> : <Input type='text' readOnly value={'تمامی نمونه ها'} />
                }
                <CardBody>
                    {
                        section?.map((sec) => (
                            <Link key={sec.form} className="font-weight-semi-bold fs--1 text-nowrap" to={sample !== null ? {
                                pathname: '/' + sec?.form,
                                state: {
                                    Active: false,
                                    formid: sec?.form2 ?? sec?.form,
                                    values:(P1 !== 'O30E23C2I15' && P1 !== 'O30E23C2I16') ?
                                     [{ pid: 'P9', value: { id: sample.ID, display: sample.DIS } }, { pid: 'P8', value: orgid }]
                                     :[{ pid: 'P8', value: orgid }]
                                }
                            } : '/'}>
                                {sec?.display}
                                <FontAwesomeIcon icon={faAngleLeft} transform="down-1.5" className="ml-1" />
                            </Link>
                        ))
                    }
                </CardBody>
                <Row>
                    {links?.map(link => (
                        <Col key={link.ID}>
                            <Link className="font-weight-semi-normal fs--2 text-nowrap"
                                size={''} to={{ pathname: link.Address }} target="_blank">
                                {link.Title}
                            </Link>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

LabDataEntryCard.propTypes = {
    title: PropTypes.string.isRequired,
    rate: PropTypes.string,
    linkText: PropTypes.string,
    to: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.node
};

LabDataEntryCard.defaultProps = {
    linkText: 'See all',
    to: '#!',
    color: 'primary'
};

export default LabDataEntryCard;
