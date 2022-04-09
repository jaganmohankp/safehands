import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'adm-al',
    templateUrl: './allocation.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AdminAllocationComponent implements OnInit {

    public approvalStatus: boolean;
    public criteria = '';
    public groups = ['Description', 'Beneficiary'];
    public selectedGroup = 'Description';
    public validAllocation = true;
    public descGroupData: any = [];
    public fullDescGroupData: any;
    public benGroupData: any;
    public fullBenGroupData: any;
    public benPager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };
    public descPager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };

    private allocMap: any;
    private store: any;

    constructor (
        public pgSvc: PaginationService,
        private admSvc: AdminService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getAllocation().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.store = this.generateStore(result);
                    this.allocMap = this.genAllocMap(result);
                    this.benGroupData = this.genBenGrpData(result);
                    this.descGroupData = this.genDescGrpData(result);
                    this.fullBenGroupData = _.cloneDeep(this.benGroupData);
                    this.fullDescGroupData = _.cloneDeep(this.descGroupData);
                    this.pgSvc.loadPage(this.benGroupData, this.benPager);
                    this.pgSvc.loadPage(this.descGroupData, this.descPager);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
        this.progSvc.load();
        this.admSvc.getApprovalStatus().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.approvalStatus = result;
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* TOGGLE ALLOCATED QTY INPUT AND DISPLAY VIEW, AND UPDATE ALLOCATED QTY */
    public toggleEdit (sub, main) {
        sub.edit = !sub.edit;
        sub.icon = !sub.edit ? 'fas fa-fw fa-pencil' : 'fas fa-fw fa-arrow-circle-up';
        if (!sub.edit) {
            let param = {
                id: sub.id,
                beneficiary: sub.username,
                allocatedItems: [
                    {
                        category: main.category,
                        classification: main.classification,
                        description: main.description,
                        allocatedQuantity: Number(sub.allocatedQuantity)
                    }
                ]
            };
            this.onUpdate(param);
        }
    }

    /* FILTER DISPLAY DATA */
    public onFilter (refresh: boolean) {
        this.benGroupData = this.fullBenGroupData.filter(e => {
            return e.name.toLowerCase().includes(this.criteria);
        });
        this.descGroupData = this.fullDescGroupData.filter(e => {
            return (
                e.category.toLowerCase().includes(this.criteria) ||
                e.classification.toLowerCase().includes(this.criteria) ||
                e.description.toLowerCase().includes(this.criteria)
            );
        });
        if (refresh) {
            this.benPager.page = 1;
            this.descPager.page = 1;
        }
        this.pgSvc.loadPage(this.benGroupData, this.benPager);
        this.pgSvc.loadPage(this.descGroupData, this.descPager);
    }

    /* SERVICE CALL TO GENERATE PACKING LIST */
    public onApprove () {
        let title = 'Confirmation';
        let message = 'This will approve all allocations, generate the packing list and cannot be undone.';
        let confirmMsg = 'Are you sure?';
        this.admSvc.confirmApproval(title, message, confirmMsg).subscribe((dialogResponse: boolean) => {
            if (dialogResponse) {
                this.progSvc.load();
                this.admSvc.approveAllocations().subscribe(
                    res => {
                        DataUtil.processResponse(res, (result) => {
                            this.approvalStatus = true;
                        });
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
                this.progSvc.load();
                this.admSvc.generatePackingList().subscribe(
                    res => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.snackBar.open('Successfully approved!', 'Close', {
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

    /* VALIDATION UPON ALLOCATED QUANTITY CHANGE BY USER INPUT */
    public onInputChange (event, item, ben) {
        let value = event.target.value;
        if (value === '') {
            ben.empty = true;
            ben.error = 'This field is empty. Please enter a number.';
            this.validAllocation = false;
        } else {
            ben.empty = false;
            value = Number(value);
            let key = DataUtil.keygen(item);
            let mapQty = this.allocMap[key][ben.username];
            if (mapQty !== value) {
                this.allocMap[key][ben.username] = value;
                this.allocMap[key][Globals.TOTAL] += value - mapQty;
                if (this.allocMap[key][Globals.TOTAL] > item.inventoryQuantity) {
                    ben.valid = false;
                    ben.error = 'You have over allocated this item. Please adjust the other allocations.';
                    this.validAllocation = false;
                } else {
                    item.value.forEach((e: any) => {
                        e.error = '';
                        e.valid = true;
                    });
                    this.validAllocation = true;
                }
            }
        }
    }

    /* SERVICE CALL TO UPDATE ALLOCATION */
    private onUpdate (param: any) {
        let item = param.allocatedItems[0];
        if (this.ifUpdate(param.beneficiary, item)) {
            this.progSvc.load();
            this.admSvc.updateAllocation(param).subscribe(
                (res: any) => {
                    DataUtil.processResponse(res,
                        (result) => {
                            this.updateStore(param);
                            this.fullBenGroupData = _.cloneDeep(this.benGroupData);
                            this.allocMap[DataUtil.keygen(item)][Globals.TOTAL] += item.quantity - this.allocMap[DataUtil.keygen(item)][param.beneficiary];
                            this.allocMap[DataUtil.keygen(item)][param.beneficiary] = item.quantity;
                            this.snackBar.open('Successfully updated!', 'Close', {
                                duration: 2000,
                            });
                        },
                        () => {
                            this.onFilter(false);
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

    /* UPDATE FULL DATASETS */
    private updateStore (data: any) {
        let item = data.allocatedItems[0];
        this.fullDescGroupData.forEach((e: any) => {
            e.value.forEach((ben: any) => {
                if (
                    ben.username === data.beneficiary &&
                    DataUtil.compareItem(e, item)
                ) {
                    ben.allocatedQuantity = item.quantity;
                    return;
                }
            });
        });
        this.benGroupData.forEach((e1: any) => {
            if (e1.username === data.beneficiary) {
                e1.allocatedItems.forEach((e2: any) => {
                    if (DataUtil.compareItem(item, e2)) {
                        e2.allocatedQuantity = item.quantity;
                    }
                });
            }
        });
        this.store[data.beneficiary][DataUtil.keygen(item)] = item.quantity;
    }

    /* GENERATE DESCRIPTION DISPLAY INFORMATION */
    private genDescGrpData (res: any) {
        let obj: any = {};
        res.forEach(e => {
            e.allocatedItems.forEach(itm => {
                let key = DataUtil.keygen(itm) + '|' + itm.inventoryQuantity;
                let data = {
                    id: e.id,
                    name: e.beneficiary.name,
                    username: e.beneficiary.username,
                    requestQuantity: itm.requestedQuantity,
                    allocatedQuantity: itm.allocatedQuantity,
                    edit: false,
                    valid: true,
                    empty: false,
                    error: '',
                    icon: 'fas fa-fw fa-pencil'
                };
                if (obj[key] === undefined) obj[key] = [];
                obj[key].push(data);
            });
        });
        let data = Object.keys(obj).map(key => {
            return {
                category: key.split('|')[0],
                classification: key.split('|')[1],
                description: key.split('|')[2],
                inventoryQuantity: key.split('|')[3],
                value: obj[key].sort((a, b) => {
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                }),
                toggle: false
            }
        }).sort(DataUtil.sortInventory);
        let index = 1;
        data.forEach((e: any) => e.sn = index++);
        return data;
    }

    /* GENERATE BENEFICIARY DISPLAY INFORMATION */
    private genBenGrpData (res: any) {
        let data = res.map(e => {
            return {
                name: e.beneficiary.name,
                username: e.beneficiary.username,
                allocatedItems: e.allocatedItems.sort(DataUtil.sortInventory),
                toggle: false
            };
        }).sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        let index = 1;
        data.forEach((e: any) => e.sn = index++);
        return data;
    }

    /* GENERATE MAPPING OF ALLOCATIONS PER ITEM FOR VALIDATION USE */
    private genAllocMap (res: any) {
        let map: any = {};
        res.forEach((e: any) => {
            e.allocatedItems.forEach((a: any) => {
                let key = DataUtil.keygen(a);
                if (DataUtil.isNone(map[key])) map[key] = {};
                map[key][e.beneficiary.username] = a.allocatedQuantity;
            });
        });
        for (let key1 in map) {
            let totalAlloc = 0;
            for (let key2 in map[key1]) {
                totalAlloc += map[key1][key2];
            }
            map[key1][Globals.TOTAL] = totalAlloc;
        }
        return map;
    }

    /* GENERATE STORE */
    private generateStore (data: any) {
        let store: any = {};
        data.forEach((e1: any) => {
            let key = e1.beneficiary.username;
            store[key] = {};
            e1.allocatedItems.forEach((e2: any) => {
                store[key][DataUtil.keygen(e2)] = e2.allocatedQuantity;
            });
        });
        return store;
    }

    /* CHECK IF ALLOCATED QUANTITY IS UPDATED */
    private ifUpdate (beneficiary: string, item: any) {
        return this.store[beneficiary][DataUtil.keygen(item)] !== item.quantity;
    }

}
