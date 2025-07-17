import React, { useContext, useState } from 'react';
import { Button, CardFooter, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Link } from 'react-router-dom';
import Flex from '../../components/common/Flex';
import CartContext, { CartContextClass } from '../ShopContext';


const ShoppingCartFooter = () => {
  const [promoCode, setPromoCode] = useState('');

    return (
        <CardFooter tag={Flex} justify="end" className="bg-light">
      <Form
        className="mr-3"
        
      >
        <InputGroup size="sm">
          <Input placeholder="GET50" value={promoCode} onChange={({ target }) => setPromoCode(target.value)} />
          <InputGroupAddon addonType="append">
            <Button color="outline-secondary" size="sm" className="border-300" type="submit">
              تایید
            </Button>
          </InputGroupAddon>
        </InputGroup>
            </Form>
            <Button tag={Link} color="primary" size="sm" to="/e-commerce/checkout" onClick={() => (CartContextClass.cart = [])}>
        صدور فاکتور
      </Button>
    </CardFooter>
  );
};

export default ShoppingCartFooter;
