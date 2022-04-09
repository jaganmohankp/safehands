import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'forgot-password-modal',
    templateUrl: './forgot-password-modal.component.html'
})

export class ForgotPasswordModal {

    public email = '';

    constructor (private dialogRef: MatDialogRef<ForgotPasswordModal>) {}

    public onCancel () {
        this.dialogRef.close();
    }

    public onConfirm () {
        this.dialogRef.close({
            email: this.email
        });
    }

}
