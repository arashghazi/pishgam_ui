import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Dropdown, Button } from 'reactstrap';
import { PGISsettings } from '../../config';
import { AuthenticationController } from '../../Engine/Authentication';
import Avatar from '../common/Avatar';
const ProfileDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    return (
        <Dropdown
            nav
            inNavbar
            isOpen={dropdownOpen}
            toggle={toggle}
            onMouseOver={() => {
                let windowWidth = window.innerWidth;
                windowWidth > 992 && setDropdownOpen(true);
            }}
            onMouseLeave={() => {
                let windowWidth = window.innerWidth;
                windowWidth > 992 && setDropdownOpen(false);
            }}
        >
            <DropdownToggle nav className="pr-0">
                <Avatar />
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu-card">
                <div className="bg-white rounded-soft py-2">
                    <DropdownItem disabled={true} >
                        {AuthenticationController.FullName()}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to="/pages/profile">
                        حساب کاربری
                    </DropdownItem>
                    <DropdownItem href="#!">پشتیبانی</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to="/pages/settings">
                        تنظیمات
                    </DropdownItem>
                    <DropdownItem tag={Button} onClick={() => AuthenticationController.LogOut()}>
                        خروج
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem disabled={true} >
                    <small className='pl-2'>{PGISsettings.version}</small>
                    </DropdownItem>
                </div>
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
