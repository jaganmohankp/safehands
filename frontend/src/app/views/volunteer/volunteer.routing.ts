import { Routes } from '@angular/router';
import { VolunteerHomeComponent } from './home/home.component';
import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { VolunteerPackingListComponent } from './packing-list/packing-list.component';

export const VolunteerRoutes: Routes = [
    {
        path: '',
        redirectTo: '/volunteer/home',
        pathMatch: 'full'
    },
    {
        path: '',
        children:[
            {
                path: 'home',
                component: VolunteerHomeComponent
            },
            {
                path: 'stock-taking',
                component: StockTakingComponent
            },
            {
                path: 'packing-list',
                component: VolunteerPackingListComponent
            }
        ]
    },
];
