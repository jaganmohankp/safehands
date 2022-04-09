import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'adm-inv',
    templateUrl: './inventory.component.html',
    styleUrls: [ './inventory.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class AdminInventoryComponent {

    public criteria = '';
    public categories: any;
    public classifications: any = [];
    public data: any = [];
    public fullData: any = [];
    public selectedCategory = Globals.ALL;
    public selectedClassification = Globals.ALL;
    public pager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };
    public window = true;
    public packing_status = true;
    private dataTree: any = {};
    private store: any;

    constructor (
        public pgSvc: PaginationService,
        private admSvc: AdminService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getWindow().subscribe((res: any) => {
            DataUtil.processResponse(res, (result) => {
                this.window = result.windowStatus;
            });
        })
        this.admSvc.getPackingStatus().subscribe((res: any) => {
            DataUtil.processResponse(res,
                (result) => {
                    this.packing_status = true;
                },
                () => {
                    this.packing_status = false;
                }
            );
        });
        this.admSvc.getInventory().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.store = this.generateStore(result);
                    this.data = this.processData(result);
                    this.fullData = _.cloneDeep(this.data);
                    this.dataTree = this.generateTree(result);
                    this.categories = [Globals.ALL].concat(Object.keys(this.dataTree)).sort();
                    this.pgSvc.loadPage(this.data, this.pager);
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

    /* CREATE NEW ITEM */
    public onAdd () {
        this.admSvc.openCreateItemDialog(this.fullData).subscribe((dialogResponse: any) => {
            if (dialogResponse && dialogResponse.status) {
                this.progSvc.load();
                this.admSvc.createInventoryItem(dialogResponse.item).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                console.log(dialogResponse);
                                this.updateStore(dialogResponse.item, false);
                                this.onFilter(false);
                                this.dataTree = this.generateTree(this.fullData);
                                this.categories = [Globals.ALL].concat(Object.keys(this.dataTree));
                                this.snackBar.open('Successfully created!', 'Close', {
                                    duration: 2000
                                });
                            },
                            () => {
                                this.snackBar.open('Please try again!', 'Close', {
                                    duration: 2000
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

    /* UPDATE ITEM  */
    public onEdit (item: any) {
        item.edit = !item.edit;
        if (!item.edit) {
            if (this.ifUpdated(item)) {
                this.progSvc.load();
                this.admSvc.updateInventoryItem({
                    category: item.category,
                    classification: item.classification,
                    description: item.description,
                    quantity: item.quantity,
                    value: item.value
                }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.updateStore(item);
                                this.snackBar.open('Successfully updated!', 'Close', {
                                    duration: 2000
                                });
                            },
                            () => {
                                this.revertItem(item);
                                this.snackBar.open('Please try again!', 'Close', {
                                    duration: 2000
                                });
                            }
                        );
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
            }
        }
    }

    /* RESET ALL ITEMS TO ZERO QUANTITY */
    public onReset () {
        this.admSvc.confirmResetInventory().subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                this.admSvc.resetInventory(dialogResponse).subscribe((res: any) => {
                    DataUtil.processResponse(res,
                        (result) => {
                            this.fullData.forEach((e: any) => {
                                e.quantity = 0;
                                this.store[e.category][e.classification][e.description] = 0;
                            });
                            this.onFilter(false);
                            this.snackBar.open('Successfully reset inventory!', 'Close', {
                                duration: 2000
                            });
                        },
                        () => {
                            this.snackBar.open('Reset inventory unsuccessful! Please try again!', 'Close', {
                                duration: 2000
                            });
                        }
                    );
                });
            }
        });
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

    /* CHECK STORE IF ITEM QUANTITY OR VALUE IS UPDATED */
    private ifUpdated (item: any) {
        let data = this.store[item.category][item.classification][item.description];
        return data.value !== item.value || data.quantity !== item.quantity;
    }

    /* UPDATE STORE IF ITEM QUANTITY OR VALUE IS UPDATED */
    private updateStore (item: any, exists: boolean = true) {
        if (exists) {
            this.fullData.forEach((e: any) => {
                if (
                    e.category === item.category &&
                    e.classification === item.classification &&
                    e.description === item.description
                ) {
                    e.value = Number(item.value);
                    e.quantity = Number(item.quantity);
                    return;
                }
            });
            this.store[item.category][item.classification][item.description].value = item.value;
            this.store[item.category][item.classification][item.description].quantity = item.quantity;
        } else {
            this.fullData.push({
                sn: 0,
                category: item.category,
                classification: item.classification,
                description: item.description,
                quantity: item.quantity,
                value: item.value,
                edit: false
            });
            let index = 1;
            this.fullData.sort(DataUtil.sortInventory).forEach(e => e.sn = index++);
            if (this.store[item.category]) {
                if (DataUtil.isNone(this.store[item.category][item.classification])) {
                    this.store[item.category][item.classification] = {};
                }
            } else {
                this.store[item.category] = {};
                this.store[item.category][item.classification] = {};
            }
            this.store[item.category][item.classification][item.description] = {
                value: item.value,
                quantity: item.quantity
            };
        }
    }

    /* IF SERVER REQUEST FAILED, REVERT ITEM TO STORE VALUE */
    private revertItem (item: any) {
        let data = this.store[item.category][item.classification][item.description];
        item.value = data.value;
        item.quantity = data.quantity;
    }

    /* PROCESS INITIAL DATA FROM BACKEND */
    private processData (data: any) {
        data.sort(DataUtil.sortInventory);
        data.sort((a, b) => a.value === 0 ? -1 : 0);
        let index = 1;
        return data.map((e: any) => {
            e.sn = index++;
            e.edit = false;
            return e;
        });
    }

    /* CREATE STORE */
    private generateStore (data: any) {
        let map: any = {};
        data.forEach(e => {
            if (map[e.category]) {
                if (DataUtil.isNone(map[e.category][e.classification])) {
                    map[e.category][e.classification] = {};
                }
            } else {
                map[e.category] = {};
                map[e.category][e.classification] = {};
            }
            map[e.category][e.classification][e.description] = {
                value: e.value,
                quantity: e.quantity
            };
        });
        return map;
    }

    /* CREATE HIERARCHY OF CATEGORY, CLASSIFICATION, DESCRIPTION */
    private generateTree (data: any) {
        let tree: any = {};
        data.forEach(e => {
            if (tree[e.category]) {
                tree[e.category].add(e.classification);
            } else {
                tree[e.category] = new Set([Globals.ALL, e.classification]);
            }
        });
        for (let key in tree) {
            tree[key] = Array.from(tree[key]);
        }
        return tree;
    }

}
