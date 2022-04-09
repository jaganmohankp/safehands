import { Component }    from '@angular/core';
import navbarRoutes     from './../../../../config/routes';

let session = JSON.parse(localStorage.getItem('fb-session'));
const userType = session ? session.usertype : null;

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: [ './navigation.component.css' ]
})

export class NavigationComponent {

    public pages;

    constructor () {
        if (userType) this.pages = navbarRoutes[userType];
    }

}
