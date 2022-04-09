import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'confirm-reset-modal',
    templateUrl: './confirm-reset-modal.component.html'
})

export class ConfirmResetModal {

    public password = '';

    constructor (private dialogRef: MatDialogRef<ConfirmResetModal>) {}

    public onConfirm () {
        this.dialogRef.close(this.password);
    }

    public onCancel () {
        this.dialogRef.close();
    }

}
