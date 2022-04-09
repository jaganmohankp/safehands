import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VolunteerService, ProgressService, BreadcrumbService } from '@services/services';
import Globals from '@config/globals';

@Component({
    selector: 'vol-home',
    templateUrl: './home.component.html'
})

export class VolunteerHomeComponent implements OnInit {

    public stockTakeFaqGroupData: any;
    public packingFaqGroupData: any;

    constructor (
        private vlnSvc: VolunteerService,
        private router: Router,
        private progSvc: ProgressService,
        private bcSvc: BreadcrumbService
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.vlnSvc.getQuestionAndAnswers().subscribe(
            (res: any) => {
                if (res) {
                    this.stockTakeFaqGroupData = this.getStockTakeFaqGrpData(res);
                    this.packingFaqGroupData = this.getPackingFaqGrpData(res);
                }
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* NAVIGATE TO SCAN PAGE OR PACKING LIST PAGE */
    public navigate (route) {
        switch (route) {
            case Globals.SCAN:
                this.bcSvc.navigate('/volunteer/stock-taking');
                this.router.navigate(['/volunteer/stock-taking']);
                break;
            case Globals.PACKING_LIST:
                this.bcSvc.navigate('/volunteer/packing-list');
                this.router.navigate(['/volunteer/packing-list']);
                break;
        }
    }

    /* DISPLAY STOCK TAKE FAQ DATA */
    public getStockTakeFaqGrpData (res: any) {
        return res.stocktaking.map(e => {
            return {
                qn: e.qn,
                answer: e.answer,
                toggle: false
            };
        })
    }

    /* DISPLAY PACKING LIST FAQ DATA */
    public getPackingFaqGrpData (res: any) {
        return res.packing.map(e => {
            return {
                qn: e.qn,
                answer: e.answer,
                toggle: false
            };
        })
    }

}
