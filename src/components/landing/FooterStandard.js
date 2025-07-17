import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import createMarkup from '../../helpers/createMarkup';
import Section from '../common/Section';
import { Row, Col } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  menuList1  } from '../../data/footer';
import { animateScroll } from 'react-scroll';
import { PGISsettings } from '../../config';

const FooterTitle = ({ children }) => <h5 className="text-uppercase text-white opacity-85 mb-3">{children}</h5>;

FooterTitle.propTypes = { children: PropTypes.node.isRequired };

const FooterList = ({ list }) => (
  <ul className="list-unstyled">
    {list.map(({ title, to }, index) => (
      <li className="mb-1" key={index}>
        <NavLink className="text-600" to={to}>
          {title}
        </NavLink>
      </li>
    ))}
  </ul>
);

FooterList.propTypes = { list: PropTypes.array.isRequired };

const FooterBlogList = ({ list }) => (
  <ul className="list-unstyled">
    {list.map((blog, index) => (
      <li key={index}>
        <h5 className="fs-0 mb-0">
          <Link className="text-600" to="#!">
            {blog.title}
          </Link>
        </h5>
        <p className="text-600 opacity-50">
          {blog.date} &bull; {blog.read} read {blog.star && <span dangerouslySetInnerHTML={createMarkup('&starf;')} />}
        </p>
      </li>
    ))}
  </ul>
);

FooterBlogList.propTypes = { list: PropTypes.array.isRequired };

const FooterStandard = () => {
  return (
    <Fragment>
      <Section bg="dark" className="pt-8 pb-4">
        <div className="position-absolute btn-back-to-top cursor-pointer bg-dark" onClick={animateScroll.scrollToTop}>
          <FontAwesomeIcon icon="chevron-up" transform="rotate-45" className="text-600" />
        </div>
        <Row>
          <Col lg={5}>
            <FooterTitle>پیشگام ایرانیان</FooterTitle>
            <p className="text-600">
              شركت پیشگام ایرانیان درسال 1387 توسط كارشناسان و متخصصین برنامه های تضمین كیفیت و با هدف مشاركت در ارتقای وضعیت سلامت و ارائه خدمات به آزمایشگاههای تشخیص پزشكی ، تشكیل گردید. پشتوانه دانش فنی این كارشناسان گذراندن دوره های مختلف در مراکزعلمی معتبرداخلی و بین‌المللی مانند INSTAND, CSCQ, WHO ,BSI و...
            </p>
          </Col>
          <Col lg={3}>
            <FooterTitle>اطلاعات تماس</FooterTitle>
            <p className="text-600">
              آدرس :
              تهران، میدان ونک، خیابان ملاصدرا، ابتدای شیراز شمالی، بن بست کاج، پلاک 4، طبقه سوم
            </p>
            <p>
              کد پستی : 1991715515<br />
              صندوق پستی : 6779-15875<br />
              تلفن : 6 - 88058345 (9821+)<br />
              نمابر : 88058347 (9821+)<br />
              ایمیل : Info@eqas.ir<br />
            </p>
            {/* <IconGroup className="mt-4" icons={iconList} /> */}
          </Col>
          <Col className="pl-lg-2 pl-xl-8">
            <Row className="mt-5 mt-lg-0">
              <Col >
                <FooterTitle>لینکها</FooterTitle>
                <FooterList list={menuList1} />
              </Col>
            </Row>
          </Col>
          <Col lg={2}>
            <a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=302506&amp;Code=vgSo8yj3WrYrFbSF9A8r" rel="noopener noreferrer">
              <img referrerpolicy="origin" src="https://Trustseal.eNamad.ir/logo.aspx?id=302506&amp;Code=vgSo8yj3WrYrFbSF9A8r" alt="enamad" style={{ cursor: 'pointer' }} id="vgSo8yj3WrYrFbSF9A8r" />
            </a>
          </Col>
        </Row>
      </Section>

      <section className=" bg-dark py-0 text-center fs--1">
        <hr className="my-0 border-600 opacity-25" />
        <div className="container py-3">
          <Row className="justify-content-between">
            <Col xs={12} sm="auto">
              <p className="mb-0 text-600">
                با تشکر از اطمینان شما <span className="d-none d-sm-inline-block">| </span>
                <br className="d-sm-none" /> {new Date().getFullYear()} &copy;{' '}
                <a 
                  className="text-white opacity-85"
                  href="https://easysaz.com/"
                  target="https://easysaz.com/"
                  rel="noopener noreferrer"
                >
                  easysaz.com
                </a>
              </p>
            </Col>
            <Col xs={12} sm="auto">
              <p className="mb-0 text-600">v{PGISsettings.version}</p>
            </Col>
          </Row>
        </div>
      </section>
    </Fragment>
  );
};

export default FooterStandard;
