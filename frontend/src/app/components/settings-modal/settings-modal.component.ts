import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'settings-modal',
    templateUrl: './settings-modal.component.html'
})

export class SettingsModal {

    public oldPassword = '';
    public newPassword = '';
    public confirmPassword = '';
    public touched = {
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    };

    constructor (private dialogRef: MatDialogRef<SettingsModal>) {}

    public onTouched (field: string) {
        this.touched[field] = true;
    }

    public invalidForm () {
        return (
            (!this.touched.oldPassword || !this.touched.newPassword || !this.touched.confirmPassword) ||
            this.touched.oldPassword && this.oldPassword.length === 0 ||
            this.touched.newPassword && this.newPassword.length === 0 ||
            (this.touched.newPassword && this.newPassword.length > 0 && this.newPassword.length < 8) ||
            this.touched.newPassword && this.oldPassword === this.newPassword && this.newPassword.length >= 8 ||
            this.touched.confirmPassword && this.confirmPassword.length === 0 ||
            (this.touched.confirmPassword && this.confirmPassword.length !== 0 && this.newPassword !== this.confirmPassword)
        );
    }

    public onConfirm () {
        this.dialogRef.close({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        });
    }

    public onCancel () {
        this.dialogRef.close();
    }

}
