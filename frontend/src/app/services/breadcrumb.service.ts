import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import navbarRoutes from '@config/routes';

/*

    THIS SERVICE CHANGES THE BREADCRUMB UPON NAVIGATION

*/

@Injectable()
export class BreadcrumbService {

    private breadcrumbSubject = new BehaviorSubject<string>('');

    constructor (private usrSvc: UserService) {}

    /* UPDATE BREADCRUMBS */
    public navigate (route: string) {
        let bc = navbarRoutes[this.usrSvc.getUsertype()].filter((e: any) => route.includes(e.route))[0].name;
        this.breadcrumbSubject.next(bc);
    }

    /* GET BREADCRUMBS OBSERVABLE */
    public getBreadcrumbUpdates () {
        return this.breadcrumbSubject.asObservable();
    }

}
