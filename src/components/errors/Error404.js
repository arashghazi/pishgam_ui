import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

const Error404 = () => (
  <Card className="text-center">
    <CardBody className="p-5">
      <div className="display-1 text-200 fs-error">404</div>
      <p className="lead mt-4 text-800 text-sans-serif font-weight-semi-bold">
        صفحه مورد نظر یافت نشد.
      </p>
      <hr />
      <p>
        مطمئن شوید لینک مورد نظر صحیح می باشد.
        <a href="mailto:info@eqasonline.ir" className="ml-1">
          با ما تماس بگیرید
        </a>
        .
      </p>
      <Link className="btn btn-primary btn-sm mt-3" to="/">
        <FontAwesomeIcon icon="home" className="mr-2" />
        صفحه اصلی
      </Link>
    </CardBody>
  </Card>
);

export default Error404;
