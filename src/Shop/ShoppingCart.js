import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CardBody, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import ShoppingCartFooter from './shopping-cart/ShoppingCartFooter';
import ShoppingCartTable from './shopping-cart/ShoppingCartTable';
import ButtonIcon from '../components/common/ButtonIcon';
import FalconCardHeader from '../components/common/FalconCardHeader';
import CartContext, { CartContextClass } from './ShopContext'
import AppContext from '../context/Context';

const ShoppingCart = ({ history }) => {
    const { cart } = useContext(CartContext);
    const [proccess, setProccess] = useState(false);
    const { setCurrentTitle } = useContext(AppContext);
    useEffect(() => setCurrentTitle('سبد خرید'));
    return (
        <Card>
            <FalconCardHeader title={`سبد خرید (${cart.length} آیتم)`} light={false} breakPoint="sm">
                <ButtonIcon
                    icon="chevron-left"
                    color='outline-secondary'
                    size="sm"
                    className='border-300'
                    tag={Link}
                    to="/e-commerce"
                >
                    برگشت به فروشگاه
                </ButtonIcon>
                {cart &&
                    (
                        proccess ? <Spinner /> :
                            <Button color="primary" size="sm"
                                onClick={async () => {
                                    setProccess(true)
                                    let value = await CartContextClass.CreateInvoice(true)
                                    history.push({
                                        pathname: "/e-commerce/invoice/" + value.Header.ID,
                                        state: { Data: value }
                                    });
                                }} className="ml-2">
                                صدور فاکتور
                            </Button>
                    )
                }
            </FalconCardHeader>
            <CardBody className="p-0">
                <ShoppingCartTable />
            </CardBody>
            {//<ShoppingCartFooter />
            }
        </Card>
    );
};

export default ShoppingCart;
