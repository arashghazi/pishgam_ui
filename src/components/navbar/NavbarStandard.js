import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Collapse, Container, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import handleNavbarTransparency from '../../helpers/handleNavbarTransparency';
import LandingRightSideNavItem from './LandingRightSideNavItem';
import { topNavbarBreakpoint } from '../../config';

const NavbarStandard = ({collapsed,hideMenu}) => {
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  useEffect(() => {
    if(!collapsed){
    window.addEventListener('scroll', handleNavbarTransparency);
    return () => window.removeEventListener('scroll', handleNavbarTransparency);
    }
    else{
      setNavbarCollapsed(false);
    }
  }, []);

  return (
    <Navbar
      dark
      fixed="top"
      expand={topNavbarBreakpoint}
      className={classNames('navbar-standard navbar-theme', {
        'bg-dark': !navbarCollapsed
      })}
    >
      <Container>
        <NavbarBrand className="text-white" tag={Link} to="/">
          سامانه آنلاین پیشگام ایرانیان
        </NavbarBrand>
        <NavItem>
        <NavLink className="text-white" tag={Link} to="/aboutus" >
          درباره ما
        </NavLink>
      </NavItem>
        {/* <NavbarToggler onClick={() => setNavbarCollapsed(!navbarCollapsed)} /> */}
        <Collapse isOpen={!navbarCollapsed} navbar className="scrollbar">
          {/* <Nav navbar>
            <NavbarTopDropDownMenus setNavbarCollapsed={setNavbarCollapsed} />
          </Nav> */}
          {hideMenu?null:<LandingRightSideNavItem collapsed />}
        </Collapse>
      </Container>
    </Navbar>
  );
};
export default NavbarStandard;
