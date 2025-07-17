import React from 'react'
import CartContext from '../ShopContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
const CartNotification = () => {

    return (<CartContext.Consumer>{({ cart }) => (
        <NavItem>
            <NavLink
                tag={Link }
                to="/e-commerce/shoppingcart"
                className={classNames('px-0', {
                    'notification-indicator notification-indicator-warning notification-indicator-fill': !!cart?.length
                })}
            >
                {!!cart?.length && (
                    <span className="notification-indicator-number">
                        {cart?.length}
                    </span>
                )}
                <FontAwesomeIcon icon="shopping-cart" transform="shrink-7" className="fs-4" />
            </NavLink>
        </NavItem>)}
    </CartContext.Consumer >);

}
export default CartNotification;