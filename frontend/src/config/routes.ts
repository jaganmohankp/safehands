const navbarRoutes = {
    'admin': [
        {
            'name': 'Dashboard',
            'route': '/admin/dashboard',
            'icon': 'fal fa-home'
        },
        {
            'name': 'Inventory',
            'route': '/admin/inventory',
            'icon': 'fal fa-cube'
        },
        {
            'name': 'Allocation',
            'route': '/admin/allocation',
            'icon': 'fal fa-pie-chart'
        },
        {
            'name': 'Packing List',
            'route': '/admin/packing-list',
            'icon': 'fal fa-tasks'
        },
        {
            'name': 'Account Management',
            'route': '/admin/account',
            'icon': 'fal fa-user'
        },
        {
            'name': 'Reports',
            'route': '/admin/reports',
            'icon': 'fal fa-file'
        },
        {
            'name': 'System Health',
            'route': '/admin/health',
            'icon': 'fal fa-heart'
        }
    ],
    'volunteer': [
        {
            'name': 'Home',
            'route': '/volunteer/home',
            'icon':'fal fa-home'
        },
        {
            'name': 'Stocktaking',
            'route': '/volunteer/stock-taking',
            'icon':'fal fa-qrcode'
        },
        {
            'name': 'Packing List',
            'route': '/volunteer/packing-list',
            'icon':'fal fa-tasks'
        }
    ],
    'beneficiary': [
        {
            'name': 'Home',
            'route': '/beneficiary/home',
            'icon': 'fal fa-home'
        },
        {
            'name': 'Request',
            'route': '/beneficiary/request',
            'icon': 'fal fa-plus'
        }
    ]
};

export default navbarRoutes;
