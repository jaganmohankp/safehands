import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VolunteerService, ProgressService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'vol-pl',
    templateUrl: './packing-list.component.html'
})

export class VolunteerPackingListComponent implements OnInit {

    public page = 1;
    public data: any;
    public selectedBeneficiary: any = null;

    constructor (
        private volSvc: VolunteerService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.retrievePackingLists();
    }

    /* SUBMIT PACKED PACKING LIST */
    public onConfirm () {
        let title = 'Confirmation';
        let message = 'Are you sure?';
        this.volSvc.confirmSubmitPackingList(title, message).subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                this.progSvc.load();
                this.volSvc.submitPackedItems({
                    id: this.selectedBeneficiary.id,
                    beneficiary: { username: this.selectedBeneficiary.username },
                    packedItems: this.selectedBeneficiary.packedItems.map((e: any) => {
                        return {
                            category: e.category,
                            classification: e.classification,
                            description: e.description,
                            packedQuantity: Number(e.quantity)
                        };
                    })
                }).subscribe(
                    (res: any) => {
                        this.selectedBeneficiary = null;
                        this.goToPage(1);
                        DataUtil.processResponse(res,
                            (result) => {
                                this.snackBar.open('Successfully Packed!', 'Close', {
                                    duration: 2000,
                                });
                            },
                            () => {
                                this.snackBar.open('The packing list has already been submitted!', 'Close', {
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

    /* SELECT PACKING LIST */
    public onSelected (beneficiary) {
        this.selectedBeneficiary = beneficiary;
    }

    /* CHECK IF ALL ITEMS OF PACKING LIST HAS BEEN PACKED */
    public validatePackingList () {
        return (
            this.selectedBeneficiary.packedItems.filter(e => e.packed).length ===
            this.selectedBeneficiary.packedItems.length
        );
    }

    /* RENDER OPACITY FOR CURRENT PAGE */
    public checkEnabled (page: number) {
        if (page !== this.page) {
            return '0.5';
        }
    }

    /* GO TO NEXT PAGE */
    public onNext () {
        this.page++;
    }

    /* GO TO PREVIOUS PAGE */
    public onPrev () {
        this.page--;
        if (this.page === 1) {
            this.retrievePackingLists();
            this.selectedBeneficiary = null;
        };
    }

    /* GO TO PAGE */
    public goToPage (page: number) {
        this.page = page;
        if (this.page === 1) {
            this.retrievePackingLists();
            this.selectedBeneficiary = null;
        };
    }

    /* LOAD PACKING LISTS */
    private retrievePackingLists () {
        this.progSvc.load();
        this.volSvc.getVolunteerPackingList().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.data = result.map((e: any) => {
                        return {
                            id: e.id,
                            username: e.beneficiary.username,
                            name: e.beneficiary.name,
                            status: e.packingStatus,
                            packedItems: e.packedItems.map((e: any) => {
                                e.packed = false;
                                return e;
                            })
                        };
                    }).sort((a, b) => {
                        let x = a.name.toLowerCase();
                        let y = b.name.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

}
