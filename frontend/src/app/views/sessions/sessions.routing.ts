import { Routes }                           from '@angular/router';
import { LoginComponent }                   from './login/login.component';
import { PageNotFoundComponent }            from './page-not-found/page-not-found.component';

export const SessionsRoutes: Routes = [
    {
        path: '',
        redirectTo: '/sessions/login',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '404',
        component: PageNotFoundComponent
    }

];
