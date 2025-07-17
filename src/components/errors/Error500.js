import React from 'react';
import { useEffect } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { AuthenticationController } from '../../Engine/Authentication';

const Error500 = () =>{ 
  return(
  <Card className="text-center h-100">
    <CardBody className="p-5">
      <div className="display-1 text-200 fs-error">500</div>
      <p className="lead mt-4 text-800 text-sans-serif font-weight-semi-bold">اوه، مشکلی پیش آمد!</p>
      <hr />
      <p>
        لطفا صفحه را بروز رسانی نمایید و از برنامه خارج شده مجددا وارد شوید
        <a href="mailto:info@eqasonline.ir" className="ml-1">
          تماس با ما
        </a>
        .
      </p>
      <Button color='primary' onClick={()=> AuthenticationController.LogOut()}>ورود مجدد</Button>
    </CardBody>
  </Card>
);
}

export default Error500;
