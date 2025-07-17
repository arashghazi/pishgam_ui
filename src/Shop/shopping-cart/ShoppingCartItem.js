import React, { useContext, useState } from 'react';
import { Col, Media, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import NumberFormat from 'react-number-format';
import QuantityController from '../../components/common/QuantityController';
import CartContext from '../ShopContext';

const ShoppingCartItem = ({ CartItem }) => {
    const { currency } = useContext(AppContext);
    const { removeFromCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(CartItem.quantity);
    const { ID, title, file, price, sale } = CartItem.productobject;
    const setQty = (value) => {
        CartItem.Change(value);
        setQuantity(value);
    }
    const remove = () => {
        removeFromCart(ID)
    }
    return (
        <Row noGutters className="align-items-center px-1 border-bottom border-200">
            <Col xs={8} className="py-3 px-2 px-md-3">
                <Media className="align-items-center">
                    <Link to={`/e-commerce/product-details/${ID}`}>
                        <img
                            className="rounded mr-3 d-none d-md-block"
                            src={require(`../../assets/img/products/${file}.jpg`)}
                            alt=""
                            width="60"
                        />
                    </Link>
                    <Media body>
                        <h5 className="fs-0">
                            <Link className="text-900" to={`/e-commerce/product-details/${ID}`}>
                                {title}
                            </Link>
                        </h5>
                        <div
                            className="fs--2 fs-md--1 text-danger cursor-pointer"
                            onClick={remove}
                        >
                            حذف
                        </div>
                    </Media>
                </Media>
            </Col>
            <Col xs={4} className="p-3">
                <Row className="align-items-center">
                    <Col md={7} className="d-flex justify-content-end justify-content-md-center px-2 px-md-3 order-1 order-md-0">
                        <div>
                            <QuantityController quantity={parseFloat(quantity)} setQuantity={setQty} />
                        </div>
                    </Col>
                    <Col md={5}>
                        <NumberFormat className='text-truncate'
                            thousandSeparator={true} displayType={'text'} prefix={currency}
                            value={CartItem.total} />
                    </Col>
                    {/*<Col md={4} className="text-right pl-0 pr-2 pr-md-3 order-0 order-md-1 mb-2 mb-md-0 text-600">*/}
                    {/*    {currency}*/}
                    {/*    {calculateSale(price, sale) * quantity}*/}
                    {/*</Col>*/}
                </Row>
            </Col>
        </Row>
    );
};

export default ShoppingCartItem;
