import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '@services/http.service';
import { ForgotPasswordModal } from '@components/forgot-password-modal/forgot-password-modal.component';
import services from '@config/services';

/*

    THIS SERVICE CONTAINS ALL THE REST API NEEDED FOR AUTHENTICATION FUNCTIONS

*/

@Injectable()
export class AuthService {

    constructor(private http: HttpService, private dialog: MatDialog) {}

    /* OPEN FORGOT PASSWORD DIALOG */
    public openForgotPasswordDialog () {
        let dialogRef: MatDialogRef<ForgotPasswordModal> = this.dialog.open(ForgotPasswordModal, {
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* AUTHENTICATE LOGIN */
    public login (params: any) {
        return this.http.post(services['auth'], params);
    }

    /* FORGOT PASSWORD REQUEST */
    public forgotPassword (params: any) {
        return this.http.post(services['forgot-password'], params);
    }

    /* RESET PASSWORD REQUEST */
    public resetPassword (params: any) {
        return this.http.post(services['reset-password'], params);
    }

}
