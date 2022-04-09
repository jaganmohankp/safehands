import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, ProgressService } from '@services/services';
import { Subscription } from 'rxjs';
import Globals from '@config/globals';
import DataUtil from '@utils/data.util';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnDestroy {

    public loading = false;
    private progSubscription: Subscription;

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private authSvc: AuthService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {
        this.progSubscription = progSvc.getStatus().subscribe(res => {
            this.loading = res.length !== 0;
        });
    }

    /* CONFIRM RESET PASSWORD */
    public onConfirm () {
        this.progSvc.load();
        let token = this.route.snapshot.params['token'];
        this.authSvc.resetPassword({ token: token }).subscribe(
            (res: any) => {
                DataUtil.processResponse(res,
                    (result: any) => {
                        this.snackBar.open('Password successfully reset! Please check your email for your new password.', 'Close', {
                            duration: 2000,
                        });
                    },
                    () => {
                        this.snackBar.open('Something went wrong. Please contact administrator to reset your password', 'Close', {
                            duration: 2000,
                        });
                    }
                );
                this.router.navigateByUrl('/sessions/login');
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    ngOnDestroy () {
        this.progSubscription.unsubscribe();
    }

}
