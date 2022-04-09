import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'topbar',
    templateUrl: './topbar.component.html'
})

export class TopbarComponent {

    @Input() sidenav;

    constructor (
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router
    ) {
        iconRegistry.addSvgIcon(
            'toggle',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/menu-white.svg')
        );
    }

    public toggleSidenav () {
        this.sidenav.toggle();
    }

    public logout () {
        localStorage.removeItem('fb-session');
        this.router.navigate(['/sessions/login']);
    }

}
