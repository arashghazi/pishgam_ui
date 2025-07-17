import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, Row, Spinner } from 'reactstrap'
import Divider from '../../components/common/Divider';
import Flex from '../../components/common/Flex';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import { AdminController } from '../../Engine/AdminController';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl'
import CertificateComponent from './CertificateComponent';

const AdminCertificate = () => {
    const [year, setYear] = useState();
    const [processing, setResult] = useState(false);
    const [lab, setlab] = useState();
    const Year = {
        col: "12",
        pid: 'P2',
        controlType: "SearchControl",
        title: "سال مورد نظر را انتخاب نمایید",
        source: 'O30E23C1'
    };
    const Labratoary = {
        col: "12",
        pid: 'P8',
        controlType: "SearchControl",
        title: "آزمایشگاه مورد نظر را انتخاب نمایید",
        source: 'O30E23C6'
    };
    const YearChanged = (id, value) => {
        setYear(value);
    }
    const LabChanged = (id, value) => {
        setlab(value);
    }
    const BuildCertificate = async () => {
        setResult(true);
        let result = await AdminController.BuildCertificate(year.id);
        if (result) {
            toast.success(`تعداد ${result} گواهی صادر شد`)
        }
        setResult(false);
    }
    return (
        <Card>
            <ThemeCardHeader  className='d-print-none' title='پردازش گواهی ها' ></ThemeCardHeader>
            <CardBody  className='d-print-none'>
                <Flex justify={'between'}>
                    <div>
                        <JoiSearchBox Control={Year}
                            operator={`like N'%{#}%'`}
                            type={Year.source} onChange={YearChanged}
                            PID={Year.pid} placeHolder={Year.title} />
                    </div>
                    {processing ? <Spinner /> :
                        <Button disabled={year === undefined} onClick={BuildCertificate} color='primary' >شروع پردازش</Button>
                    }
                </Flex>
                <Divider >نمونه گواهی صادر شده</Divider>
                <div>
                    <JoiSearchBox Control={Labratoary} NoEmptyValue
                        operator={`like N'%{#}%'`}
                        type={Labratoary.source} onChange={LabChanged}
                        PID={Labratoary.pid} placeHolder={Labratoary.title} />
                </div>
            </CardBody>
            <CardBody>
                {year && lab ? <Flex className='mt-5' justify={'center'}> <CertificateComponent admin className='d-print-block' year={year} lab={lab} /></Flex> : <div></div>}

            </CardBody>
            <CardFooter>

            </CardFooter>
        </Card>
    )
}

export default AdminCertificate