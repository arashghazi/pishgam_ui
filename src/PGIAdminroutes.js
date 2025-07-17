export const BaseInfoRoutes = {
    name: 'اطلاعات پایه',
    to: '/#',
    exact: false,
    icon: 'poll',
    children: [
        { to: '/PanelF3V1', name: 'سال' },
        { to: '/PanelF3V10', name: 'دوره' },
        { to: '/PanelF3V11', name: 'بخش' },
        { to: '/PanelF3V12', name: 'نمونه' },
        { to: '/PanelF3V2', name: 'آزمایشگاه' },
        { to: '/PanelF3V13', name: 'دانشگاه' },
        { to: '/PanelF3V17', name: 'سازنده کیت' },
    ]
};
export const DashboardRoutes = {
    name: 'داشبورد',
    to: '/',
    exact: true,
    icon: 'poll'
};
export default [
    DashboardRoutes, BaseInfoRoutes
];
export const CommandSetting = [
    { command: 'Save', title: 'ذخیره', color: 'primary' },
    { command: 'New', title: 'جدید', color: 'secondary' },
    { command: 'Delete', title: 'حذف', color: 'danger' },
    { command: 'Save-New', title: 'ذخیره و جدید', color: 'secondary' },
    { command: 'Refresh', title: 'بارگزاری', color: 'secondary' },
    { command: 'RefreshTemplate', title: 'بارگزاری قالب', color: 'secondary' },

]