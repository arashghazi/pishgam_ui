import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';

const ToggleButton = ({ isNavbarVerticalCollapsed, setIsNavbarVerticalCollapsed }) => (
  <>
        <div style={{ marginLeft:'0' }} className="toggle-icon-wrapper">
      <Button
        color="link"
        className="navbar-toggler-humburger-icon navbar-vertical-toggle"
        id="toggleNavigationTooltip"
        onClick={() => {
          document.getElementsByTagName('html')[0].classList.toggle('navbar-vertical-collapsed');
          setIsNavbarVerticalCollapsed(!isNavbarVerticalCollapsed);
        }}
      >
        <span className="navbar-toggle-icon">
          <span className="toggle-line" />
        </span>
      </Button>
    </div>
  </>
);

export default ToggleButton;
