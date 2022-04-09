import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminInventoryComponent } from './inventory/inventory.component';
import { AdminAllocationComponent } from './allocation/allocation.component';
import { AdminPackingListComponent } from './packing-list/packing-list.component';
import { AdminAccountManagementComponent } from './account/account.component';
import { AdminReportComponent } from './report/report.component';
import { AdminSystemHealthComponent } from './system/health.component';

export const AdminRoutes: Routes = [
    {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        children:[
            {
                path: 'dashboard',
                component: AdminDashboardComponent
            },
            {
                path: 'inventory',
                component: AdminInventoryComponent
            },
            {
                path: 'allocation',
                component: AdminAllocationComponent
            },
            {
                path: 'packing-list',
                component: AdminPackingListComponent
            },
            {
                path: 'account',
                component: AdminAccountManagementComponent
            },
            {
                path: 'reports',
                component: AdminReportComponent
            },
            {
                path: 'health',
                component: AdminSystemHealthComponent
            }
        ]
    }
];
