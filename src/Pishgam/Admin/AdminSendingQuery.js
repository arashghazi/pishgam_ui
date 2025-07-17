import React, { useState } from 'react'
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import { PeriodControl } from '../ConstIdes';
import { RangeDatePicker } from "jalali-react-datepicker";
import { InstanceController } from '../../Engine/InstanceController';
import FormManager from '../../EngineForms/FormManager';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import BaseInstance from '../../Engine/BaseInstance';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-jalaali';


const AdminSendingQuery = () => {
    const Period = { ...PeriodControl, value: '' };
    const [period, setPeriod] = useState();
    const [from1, setFrom] = useState();
    const [resultQry,setResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const fetch = async () => {
        setLoading(true);
        let result = await InstanceController.InvokeMethod('O30E12C64', 'GetSendingProccessQuery',
            `${from1.start.format('MM/DD/YYYY')}#${from1.end.format('MM/DD/YYYY')}#${period.id}`);
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                console.log(element,element.Prop.find(p => p.PID === 'P88').IPV)
                element.Prop=[...element.Prop,{ TP: 2, PID: "PC1000", IPV: 
                    moment(element.Prop.find(p => p.PID === 'P88').IPV, 'MM/DD/YYYY HH:mm').locale('fa')
                    .format('jYYYY/jMM/jDD HH:mm')}]
            }
        setResult(result);
        setLoading(false);
    }
    const convertForExcel=()=>{
        let result = resultQry.map(ins => new BaseInstance(ins).instanceToRow());
        return result;
      }
    return (<Card>
        <ThemeCardHeader title='گزارش ارسال نمونه ها' >
            <Row>
                <Col>
                    <JoiSearchBox Control={Period}
                        type={Period.source} onChange={(pid, value) => { setPeriod(value); console.log(value) }}
                        PID={Period.pid} placeHolder={Period.title} />
                    <div style={{ padding: 22 }} >
                       <Button color='primary' disabled={loading} onClick={fetch} >بارگزاری</Button>

                        <CSVLink style={{paddingRight:10}} headers={[{ label: 'تاریخ', key: 'PC1000' },{ label: 'کد', key: 'P6' },{ label: 'استان', key: 'P73' },{ label: 'عنوان', key: 'PC88' },]} data={convertForExcel()}
                                    filename={`${ "خروجی گزارش نمونه های ارسال شده"}.csv`}>
                                    <FontAwesomeIcon icon={faDownload} />
                                </CSVLink> 
                    </div>
                </Col>
                <Col>
                    <RangeDatePicker fromLabel='از تاریخ' toLabel='تا تاریخ'
                        onClickSubmitButton={({ start, end }) => setFrom({
                            start, end, startfa: moment(start.format('MM/DD/YYYY'), 'MM/DD/YYYY')
                                .locale('fa').format('YYYY/M/D'), endfa: moment(end.format('MM/DD/YYYY'), 'MM/DD/YYYY')
                                    .locale('fa').format('YYYY/M/D')
                        })} id={'from'} className={"h-100"}
                        bsSize="sm"
                    />
                </Col>
            </Row>
        </ThemeCardHeader>
        <CardBody>
            <FormManager formId={'O30E100C1F1V1'} 
                Data={[{ formId: 'O30E100C1F1V1', data: resultQry }]}
                CardOff />
        </CardBody>
    </Card>);
}
export default AdminSendingQuery