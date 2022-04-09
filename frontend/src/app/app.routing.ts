import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './components/layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { ResetPasswordComponent } from '@views/sessions/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { BeneficiaryGuard } from './guards/beneficiary.guard';
import { VolunteerGuard } from './guards/volunteer.guard';

export const rootRouterConfig: Routes = [
    {
        path: '',
        redirectTo: '/sessions/login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'sessions',
                loadChildren: () => import('./views/sessions/sessions.module').then(x => x.SessionsModule)
            }
        ]
    },
    {
        path: '',
        component: BaseLayoutComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
                path: 'admin',
                canLoad: [ AdminGuard ],
                loadChildren: () => import('./views/admin/admin.module').then(x => x.AdminModule)
            },
            {
                path: 'volunteer',
                canLoad: [ VolunteerGuard ],
                loadChildren: () => import('./views/volunteer/volunteer.module').then(x => x.VolunteerModule)
            },
            {
                path: 'beneficiary',
                canLoad: [ BeneficiaryGuard ],
                loadChildren: () => import('./views/beneficiary/beneficiary.module').then(x => x.BeneficiaryModule)
            }
        ]
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },
    {
        path: '**',
        redirectTo: '/sessions/404'
    }
];
