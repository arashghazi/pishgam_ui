import React, { useState } from 'react';
import { Card, CardBody, Col,  Row, Spinner, Table } from 'reactstrap';
import { ThemeCardHeader } from '../EngineForms/ThemeControl';
import { RangeDatePicker } from "jalali-react-datepicker";
import ButtonIcon from '../components/common/ButtonIcon';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { InstanceController } from '../Engine/InstanceController';
import { AuthenticationController } from '../Engine/Authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';
import moment from 'jalali-moment';
import momentmiladi from 'moment';
const InvoiceReport = () => {
const title="گزارش فاکتور فروش";
    const [from1, setFrom] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState();
    let start='';
    let end='';
    const onChange = async () => {
        setData(undefined);
        setLoading(true);
        let result = await InstanceController.InvokeMethod('O30E12C60', 'GetInvoicebyAsync',
            `${from1.start.format('MM/DD/YYYY')}#${from1.end.format('MM/DD/YYYY')}`);
            start=moment(from1?.start?.format('MM/DD/YYYY'), 'MM/DD/YYYY')
        .locale('fa').format('YYYY/M/D');
        end=moment(from1?.end?.format('MM/DD/YYYY'), 'MM/DD/YYYY')
        .locale('fa').format('YYYY/M/D');
        setData(result);
        setLoading(false);
    }
    
    return (
        <Card>
            <ThemeCardHeader title={title}>
                {data && AuthenticationController.HasRole('R2') ?
                                <CSVLink className='m-3' data={data.map((item) =>({...item, date: moment(momentmiladi(item.date), 'MM/DD/YYYY')
                                .locale('fa').format('YYYY/M/D')}))}
                                    filename={`${title+'_from_'+from1?.startfa+'_to_'+from1?.endfa ?? "my-file"}.csv`}>
                                    <FontAwesomeIcon icon={faDownload} />
                                </CSVLink> : null}
                {loading?<Spinner />:<ButtonIcon icon={faFilter} onClick={onChange} />}
            </ThemeCardHeader>
            <CardBody>
                <Row>
                    <Col><RangeDatePicker fromLabel='از تاریخ' toLabel='تا تاریخ'
                     onClickSubmitButton={({ start, end}) => setFrom({ start, end,startfa:moment(start.format('MM/DD/YYYY'), 'MM/DD/YYYY')
                     .locale('fa').format('YYYY/M/D'),endfa:moment(end.format('MM/DD/YYYY'), 'MM/DD/YYYY')
                     .locale('fa').format('YYYY/M/D') })} id={'from'} className={"h-100"}
                        bsSize="sm"
                    /></Col>
                </Row>
                <Row>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>آزمایشگاه</th>
                                <th>کد</th>
                                <th>تاریخ</th>
                                <th>محصول</th>
                                <th>پرداخت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            data?.map((item)=>{
                                let baseItem=item;
                                return <tr key={item.id}>
                                    <td>{baseItem.labratoary}</td>
                                    <td>{baseItem.labratoaryCode}</td>
                                    <td>{moment(momentmiladi(baseItem.date), 'MM/DD/YYYY')
        .locale('fa').format('YYYY/M/D')}</td>
                                    <td>{baseItem.detail}</td>
                                    <td>{baseItem.payment}</td>
                                </tr>
                            }
                            )}
                        </tbody>
                    </Table>
                </Row>
            </CardBody>
        </Card>
    );
};

export default InvoiceReport;