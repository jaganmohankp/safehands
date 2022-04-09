import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'adm-pl',
    templateUrl: './packing-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AdminPackingListComponent implements OnInit {

    public criteria = '';
    public data: any;

    public pager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };

    private fullData: any;

    constructor (
        public pgSvc: PaginationService,
        private admSvc: AdminService,
        private progSvc: ProgressService
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getPacking().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    result.sort((a, b) => {
                        let aname = a.beneficiary.name.toLowerCase();
                        let bname = b.beneficiary.name.toLowerCase();
                        return aname < bname ? -1 : (aname > bname ? 1 : 0);
                    });
                    let sn = 1;
                    this.data = result.map((e: any) => {
                        return {
                            sn: sn++,
                            toggle: false,
                            status: e.packingStatus,
                            username: e.beneficiary.username,
                            name: e.beneficiary.name,
                            packedItems: e.packedItems.sort(DataUtil.sortInventory)
                        };
                    });
                    this.fullData = _.cloneDeep(this.data);
                    this.pgSvc.loadPage(this.data, this.pager);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* FILTER PAGE DATA */
    public onFilter (refresh: boolean) {
        this.data = this.fullData.filter((e: any) => {
            return e.name.toLowerCase().includes(this.criteria.toLowerCase());
        });
        if (refresh) this.pager.page = 1;
        this.pgSvc.loadPage(this.data, this.pager);
    }

}
