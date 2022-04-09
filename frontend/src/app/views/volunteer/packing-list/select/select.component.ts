import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'vol-select',
    templateUrl: './select.component.html',
    styleUrls: [ './select.component.css' ]
})

export class VolunteerPackingSelectComponent implements OnInit {

    @Input() data: any;
    @Output('next') next = new EventEmitter();
    @Output('selected') selected = new EventEmitter();
    public instruction = "Select a beneficiary packing list to continue. The number of types of items to pack in the list is as indicated in the green label";
    public selectedIndex = -1;
    public haveSelected = false;

    constructor () {}

    ngOnInit () {}

    public onNext () {
        this.next.emit(true);
    }

    public onSelect (beneficiary: any, index: number) {
        this.selectedIndex = index;
        this.haveSelected = true;
        this.selected.emit(beneficiary);
    }

    public showNone () {
        if (this.data) {
            return this.data.filter(e => !e.status).length === 0;
        }
        return false;
    }

}
