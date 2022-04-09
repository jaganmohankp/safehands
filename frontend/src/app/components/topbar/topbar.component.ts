import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService, ProgressService, NotificationService, BreadcrumbService } from '@services/services';
import { environment } from '@environments/environment';
import Globals from '@config/globals';

@Component({
    selector: 'topbar',
    templateUrl: './topbar.component.html',
    providers: [ NotificationService ]
})

export class TopbarComponent {

    @Input() sidenav: any;
    @Output() sidenavToggle = new EventEmitter();
    public loading = false;
    public usertype: string;
    public inventoryWarning = '';

    constructor (
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router,
        private usrSvc: UserService,
        private progSvc: ProgressService,
        private bcSvc: BreadcrumbService,
        private notSvc: NotificationService
    ) {
        iconRegistry.addSvgIcon(
            'toggle',
            sanitizer.bypassSecurityTrustResourceUrl(
                'assets/images/menu-black.svg'
            )
        );
        progSvc.getStatus().subscribe(res => {
            this.loading = res.length !== 0;
        });
        this.usertype = usrSvc.getUsertype();
        if (environment.production) {
            this.notSvc.connect();
            this.notSvc.response().subscribe((inventoryValueNotSet: any) => {
                if (inventoryValueNotSet) {
                    this.inventoryWarning = 'There are items with a value of $0.00, click here to set their values';
                } else {
                    this.inventoryWarning = '';
                }
            });
        }
    }

    public toggleSidenav () {
        this.sidenavToggle.emit(true);
    }

    public navigateHome () {
        let route = '/' + this.usertype;
        if (this.usertype === Globals.ADMIN) {
            route += '/dashboard';
        } else {
            route += '/home'
        }
        this.bcSvc.navigate(route);
        this.router.navigateByUrl(route);
    }

    public navigateToInventory () {
        if (this.inventoryWarning !== '') {
            let route = '/admin/inventory';
            this.bcSvc.navigate(route);
            this.router.navigateByUrl(route);
        }
    }

    public logout () {
        sessionStorage.removeItem(Globals.SESSION_STORAGE);
        this.router.navigate(['/sessions/login']);
    }

}
