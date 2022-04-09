import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
    selector: 'req-win-modal',
    templateUrl: './req-win-modal.component.html'
})

export class RequestWindowModal {

    public start: any = null;
    public end: any = null;
    public title: string = null;

    constructor (
        private dialogRef: MatDialogRef<RequestWindowModal>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.start = data.start.toDate();
        if (data.end) {
            this.title = 'Change Closing Date';
            this.end = data.end.toDate();
        } else {
            this.title = 'Open Window';
        }
    }

    public onCancel () {
        this.dialogRef.close({ status: false });
    }

    public onConfirm () {
        this.dialogRef.close({
            status: true,
            value: moment(this.end).startOf('day')
        });
    }

}
