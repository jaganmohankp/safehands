import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@services/user.service';
import navbarRoutes from '@config/routes';

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html'
})

export class NavigationComponent {

    @Input('sidenav') sidenav;
    @Output() routeChange = new EventEmitter();
    public pages: any;
    private usertype: string;

    constructor (private userSvc: UserService) {
        this.usertype = this.userSvc.getUsertype();
        this.pages = navbarRoutes[this.usertype];
    }

    public onNavigate (route) {
        this.routeChange.emit(route);
        this.sidenav.toggle();
    }

}
