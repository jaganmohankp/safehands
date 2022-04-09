import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'vol-confirm',
    templateUrl: './confirm.component.html'
})

export class VolunteerPackingConfirmComponent implements OnInit {

    @Input() data: any;
    @Output('prev') prev = new EventEmitter();
    @Output('confirm') confirm = new EventEmitter();
    public instructionP1 = 'Please check that all items for ';
    public instructionP2 = ' have been packed before confirming';

    constructor () {}

    ngOnInit () {}

    public onPrev () {
        this.prev.emit(true);
    }

    public onConfirm () {
        this.confirm.emit(true);
    }

}
