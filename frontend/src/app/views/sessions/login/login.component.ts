import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, ProgressService, HttpService } from '@services/services';
import { Router } from '@angular/router';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import { environment } from '@environments/environment';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
  	encapsulation: ViewEncapsulation.None
})

export class LoginComponent {

    @ViewChild('signinForm', {static: true}) signinForm;
    public signinData = { username: '', password: '' };

    constructor (
        private authSvc: AuthService,
        private progSvc: ProgressService,
        private httpSvc: HttpService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    /* LOGIN */
    public signin () {
        this.progSvc.load();
        if (environment.production) {
            this.authSvc.login({
                username: this.signinData.username,
                password: this.signinData.password
            }).subscribe(
                (res: any) => {
                    if (res) {
                        if (res.status === Globals.SUCCESS) {
                            let usertype = res.usertype.toLowerCase();
                            let token = res.result;
                            let session_json = JSON.stringify({
                                username: this.signinData.username,
                                usertype: usertype,
                                token: token
                            });
                            sessionStorage.setItem(Globals.SESSION_STORAGE, session_json);
                            let path = this.getPath(usertype);
                            this.router.navigate([ path ]);
                        } else {
                            this.signinForm.reset();
                            this.snackBar.open('Invalid username/password!', 'Close', {
                                duration: 2000,
                            });
                        }
                    } else {
                        this.signinForm.reset();
                        this.snackBar.open('Please try again!', 'Close', {
                            duration: 2000,
                        });
                    }
                },
                (err) => { Globals.print(err) },
                () => { this.progSvc.complete(); }
            );
        } else {
            let session_json = JSON.stringify({
                username: this.signinData.username,
                usertype: this.signinData.username
            });
            sessionStorage.setItem(Globals.SESSION_STORAGE, session_json);
            let username = this.signinData.username;
            let path = this.getPath(username);
            if (username === Globals.ADMIN || username === Globals.VOLUNTEER || username === Globals.BENEFICIARY) {
                this.router.navigate([ path ]);
            } else {
                this.snackBar.open('Please try again!', 'Close', {
                    duration: 2000,
                });
                sessionStorage.removeItem(Globals.SESSION_STORAGE);
            }
            this.progSvc.complete();
        }
    }

    /* RESET PASSWORD */
    public resetPassword () {
        this.authSvc.openForgotPasswordDialog().subscribe((accountDetails: any) => {
            if (accountDetails) {
                this.progSvc.load();
                this.authSvc.forgotPassword(accountDetails).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result: any) => {
                                this.snackBar.open('A confirmation email has been sent to your account. Please open it to reset your password.', 'Close', {
                                    duration: 5000,
                                });
                            },
                            () => {
                                this.snackBar.open('Please try again!', 'Close', {
                                    duration: 3000,
                                });
                            }
                        )
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete(); }
                );

            }
        });
    }

    /* REDIRECTION PATH */
    private getPath (usertype: string) {
        let path = '/' + usertype + '/';
        switch (usertype) {
            case Globals.ADMIN:
                path += Globals.DASHBOARD;
                break;
            case Globals.VOLUNTEER:
                path += Globals.HOME;
                break;
            case Globals.BENEFICIARY:
                path += Globals.HOME;
                break;
        }
        return path;
    }

}
