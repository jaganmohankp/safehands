import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BeneficiaryService, UserService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'ben-req',
    templateUrl: './request.component.html'
})

export class BeneficiaryRequestComponent implements OnInit {

    public criteria = '';
    public categories: any;
    public classifications: any = [];
    public data: any;
    public fullData: any;
    public selectedCategory = Globals.ALL;
    public selectedClassification = Globals.ALL;
    public window;

    public pager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };

    private dataTree: any = {};

    constructor (
        public pgSvc: PaginationService,
        private benSvc: BeneficiaryService,
        private usrSvc: UserService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.benSvc.getWindow().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.window = result.windowStatus;
                    if (this.window) {
                        this.progSvc.load();
                        this.benSvc.getInventory().subscribe(
                            (res: any) => {
                                DataUtil.processResponse(res, (result) => {
                                    this.benSvc.getCurrentWindowRequest({
                                        beneficiary: this.usrSvc.getUsername()
                                    }).subscribe(
                                        (res2: any) => {
                                            DataUtil.processResponse(res2, (result2) => {
                                                this.data = this.processData(result, result2);
                                                this.fullData = _.cloneDeep(this.data);
                                                this.dataTree = this.generateTree(result);
                                                this.categories = [Globals.ALL].concat(Object.keys(this.dataTree)).sort();
                                            });
                                            this.pgSvc.loadPage(this.data, this.pager);
                                        },
                                        (err) => { Globals.print(err) },
                                        () => { this.progSvc.complete() }
                                    );
                                });
                            },
                            (err) => { Globals.print(err) },
                            () => { this.progSvc.complete() }
                        );
                    }
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* FILTER PAGE DATA */
    public onFilter (refresh: boolean) {
        this.data = this.fullData.filter(itm => {
            let condition = (
                itm.category.toLowerCase().includes(this.criteria.toLowerCase()) ||
                itm.classification.toLowerCase().includes(this.criteria.toLowerCase()) ||
                itm.description.toLowerCase().includes(this.criteria.toLowerCase())
            );
            if (this.selectedCategory === Globals.ALL) {
                return condition;
            } else {
                if (this.selectedClassification === Globals.ALL) {
                    return condition && itm.category === this.selectedCategory;
                } else {
                    return (
                        condition &&
                        itm.category === this.selectedCategory &&
                        itm.classification === this.selectedClassification
                    );
                }
            }
        });
        if (refresh) this.pager.page = 1;
        this.pgSvc.loadPage(this.data, this.pager);
    }

    /* ADD REQUEST */
    public onAdd (item: any) {
        item.requestedQuantity = Number(item.requestedQuantity);
        if (item.requestedQuantity > 0) {
            this.progSvc.load();
            this.benSvc.createRequest({
                beneficiary: this.usrSvc.getUsername(),
                category: item.category,
                classification: item.classification,
                description: item.description,
                quantity: item.requestedQuantity
            }).subscribe(
                (res: any) => {
                    DataUtil.processResponse(res,
                        (result) => {
                            this.fullDataUpdate(item);
                            this.snackBar.open('Successfully added!', 'Close', {
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
    }

    /* FILTER BY CATEGORY */
    public onSelectCategory (event) {
        this.selectedCategory = event.target.value;
        this.selectedClassification = Globals.ALL;
        if (this.selectedCategory !== Globals.ALL) {
            this.classifications = this.dataTree[this.selectedCategory].sort();
        } else {
            this.classifications = [];
        }
        this.onFilter(true);
    }

    /* FILTER BY CLASSIFICATION */
    public onSelectClassification (event) {
        this.selectedClassification = event.target.value;
        this.onFilter(true);
    }

    /* GET ARRAY OF NUMBERS FOR REQUEST, WITH MAX OF INVENTORY QUANTITY */
    public getNumArr (value: number) {
        return Array.from(new Array(value + 1), (val, index) => index);
    }

    /* PROCESS INITIAL BACKEND DATA */
    private processData (data: any, reqData: any) {
        let res: any;
        res = data.map((e: any) => {
            return {
                category: e.category,
                classification: e.classification,
                description: e.description,
                availableQuantity: e.quantity,
                requestedQuantity: 0
            };
        }).sort(DataUtil.sortInventory);
        let index = 1;
        res.forEach(e => e.sn = index++);
        reqData.forEach((e: any) => {
            let item = e.foodItem;
            res.forEach((e2: any) => {
                if (DataUtil.compareItem(item, e2)) {
                    e2.requestedQuantity = item.quantity;
                }
            });
        });
        return res;
    }

    /* FILL UP QUANTITIES ALREADY REQUESTED */
    private fullDataUpdate (item: any) {
        this.fullData.forEach((e: any) => {
            if (
                e.category === item.category &&
                e.classification === item.classification &&
                e.description === item.description
            ) {
                e.quantity = Number(item.quantity);
                return;
            }
        });
    }

    /* GENERATE HIERARCHY OF CATEGORY, CLASSIFICATION, DESCRIPTION */
    private generateTree (data) {
        let tree: any = {};
        data.forEach(e => {
            if (DataUtil.isNone(tree[e.category])) {
                tree[e.category] = new Set([Globals.ALL]);
            }
            tree[e.category].add(e.classification);
        });
        for (let key in tree) {
            tree[key] = Array.from(tree[key]);
        }
        return tree;
    }

}
