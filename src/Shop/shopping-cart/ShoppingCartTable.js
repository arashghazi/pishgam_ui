import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'reactstrap';
import AppContext from '../../context/Context';
import CartContext from '../ShopContext'
import ShoppingCartItem from './ShoppingCartItem';

const ShoppingCartTable = () => {
    const { cart } = useContext(CartContext);
  return (
    <Fragment>
          {cart ? (
        <Fragment>
          <Row noGutters className="bg-200 text-900 px-1 fs--1 font-weight-semi-bold">
            <Col xs={9} md={8} className="p-2 px-md-3">
              شرح
            </Col>
            <Col xs={3} md={4} className="px-3">
              <Row>
                <Col md={8} className="py-2 d-none d-md-block text-center">
                  تعداد
                </Col>
                <Col md={4} className="text-right p-2 px-md-3">
                  قیمت
                </Col>
              </Row>
            </Col>
          </Row>
                  {cart.map(shoppingCartItem => (
                      <ShoppingCartItem CartItem={shoppingCartItem} key={shoppingCartItem.productobject.ID} />
          ))}
          <Row noGutters className="font-weight-bold px-1">
            <Col xs={9} md={8} className="py-2 px-md-3 text-right text-900">
              مجموع
            </Col>
            <Col className="px-3">
              <Row>
                <Col md={8} className="py-2 d-none d-md-block text-center">
                                  {cart.length} (items)
                </Col>
                {/*<Col className="col-12 col-md-4 text-right py-2 pr-md-3 pl-0">*/}
                {/*  {currency}*/}
                {/*  {calculateSale(getTotalPrice(shoppingCart, products), !!appliedPromo ? appliedPromo.discount : 0)}*/}
                {/*</Col>*/}
              </Row>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <p className="p-card mb-0 bg-light">شما هیچ گزینه ای جهت خرید انتخاب نکرده اید!</p>
      )}
    </Fragment>
  );
};

export default ShoppingCartTable;
