import React from 'react';
import { Card, CardBody } from 'reactstrap';
import FalconCardHeader from '../../components/common/FalconCardHeader';

const SampleSelectionWelcome = () => {
    return (
        <Card className='mb-2 shadow-none'>
            <FalconCardHeader title={'جهت ثبت پاسخ به نکات ذیل توجه فرمایید'} />
            <CardBody>
                <ul>
                    <li>بخش مورد نظر را انتخاب نمایید</li>
                    <li>از داخل لیست نمونه ها، شماره نمونه دریافت شده را انتخاب نمایید</li>
                    <li>برروی لینک پاسخنامه کلیک نمایید</li>
                </ul>
            </CardBody>
        </Card>
    );
};

export default SampleSelectionWelcome;