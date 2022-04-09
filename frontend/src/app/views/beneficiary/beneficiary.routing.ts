import { Routes } from '@angular/router';
import { BeneficiaryHomeComponent } from './home/home.component';
import { BeneficiaryRequestComponent } from './request/request.component';

export const BeneficiaryRoutes: Routes = [
    {
        path: '',
        redirectTo: '/beneficiary/home',
        pathMatch: 'full'
    },
    {
        path: '',
        children: [
            {
                path: 'home',
                component: BeneficiaryHomeComponent
            },
            {
                path: 'request',
                component: BeneficiaryRequestComponent
            }
        ]
    }
];
