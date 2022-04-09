import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BeneficiaryService, UserService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'ben-home',
    templateUrl: './home.component.html'
})

export class BeneficiaryHomeComponent implements OnInit {

    public reqCriteria = '';
    public histCriteria = '';
    public reqData: any;
    public histData: any = [];
    public window: boolean;
    public approvalStatus: boolean;
    public reqPager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 5
    };
    public histPager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 5
    };
    private fullReqData: any;
    private fullHistData: any;
    private reqTree: any;

    constructor (
        public pgSvc: PaginationService,
        private benSvc: BeneficiaryService,
        private usrSvc: UserService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.loadWindowRequests();
        this.loadRequestHistory();
    }

    /* FILTER PAGE DATA */
    public onFilter (field: string, refresh: boolean) {
        switch (field) {
            case Globals.REQUEST:
                this.reqData = this.fullReqData.filter(e => e.description.toLowerCase().includes(this.reqCriteria));
                if (refresh) this.reqPager.page = 1;
                this.pgSvc.loadPage(this.reqData, this.reqPager);
                break;
            case Globals.HISTORY:
                this.histData = this.fullHistData.filter(e => e.date.toLowerCase().includes(this.histCriteria));
                if (refresh) this.histPager.page = 1;
                this.pgSvc.loadPage(this.histData, this.histPager);
                break;
        }

    }

    /* EDIT REQUEST */
    public onEdit (item: any) {
        item.edit = !item.edit;
        if (!item.edit) {
            if (item.requestedQuantity > 0) {
                if (this.reqTree[DataUtil.keygen(item)] !== item.requestedQuantity) {
                    this.progSvc.load();
                    this.benSvc.updateRequest({
                        beneficiary: this.usrSvc.getUsername(),
                        category: item.category,
                        classification: item.classification,
                        description: item.description,
                        quantity: item.requestedQuantity
                    }).subscribe(
                        (res: any) => {
                            DataUtil.processResponse(res,
                                (result) => {
                                    this.reqTree[DataUtil.keygen(item)] = item.requestedQuantity;
                                    this.fullReqData = _.cloneDeep(this.reqData);
                                    this.pgSvc.loadPage(this.reqData, this.reqPager);
                                    this.snackBar.open('Successfully updated!', 'Close', {
                                        duration: 2000,
                                    });
                                },
                                () => {
                                    item.requestedQuantity = this.reqTree[DataUtil.keygen(item)];
                                    this.pgSvc.loadPage(this.reqData, this.reqPager);
                                    this.snackBar.open('Please try again!', 'Close', {
                                        duration: 2000,
                                    });
                                }
                            );
                        },
                        (err) => { Globals.print(err) },
                        () => { this.progSvc.complete() }
                    );
                }
            } else {
                this.onDelete(item);
            }
        }
    }

    /* DELETE REQUEST */
    public onDelete (item: any) {
        let title = 'Confirmation';
        let message = 'This will remove the item from your requests. Are you sure?';
        this.benSvc.confirmDeleteRequestDialog(title, message).subscribe((confirm: any) => {
            if (confirm) {
                this.progSvc.load();
                this.benSvc.deleteRequest({
                    beneficiary: this.usrSvc.getUsername(),
                    id: item.id
                }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.fullReqData = this.fullReqData.filter(itm => {
                                    return !(
                                        itm.category === item.category &&
                                        itm.classification === item.classification &&
                                        itm.description === item.description
                                    );
                                });
                                let index = 1;
                                this.fullReqData.forEach(e => e.sn = index++);
                                this.onFilter(Globals.REQUEST, false);
                                this.pgSvc.loadPage(this.reqData, this.reqPager);
                                this.snackBar.open('Successfully deleted!', 'Close', {
                                    duration: 2000,
                                });
                            },
                            () => {
                                this.snackBar.open('Please try again!', 'Close', {
                                    duration: 2000,
                                });
                            }
                        );
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
            }
        });
    }

    /* REQUEST FOR SIMILAR ITEMS BASED ON DATE */
    public onRequestSimilar (index: number) {
        let title = 'Confirmation';
        let message = 'Are you sure you want to request for similar items?';
        this.benSvc.confirmRequestSimilarItemsDialog(title, message).subscribe((dialogRes: any) => {
            if (dialogRes === true) {
                this.benSvc.requestSimilarItems({
                    beneficiary: this.usrSvc.getUsername(),
                    index: index
                }).subscribe((res: any) => {
                    DataUtil.processResponse(res,
                        (result: any) => {
                            this.loadCurrentWindowRequests();
                            this.snackBar.open('Items successfully requested!', 'Close', {
                                duration: 2000,
                            });
                        },
                        () => {
                            this.snackBar.open('Something went wrong!', 'Close', {
                                duration: 2000,
                            });
                        }
                    );
                });
            }
        });
    }

    /* LOAD WINDOW REQUESTS */
    private loadWindowRequests () {
        this.progSvc.load();
        this.benSvc.getWindow().subscribe(
            (res1: any) => {
                DataUtil.processResponse(res1, (result1) => {
                    this.window = result1.windowStatus;
                    if (this.window) {
                        this.loadCurrentWindowRequests();
                    } else {
                        this.loadAllocationResults();
                    }
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* LOAD CURRENT WINDOW REQUESTS */
    private loadCurrentWindowRequests () {
        this.progSvc.load();
        this.benSvc.getCurrentWindowRequest({
            beneficiary: this.usrSvc.getUsername()
        }).subscribe(
            (res2: any) => {
                DataUtil.processResponse(res2, (result2) => {
                    this.reqData = this.processData(result2, Globals.CURRENT_WINDOW_REQUEST);
                    this.fullReqData = _.cloneDeep(this.reqData);
                    this.reqTree = {};
                    this.reqData.forEach((e: any) => {
                        this.reqTree[DataUtil.keygen(e)] = e.requestedQuantity;
                    });
                    this.pgSvc.loadPage(this.reqData, this.reqPager);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* LOAD ALLOCATION RESULTS */
    private loadAllocationResults () {
        this.progSvc.load();
        this.benSvc.getApprovalStatus().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.approvalStatus = result;
                    if (this.approvalStatus) {
                        this.progSvc.load();
                        this.benSvc.getCurrentWindowAllocation({
                            beneficiary: this.usrSvc.getUsername()
                        }).subscribe(
                            (res2: any) => {
                                DataUtil.processResponse(res2, (result2) => {
                                    this.reqData = this.processData(result2, Globals.CURRENT_WINDOW_ALLOCATION);
                                    this.fullReqData = _.cloneDeep(this.reqData);
                                    this.pgSvc.loadPage(this.reqData, this.reqPager);
                                });
                            },
                            (err) => { Globals.print(err) },
                            () => { this.progSvc.complete() }
                        );
                    } else {
                        this.reqData = [];
                        this.fullReqData = [];
                        this.pgSvc.loadPage(this.reqData, this.reqPager);
                    }
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* LOAD REQUEST HISTORY */
    private loadRequestHistory () {
        this.progSvc.load();
        this.benSvc.getRequestHistory({
            beneficiary: this.usrSvc.getUsername()
        }).subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.histData = this.processData(result, Globals.REQUEST_HISTORY);
                    this.fullHistData = _.cloneDeep(this.histData);
                    this.pgSvc.loadPage(this.histData, this.histPager);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* PROCESS INITIAL DATA FROM BACKEND */
    private processData (data: any, field: string) {
        let res: any = [];
        let index = 1;
        switch (field) {
            case Globals.CURRENT_WINDOW_REQUEST:
                res = data.map((itm: any) => {
                    return {
                        id: itm.id,
                        category: itm.foodItem.category,
                        classification: itm.foodItem.classification,
                        description: itm.foodItem.description,
                        requestedQuantity: itm.requestedQuantity,
                        inventoryQuantity: itm.foodItem.quantity,
                        edit: false
                    };
                }).sort(DataUtil.sortDescription);
                index = 1;
                res.forEach(e => e.sn = index++);
                break;
            case Globals.CURRENT_WINDOW_ALLOCATION:
                res = data.map((itm: any) => {
                    return {
                        id: itm.id,
                        category: itm.category,
                        classification: itm.classification,
                        description: itm.description,
                        requestedQuantity: itm.requestedQuantity,
                        allocatedQuantity: itm.allocatedQuantity
                    };
                }).sort(DataUtil.sortDescription);
                index = 1;
                res.forEach(e => e.sn = index++);
                break;
            case Globals.REQUEST_HISTORY:
                index = 0;
                res = data.map((e: any) => {
                    let date = moment(e.requestCreationDate, 'YYYY-MM-DD');
                    return {
                        index: index++,
                        date: date.format('DD/MM/YYYY'),
                        items: e.pastRequests
                    };
                });
                break;
        }
        return res;
    }

}
