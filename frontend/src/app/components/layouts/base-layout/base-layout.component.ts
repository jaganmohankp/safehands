import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService, BreadcrumbService } from '@services/services';
import { SettingsModal } from '@components/settings-modal/settings-modal.component';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';

@Component({
    selector: 'base-layout',
    templateUrl: './base-layout.component.html'
})

export class BaseLayoutComponent implements OnInit {

    /*----------------------------CLASS VARIABLES----------------------------*/

    @ViewChild('sidenav', {static: true}) sidenav;
    public title: string;
    public name: string;
    public role: string;
    public usertype: string;

    /*-----------------------------INITIALISATION-----------------------------*/

    constructor (
        private router: Router,
        private usrSvc: UserService,
        private bcSvc: BreadcrumbService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.navigateRoute(this.router.url);
        this.usrSvc.getUser({ username: this.usrSvc.getUsername() }).subscribe((res: any) => {
            DataUtil.processResponse(res, (result) => {
                this.name = result.name;
                this.usertype = result.usertype;
                if (result.usertype === Globals.ADMIN) {
                    this.role = Globals.ADMINISTRATOR;
                } else {
                    this.role = result.usertype;
                }
            });
        });
        this.bcSvc.getBreadcrumbUpdates().subscribe((bc: any) => {
            this.title = bc;
        });
    }

    /*--------------------------------METHODS--------------------------------*/

    /* NAVIGATE TO PAGE */
    public navigateRoute (route) {
        this.bcSvc.navigate(route);
    }

    /* TOGGLE SIDE NAVIGATION BAR */
    public onToggle () {
        this.sidenav.toggle();
    }

    /* OPEN SETTINGS DIALOG */
    public openSettings () {
        this.sidenav.toggle();
        this.dialog.open(SettingsModal).afterClosed().subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                dialogResponse.username = this.usrSvc.getUsername();
                this.usrSvc.changePassword(dialogResponse).subscribe((res: any) => {
                    DataUtil.processResponse(res,
                        (result) => {
                            this.snackBar.open('Password successfully changed!', 'Close', {
                                duration: 2000,
                            });
                        },
                        () => {
                            this.snackBar.open('Password change failed! Please try again', 'Close', {
                                duration: 2000,
                            });
                        }
                    );
                });
            }
        });
    }

}
