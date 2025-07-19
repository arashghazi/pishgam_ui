import React, { useContext } from 'react';
import { Nav, NavItem, NavLink, UncontrolledTooltip, Label } from 'reactstrap';
import ProfileDropdown from './ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import classNames from 'classnames';
import { navbarBreakPoint } from '../../config';
import OnlineSupport from '../../layouts/OnlineSupport';
import CartNotification from '../../components/navbar/CartNotification'


const TopNavRightSideNavItem = () => {
    const { isTopNav, isCombo } = useContext(AppContext);
    let org = localStorage.getItem('org');
    org = JSON.parse(org);
    let isAdmin = localStorage.getItem('user-mode')==='["R2"]';
    return (
            <Nav navbar className="navbar-nav-icons ml-auto flex-row align-items-center">
                <NavItem>
                    <Label>{org?.display}</Label>
                </NavItem>
                {(isCombo || isTopNav) && (
                    <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`, { [`d-${navbarBreakPoint}-none`]: isCombo })}>
                        <NavLink tag={Link} to="/changelog" id="changelog">
                            <FontAwesomeIcon icon="code-branch" transform="right-6 grow-4" />
                        </NavLink>
                        <UncontrolledTooltip autohide={false} placement="left" target="changelog">
                            Changelog
                        </UncontrolledTooltip>
                    </NavItem>
            )}
                {isAdmin?<CartNotification/>:null}
                {/* <NotificationDropdown /> */}
                <ProfileDropdown />
                <OnlineSupport/>
            </Nav>
    );
};

export default TopNavRightSideNavItem;
