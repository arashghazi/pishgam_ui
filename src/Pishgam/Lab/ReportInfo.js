import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

const ReportInfo = () => {
    return (
        <Card className='mb-2 d-print-none'>
            <CardHeader style={{color:'red',textAlign:'center'}}>اطلاع رسانی</CardHeader>
            <CardBody>
                <p>همکار گرامی انتقال گزارشات
                     قبل از سال 1401 به نرم افزار جدید در حال انجام می باشد. تا قبل از انتقال می توانید (با نام کاربری و رمز عبور قدیم) از آدرس 
                     <a href='http://old.eqasonline.ir/' target='_blank'>old.eqasonline.ir</a> به گزارش نتایج ارزیابی سالهای قبل از 1401 دسترسی داشته باشید.</p>
            </CardBody>
        </Card>
    );
};

export default ReportInfo;