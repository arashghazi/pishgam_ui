import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const breakpoint = 'lg';

const LandingRightSideNavItem = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <Nav navbar className="ml-auto">
      
      <NavItem>
      <a 
                  className="text-white opacity-85"
                  href="https://eqas.ir/"
                  target="https://eqas.ir/"
                  rel="noopener noreferrer"
                  style={{ fontSize: '21px' }}
                >
                  سایت اصلی پیشگام ایرانیان
                </a>
        </NavItem>
        {/* <NavItem>
        <NavLink tag="a" to="https://eqas.ir/" target="_blank" rel="noopener noreferrer" >
          سایت اصلی پیشگام ایرانیان
        </NavLink>
      </NavItem> */}
    </Nav>
  );
};

export default LandingRightSideNavItem;
