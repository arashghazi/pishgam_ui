import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppContext from './context/Context';
import { settings, PGISsettings } from './config';
import toggleStylesheet from './helpers/toggleStylesheet';
import { getItemFromStore, setItemToStore } from './helpers/utils';
//import ReactGA from 'react-ga';

// const TRACKING_ID = "G-Z6HSXPHQ5K";
// ReactGA.initialize(TRACKING_ID);
const Main = props => {
  
  let tempSetting = settings;
  tempSetting = PGISsettings;
  const taxRate = PGISsettings.taxRate;
  const [isFluid, setIsFluid] = useState(getItemFromStore('isFluid', tempSetting.isFluid));
  const [isRTL, setIsRTL] = useState(getItemFromStore('isRTL', tempSetting.isRTL));
  const [isDark, setIsDark] = useState(getItemFromStore('isDark', tempSetting.isDark));
  const [isTopNav, setIsTopNav] = useState(getItemFromStore('isTopNav', tempSetting.isTopNav));
  const [isCombo, setIsCombo] = useState(getItemFromStore('isCombo', tempSetting.isCombo));
  const [isVertical, setIsVertical] = useState(getItemFromStore('isVertical', tempSetting.isVertical));
  const [isNavbarVerticalCollapsed, setIsNavbarVerticalCollapsed] = useState(
    getItemFromStore('isNavbarVerticalCollapsed', tempSetting.isNavbarVerticalCollapsed)
  );
  const [currency, setCurrency] = useState(tempSetting.currency);
  const [currentTitle, setCurrentTitle] = useState(tempSetting.currentTitle);
  const [showBurgerMenu, setShowBurgerMenu] = useState(tempSetting.showBurgerMenu);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenSidePanel, setIsOpenSidePanel] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  const [navbarStyle, setNavbarStyle] = useState(getItemFromStore('navbarStyle', tempSetting.navbarStyle));

  const toggleModal = () => setIsOpenSidePanel(prevIsOpenSidePanel => !prevIsOpenSidePanel);
  const value = {
    taxRate,
    isRTL,
    isDark,
    isCombo,
    isFluid,
    setIsRTL,
    isTopNav,
    currency,
    setIsDark,
    setIsCombo,
    setIsFluid,
    isVertical,
    toggleModal,
    setIsTopNav,
    navbarStyle,
    setCurrency,
    setIsVertical,
    showBurgerMenu,
    setNavbarStyle,
    isOpenSidePanel,
    navbarCollapsed,
    setShowBurgerMenu,
    setIsOpenSidePanel,
    setNavbarCollapsed,
    isNavbarVerticalCollapsed,
    setIsNavbarVerticalCollapsed,
    currentTitle,
    setCurrentTitle,
  };

  const setStylesheetMode = mode => {
    setIsLoaded(false);
    setItemToStore(mode, value[mode]);
    toggleStylesheet({ isRTL, isDark }, () => setIsLoaded(true));
  };

  useEffect(() => {
    setStylesheetMode('isFluid');
    // eslint-disable-next-line
  }, [isFluid]);

  useEffect(() => {
    setStylesheetMode('isRTL');
    // eslint-disable-next-line
  }, [isRTL]);

  useEffect(() => {
    setStylesheetMode('isDark');
    // eslint-disable-next-line
  }, [isDark]);

  useEffect(() => {
    setItemToStore('isNavbarVerticalCollapsed', isNavbarVerticalCollapsed);
    // eslint-disable-next-line
  }, [isNavbarVerticalCollapsed]);
  useEffect(() => {
    setItemToStore('currentTitle', currentTitle);
    // eslint-disable-next-line
  }, [currentTitle]);
  useEffect(() => {
    setItemToStore('isTopNav', isTopNav);
    // eslint-disable-next-line
  }, [isTopNav]);

  useEffect(() => {
    setItemToStore('isCombo', isCombo);
    // eslint-disable-next-line
  }, [isCombo]);
  useEffect(() => {
    setItemToStore('isVertical', isVertical);
    // eslint-disable-next-line
  }, [isVertical]);

  useEffect(() => {
    setItemToStore('navbarStyle', navbarStyle);
    // eslint-disable-next-line
  }, [navbarStyle]);

  //if (!isLoaded) {
  //  toggleStylesheet({ isRTL, isDark }, () => setIsLoaded(true));

  //  return (
  //    <div
  //      style={{
  //        position: 'fixed',
  //        top: 0,
  //        right: 0,
  //        bottom: 0,
  //        left: 0,
  //        backgroundColor: isDark ? themeColors.dark : themeColors.light
  //      }}
  //    />
  //  );
  //}

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

Main.propTypes = { children: PropTypes.node };

export default Main;
