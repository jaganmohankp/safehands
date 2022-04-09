import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModal } from '@components/confirm-modal/confirm-modal.component';
import services from '@config/services';

/*

    THIS SERVICE CONTAINS ALL THE REST API NEEDED FOR VOLUNTEER FUNCTIONS

*/

@Injectable()
export class VolunteerService {

    constructor (private http: HttpService, private dialog: MatDialog) {}

    /*--------------------------Question and Answer--------------------------*/

    /* THIS IS LOCAL DATA FOR QNA, NOT PULLED FROM BACKEND  */
    public getQuestionAndAnswers () {
        return this.http.get(services.volunteer.home['qna-list']);
    }

    /*------------------------------Stocktaking------------------------------*/

    /* DISPLAY INVENTORY */
    public getInventory () {
        return this.http.get(services.volunteer.stocktaking['display-inventory']);
    }

    /* DISPLAY DONORS */
    public getDonors () {
        return this.http.get(services.volunteer.stocktaking['get-donors']);
    }

    /* RETRIEVE ITEM BASED ON BARCODE */
    public getItem (params: any) {
        return this.http.get(services.volunteer.stocktaking['get-item'], params);
    }

    /* ADD INVENTORY ITEM QUANTITY, WITH BARCODE IF EXISTS */
    public addInventoryItem (params: any) {
        return this.http.post(services.volunteer.stocktaking['add-item'], params);
    }

    /*------------------------------Packing List------------------------------*/

    /* SHOW SUBMIT PACKED PACKING LIST CONFIRMATION DIALOG */
    public confirmSubmitPackingList (title: string, message: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* DISPLAY PACKING LISTS */
    public getVolunteerPackingList () {
        return this.http.get(services.volunteer.packinglist['display-list']);
    }

    /* SUBMIT PACKED PACKING LIST ITEMS */
    public submitPackedItems (params: any) {
        return this.http.post(services.volunteer.packinglist['submit-packed'], params);
    }

}
