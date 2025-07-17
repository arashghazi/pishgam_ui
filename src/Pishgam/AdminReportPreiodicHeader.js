import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row,Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FalconCardHeader from '../components/common/FalconCardHeader';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import { AuthenticationController } from '../Engine/Authentication';
import BaseInstance from '../Engine/BaseInstance';
import { InstanceController } from '../Engine/InstanceController';
import RelationController from '../Engine/RelationController';
import { ConstIdes, PropConstIdes } from './ConstIdes';
import Divider from '../components/common/Divider';
import { ExternalLink } from './PishgamContext';
import ReportInfo from './Lab/ReportInfo';
import ConditionMaker from '../Engine/ConditionMaker';
import ButtonIcon from '../components/common/ButtonIcon';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { Message } from './MessageDefinition';

const AdminReportPreiodicHeader = ({ title, domainId, LoadTests, PropertyHandler,loading }) => {
    const [isInRole, SetIsInRole] = useState();
    const [links, setLinkes] = useState([]);
    const [samplelinks, setSampleLinkes] = useState([]);
    const [reset, setReset] = useState('');
    const [alertbtn,setAlertbtn]=useState();
    const [popupIsOpen,setPopupIsOpen]=useState();
    const [message,setMessage]=useState();
    useEffect(() => {
        const fetch = async () => {
            setReset('Clear');
            PropertyHandler('','P9');
            if (domainId) {
                try {

                    let data = {};
                    data.baseID = domainId;
                    data.relationType = { ID: 'E0C12I4', FormID: 'O30E23C2F0V1', DIS: 'لینکها', Refrence: 'O30E0C1', Type: 6 };
                    data.relationTypeID = "E0C12I4";
                    let related = await RelationController.GetRelationAsync(data);
                    if (related !== undefined) {
                        let list = [];
                        for (let index = 0; index < related.dependencyIDes.length; index++) {
                            const element = related.dependencyIDes[index];
                            let ins = await InstanceController.LoadInstanceAsync(element.id);
                            list = [...list, new BaseInstance(ins)];
                        }
                        setLinkes(list);
                        SetIsInRole(await AuthenticationController.HasRole('R2'));
                    }

                } catch (error) {

                }
            }
            setReset('');
        }
        fetch();

    }, [domainId])
    const Period = {
        col: "3",
        pid: PropConstIdes.Period,
        controlType: "SearchControl",
        title: 'ٍکلید Enter را بزنید ودوره مورد نظر را انتخاب نمایید',
        source: ConstIdes.Period
    };
    const Labratory = {
        col: "3",
        pid: PropConstIdes.Lab,
        controlType: "SearchControl",
        title: "آزمایشگاه",
        source: ConstIdes.Lab
    };
    let tempdomainid = domainId;
    if (tempdomainid === 'O30E23C2I20')
        tempdomainid = 'O30E23C2I18';
    const SampleChanged = async (pid, value) => {
        try {
            let data = {};
            data.baseID = value.id;
            data.relationTypeID = 'E0C12I4';
            data.relationType = { id: 'E0C12I4', display: 'لینکها' };
            let related = await RelationController.GetRelationAsync(data);
            let templinks = [];
            for (let index = 0; index < related.dependencyIDes.length; index++) {
                const element = related.dependencyIDes[index];
                let loadobject = new ExternalLink(await InstanceController.LoadInstanceAsync(element.id));
                if (loadobject && loadobject.Type === "1")
                    templinks = [...templinks, loadobject];

            }
            setSampleLinkes([...templinks]);
            let con = new ConditionMaker('E23C2');
            con.AddCondition('PC19', '=', value.id, 'AND');
            con.AddCondition('P174', '=', '3', 'AND')
            .AddCondition('PC510', '=', domainId);
            let result = await con.GetResult();
            if (result?.length > 0) {
                setMessage(new Message(result[0]));
                setAlertbtn(true);
                setPopupIsOpen(true);
            }
        } catch (error) {

        }
        PropertyHandler(pid, value);
       
    }
    return (<><ReportInfo />
        <Card className='mb-2 d-print-none'>
            <FalconCardHeader title={title} titleTag="h6" className="py-2">
            {alertbtn?<ButtonIcon icon={faExclamation} color='info' onClick={() => setPopupIsOpen(true)} />:null}
            </FalconCardHeader>
            <CardBody>
                <Row>
                    <Col>
                        <JoiSearchBox Control={Period}
                            TitleFree={false} PValue={reset} loading={loading}
                            type={Period.source} onChange={SampleChanged} 
                            PIDS='PC88,P2'
                            PID={Period.pid} placeHolder={Period.title} />
                    </Col>
                    {isInRole ? <Col>
                        <JoiSearchBox Control={Labratory}
                            TitleFree={false}
                            type={Labratory.source} onChange={(pid, value) => {
                                PropertyHandler(pid, value);
                                LoadTests();
                            }}
                            PID={Labratory.pid} placeHolder={Labratory.title} />
                    </Col> : null}
                    <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        {isInRole ? <Button onClick={LoadTests}>بارگزاری </Button> : null}
                        <Button onClick={() => {
                            window.print();
                        }} color='primary'>چاپ گزارش </Button>
                    </Col>
                </Row>
                {links?.length > 0 ?
                    (<><Divider>لینکها</Divider>
                        <Row>
                            {links?.map(item =>
                                <Col key={item.ID}><a href={item.GetValue('P164')} target="_blank">{item.GetValue('PC95')}</a></Col>
                            )
                            }
                            {samplelinks?.map(item =>
                                <Col key={item.ID}><a href={item.GetValue('P164')} target="_blank">{item.GetValue('PC95')}</a></Col>
                            )
                            }
                        </Row>
                    </>)
                    : null
                }

            </CardBody>
        </Card>
        {alertbtn?<Modal isOpen={popupIsOpen} size='lg'>
                <ModalHeader>{message.Title}</ModalHeader>
                <ModalBody>
                <div dangerouslySetInnerHTML={{__html:message.Content}} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setPopupIsOpen(false)}>متوجه شدم</Button>
                </ModalFooter>
            </Modal>:null}
        </>
    );
};

export default AdminReportPreiodicHeader;