import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PackingService, ProgressService } from '@services/services';
import Globals from '@config/globals';

@Component({
    selector: 'vol-pack',
    templateUrl: './pack.component.html',
    providers: [ PackingService ]
})

export class VolunteerPackingPackComponent implements OnInit {

    @Input() data: any;
    @Output('next') next = new EventEmitter();
    @Output('prev') prev = new EventEmitter();
    @Output('packedItems') packed = new EventEmitter();
    public instruction = 'You are now packing items for ';
    public loaded = false;

    constructor (
        private pkSvc: PackingService,
        private progSvc: ProgressService
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.pkSvc.connect(this.data);
        this.pkSvc.response().subscribe((res: any) => {
            if (res) {
                for (let i = 0; i < this.data.packedItems.length; i++) {
                    this.data.packedItems[i].packed = res.packedItems[i].itemPackingStatus;
                    this.data.packedItems[i].quantity = res.packedItems[i].packedQuantity;
                }
                this.loaded = true;
                this.progSvc.complete()
            }
        });
    }

    public onUpdate (item: any, itemIndex: number) {
        this.pkSvc.update({
            itemIndex : itemIndex,
            packedQuantity : item.quantity,
            itemPackingStatus : item.packed
        });
    }

    public onNext () {
        this.next.emit(true);
    }

    public onPrev () {
        this.prev.emit(true);
    }

    public getQuantities (max: number) {
        return Array.from(Array(max + 1).keys());
    }

    public validatePackingList () {
        return (
            this.data.packedItems.filter(e => e.packed).length ===
            this.data.packedItems.length
        );
    }

}
