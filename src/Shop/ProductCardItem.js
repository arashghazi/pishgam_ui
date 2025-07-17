import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody,  CardSubtitle, CardTitle, Col,  Row } from 'reactstrap';
import AppContext from '../context/Context';
import Flex from '../components/common/Flex';
import NumberFormat from 'react-number-format';
import ButtonIcon from '../components/common/ButtonIcon';
import CartContext from './ShopContext'

const ProductCardItem = ({ item }) => {
    const {
        ID,
        file,
        title,
        description,
        category,
        price,
        sale, isAvilebale, scale,
        AddToCart, Selected
    } = item;

    const { currency } = useContext(AppContext);
    const { cart, addToCart } = useContext(CartContext);
    return (
        <Row className='p-1  w-100'  >
            <Col xs={12}>
                <Card style={{ height: '100%' }}>
                    {/* <CardImg
                    alt="Card image cap"
                    src={pic}
                    top
                    width="100%"
                /> */}
                    <CardBody>
                        <CardTitle tag="h5">
                            <Flex justify='between'>
                                {title}
                                <CardSubtitle
                                    className="mb-2 text-primary"
                                    tag="h5"
                                >
                                    <NumberFormat thousandSeparator={true} displayType={'text'} prefix={currency}
                                        value={!!sale ? price - price * (sale / 100) : price} />
                                    {!!sale && (
                                        <del className="ml-2 fs--1 text-danger"  >
                                            {currency}
                                            {price}
                                        </del>
                                    )}
                                </CardSubtitle>

                            </Flex>
                        </CardTitle>
                        <CardSubtitle className='mt-2 text-muted small'>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                <div style={{ flex: "1" }}>
                                    {description}
                                </div>
                                <ButtonIcon
                                    color="primary"
                                    size="sm"
                                    icon="cart-plus"
                                    onClick={() => addToCart(item)}
                                    style={{ alignSelf: "flex-start", whiteSpace: "nowrap" }}
                                />
                            </div>
                        </CardSubtitle>
                    </CardBody>
                    {/* <CardFooter>
                    {cartLoading ? (
                        <ButtonIcon
                            color="primary"
                            size="sm"
                            icon="circle-notch"
                            iconClassName="fa-spin"
                            style={{ cursor: 'progress' }}
                            disabled
                        />
                    ) : (
                        <ButtonIcon color="primary" size="sm" icon="cart-plus" onClick={addToCart.bind(this, item)} />
                    )}
                </CardFooter> */}
                </Card>
            </Col>
        </Row>
    );
};

ProductCardItem.propTypes = {
    item: PropTypes.object.isRequired,
};

ProductCardItem.defaultProps = { isNew: false, isInStock: false, files: [] };

export default ProductCardItem;
