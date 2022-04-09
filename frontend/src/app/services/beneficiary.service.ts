import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModal } from '@app/components/confirm-modal/confirm-modal.component';
import services from '@config/services';

/*

    THIS SERVICE CONTAINS ALL THE REST API NEEDED FOR BENEFICIARY FUNCTIONS

*/

@Injectable()
export class BeneficiaryService {

    constructor (private http: HttpService, private dialog: MatDialog) {}

    /*--------------------------------General---------------------------------*/

    /* GET WINDOW STATUS */
    public getWindow () {
        return this.http.get(services['window-status']);
    }

    /*---------------------------------Home-----------------------------------*/

    /* SHOW DELETE REQUEST CONFIRMATION DIALOG */
    public confirmDeleteRequestDialog (title: string, message: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW REQUEST SIMILAR ITEMS CONFIRMATION DIALOG */
    public confirmRequestSimilarItemsDialog (title: string, message: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* GET ALLOCATION APPROVAL STATUS */
    public getApprovalStatus () {
        return this.http.get(services.beneficiary.home['get-approval-status']);
    }

    /* DISPLAY CURRENT WINDOW REQUESTS */
    public getCurrentWindowRequest (params: any) {
        return this.http.get(services.beneficiary.home['curr-win-req'], params);
    }

    /* DISPLAY CURRENT WINDOW ALLOCATION RESULTS */
    public getCurrentWindowAllocation (params: any) {
        return this.http.get(services.beneficiary.home['curr-alloc'], params);
    }

    /* UPDATE REQUEST */
    public updateRequest (params: any) {
        return this.http.post(services.beneficiary.home['update-request'], params);
    }

    /* DELETE REQUEST */
    public deleteRequest (params: any) {
        return this.http.delete(services.beneficiary.home['delete-request'], params);
    }

    /* DISPLAY REQUEST HISTORY */
    public getRequestHistory (params: any) {
        return this.http.get(services.beneficiary.home['display-req-hist'], params);
    }

    /* REQUEST SIMILAR ITEMS */
    public requestSimilarItems (params: any) {
        return this.http.post(services.beneficiary.home['similar-items'], params);
    }

    /*-------------------------------Request---------------------------------*/

    /* GET INVENTORY */
    public getInventory () {
        return this.http.get(services.beneficiary.request['display-inventory']);
    }

    /* CREATE REQUEST */
    public createRequest (params: any) {
        return this.http.post(services.beneficiary.request['solo-create-request'], params);
    }

}
