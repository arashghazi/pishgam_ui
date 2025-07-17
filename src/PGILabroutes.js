export const DashboardRoutes = {
    name: 'داشبورد',
    to: '/',
    exact: true,
    icon: 'home'
};
export const AnswerSheetRoutes = {
    name: 'ثبت پاسخنامه',
    to: '/PDIDashboard',
    icon: 'copy'
};
export const ReportsRoutes = {
    name: 'گزارش نتایج',
    to: '/Reports',
    icon: 'poll'
};
export const SupportRoutes = {
    name: 'پشتیبانی',
    to: '/support',
    icon: 'phone'
};
export const SettingRoutes = {
    name: 'تنظیمات',
    to: '/PDIDashboard',
    icon: 'cog'
};
export default [
    DashboardRoutes, AnswerSheetRoutes, ReportsRoutes, SupportRoutes, SettingRoutes
];
