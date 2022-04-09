import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'confirm-modal',
    templateUrl: './confirm-modal.component.html'
})

export class ConfirmationModal {

    public title: string;
    public message: string;
    public confirmMsg: string;
    public username: string;
    public messagePt2: string;

    constructor (
        private dialogRef: MatDialogRef<ConfirmationModal>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.title = data.title;
        this.message = data.message;
        this.confirmMsg = data.confirmMsg;
        this.username = data.username;
        this.messagePt2 = data.messagePt2;
    }

    public onCancel () {
        this.dialogRef.close(false);
    }

    public onConfirm () {
        this.dialogRef.close(true);
    }

}
