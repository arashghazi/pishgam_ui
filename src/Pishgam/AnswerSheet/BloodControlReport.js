import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import BaseInstance from '../../Engine/BaseInstance';
import { InstanceController } from '../../Engine/InstanceController';
import FormManager from '../../EngineForms/FormManager';
import AdminReportHeader from '../AdminReportHeader';
import NoData from '../NoData';
import ReportHeader from '../ReportHeader';

const BloodControlReport = ({ match }) => {
    const [domain, setDomain] = useState();
    const [domainData, setDomainData] = useState();

    useEffect(() => {
        const fetch = async () => {
            if (match.params.dom) {
                let dom = await InstanceController.LoadInstanceAsync(match.params.dom);
                dom.id = dom.ID;
                dom.display = dom.DIS;
                let dds = (new BaseInstance(dom)).GetValue('PC19');
                dds = dds.split('#');
                setDomainData({ head: dds[0], testProp: dds[1], formId: dds[2], cnn: dds[3] })
                setDomain(dom);
            }
        }
        fetch();
    }, [match])
    const PropertyHandler = (value, obj) => {
        if (value.includes('O30E23C4I'))
            setSample(obj);
        if (value.includes('O30E23C6I'))
            setLabratoary(obj);
    }
    const [sample, setSample] = useState();
    const [labratoary, setLabratoary] = useState();
    const LoadData = () => {

    }
    return (<>
        <AdminReportHeader title={`  گزارش خون کنترل `}
        domainId={domain?.id}
             PropertyHandler={PropertyHandler}
            LoadTests={LoadData}
        />
         <Card style={{ minWidth: '700px' }}>
                <CardBody>
                    {sample && labratoary ?
                        <ReportHeader Section={domain?.display}
                            Labratoary={labratoary?.display}
                            Sample={sample}
                        >
                        <FormManager CardOff IsReadOnly formId={domainData.formId} />
                            
                        </ReportHeader>
                        : <NoData title={'نمونه و آزمایشگاه را انتخاب کنید'} />
                    }
                </CardBody>
            </Card>
    </>
    );
};

export default BloodControlReport;