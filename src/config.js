export const version = '1.47.1';
export const navbarBreakPoint = 'xl'; // Vertical navbar breakpoint
export const topNavbarBreakpoint = 'lg';
export const settings = {
    isFluid: true,
    isRTL: true,
    isDark: false,
    isTopNav: false,
    isVertical: true,
    get isCombo() {
        return this.isVertical && this.isTopNav;
    },
    showBurgerMenu: false, // controls showing vertical nav on mobile
    currency: 'ریال',
    taxRate:9,
    isNavbarVerticalCollapsed: false,
    navbarStyle: 'transparent',
    lang: ['fa-IR'],
    currentTitle:''
};
export const PGISsettings = {
    isFluid: true,
    isRTL: true,
    isDark: false,
    isTopNav: false,
    isVertical: true,
    get isCombo() {
        return this.isVertical && this.isTopNav;
    },
    showBurgerMenu: false, // controls showing vertical nav on mobile
    currency: 'ریال',
    taxRate: 0,
    isNavbarVerticalCollapsed: false,
    navbarStyle: 'vibrant',
    lang: ['fa-IR'],
    currentTitle:'',
    version : version
};
export const globalparameters = [
    
];
export default { version, navbarBreakPoint, topNavbarBreakpoint, settings, PGISsettings, globalparameters };
