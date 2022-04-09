import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModal } from '@components/confirm-modal/confirm-modal.component';
import { RequestWindowModal } from '@admin/dashboard/req-win-modal/req-win-modal.component';
import { CreateItemModal } from '@admin/inventory/create-item-modal/create-item-modal.component';
import { ConfirmResetModal } from '@admin/inventory/confirm-reset-modal/confirm-reset-modal.component';
import { CreateAccountModal } from '@admin/account/create-modal/create-modal.component';
import { ViewAccountModal } from '@admin/account/view-modal/view-modal.component';
import services from '@config/services';

/*

    THIS SERVICE CONTAINS ALL THE REST API NEEDED FOR ADMIN FUNCTIONS

*/

@Injectable()
export class AdminService {

    constructor (private http: HttpService, private dialog: MatDialog) {}

    /*--------------------------------General---------------------------------*/

    /* GET WINDOW STATUS */
    public getWindow () {
        return this.http.get(services['window-status']);
    }

    /*-------------------------------Dashboard--------------------------------*/

    /* SHOW REQUEST WINDOW DIALOG */
    public openRequestWindowDialog (startDate, endDate) {
        let dialogRef: MatDialogRef<RequestWindowModal> = this.dialog.open(RequestWindowModal, {
            data: { start: startDate, end: endDate },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW CLOSE WINDOW CONFIRMATION MODAL */
    public confirmCloseWindow (title: string, message: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* DISPLAY ADMIN DASHBOARD INFORMATION */
    public getDashboardInfo () {
        return this.http.get(services.admin.dashboard['display-dashboard']);
    }

    /* GET ALL BENEFICIARY REQUESTS */
    public getRequests () {
        return this.http.get(services.admin.dashboard['display-requests']);
    }

    /* CHANGE WINDOW STATUS */
    public changeWindowStatus (params: any) {
        return this.http.post(services.admin.dashboard['change-window-status'], params);
    }

    /* UPDATE WINDOW CLOSING DATE */
    public updateClosingDate (params: any) {
        return this.http.post(services.admin.dashboard['update-closing-date'], params);
    }

    /* UDPATE MULTIPLIER RATE */
    public updateMultiplier (params: any) {
        return this.http.post(services.admin.dashboard['update-multiplier'], params);
    }

    /* UPDATE DECAY RATE */
    public updateDecayRate (params: any) {
        return this.http.post(services.admin.dashboard['update-decay'], params);
    }

    /*-------------------------------Inventory--------------------------------*/

    /* SHOW CREATE ITEM DIALOG */
    public openCreateItemDialog (data: any) {
        let dialogRef: MatDialogRef<CreateItemModal> = this.dialog.open(CreateItemModal, {
            data: data,
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW RESET INVENTORY CONFIRMATION */
    public confirmResetInventory () {
        let dialogRef: MatDialogRef<ConfirmResetModal> = this.dialog.open(ConfirmResetModal, {
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* GET STATUS OF WHETHER ALL ITEMS ARE PACKED */
    public getPackingStatus () {
        return this.http.get(services.admin.inventory['packing-status']);
    }

    /* DISPLAY INVENTORY */
    public getInventory () {
        return this.http.get(services.admin.inventory['display-inventory']);
    }

    /* CREATE NEW INVENTORY ITEM */
    public createInventoryItem (params: any) {
        return this.http.put(services.admin.inventory['create-inventory'], params);
    }

    /* RESET ALL INVENTORY QUANTITY TO ZERO */
    public resetInventory (params: any) {
        return this.http.post(services.admin.inventory['reset-inventory'], params);
    }

    /* UPDATE INVENTORY ITEM */
    public updateInventoryItem (item) {
        return this.http.post(services.admin.inventory['update-inventory'], item);
    }

    /*------------------------------Allocation--------------------------------*/

    /* SHOW APPROVE ALLOCATION CONFIRMATION DIALOG */
    public confirmApproval (title: string, message: string, confirmMsg: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message, confirmMsg: confirmMsg },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* DISPLAY ALLOCATION */
    public getAllocation () {
        return this.http.get(services.admin.allocation['display-allocations']);
    }

    /* UPDATE ALLOCATION */
    public updateAllocation (params: any) {
        return this.http.post(services.admin.allocation['update-allocation'], params);
    }

    /* GENERATE PACKING LISTS AFTER ALLOCATION APPROVAL CONFIRMATION */
    public generatePackingList () {
        return this.http.post(services.admin.allocation['generate-list']);
    }

    /* APPROVE ALLOCATIONS */
    public approveAllocations () {
        return this.http.post(services.admin.allocation['approve-allocations']);
    }

    /* GET STATUS ON ALLOCATION APPROVAL */
    public getApprovalStatus () {
        return this.http.get(services.admin.allocation['get-approval-status']);
    }

    /*-----------------------------Packing List-------------------------------*/

    /* DISPLAY PACKING LISTS */
    public getPacking () {
        return this.http.get(services.admin.packinglist['display-packing-list']);
    }

    /*--------------------------Account Management----------------------------*/

    /* SHOW ACCOUNT INFORMATION DIALOG */
    public openViewAccountDialog (user: any, beneficiaryDetails: any) {
        let dialogRef: MatDialogRef<ViewAccountModal> = this.dialog.open(ViewAccountModal, {
            data: {
                user: user,
                beneficiary: beneficiaryDetails
            },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW ACCOUNT CREATION DIALOG */
    public openCreateAccountDialog (namelist: string[]) {
        let dialogRef: MatDialogRef<CreateAccountModal> = this.dialog.open(CreateAccountModal, {
            data: { namelist: namelist },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW DELETE USER CONFIRMATION DIALOG */
    public confirmDeleteUserDialog (title: string, message: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: { title: title, message: message },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* SHOW PASSWORD RESET CONFIRMATION DIALOG */
    public confirmResetPasswordDialog (title: string, message: string, username: string, messagePt2: string, confirmMsg: string) {
        let dialogRef: MatDialogRef<ConfirmationModal> = this.dialog.open(ConfirmationModal, {
            data: {
                title: title,
                message: message,
                confirmMsg: confirmMsg,
                username: username,
                messagePt2: messagePt2
            },
            disableClose: true
        });
        return dialogRef.afterClosed();
    }

    /* DISPLAY USERS */
    public getUsers () {
        return this.http.get(services.admin.accounts['display-accounts']);
    }

    /* DISPLAY BENEFICIARY */
    public getBeneficiary (params: any) {
        return this.http.get(services.admin.accounts['display-beneficiary'], params);
    }

    /* CREATE USER */
    public createUser (params: any) {
        return this.http.put(services.admin.accounts['create-account'], params);
    }

    /* CREATE BENEFICIARY */
    public createBeneficiary (params: any) {
        return this.http.put(services.admin.accounts['create-beneficiary'], params);
    }

    /* UPDATE USER */
    public updateUser (params: any) {
        return this.http.post(services.admin.accounts['update-account'], params);
    }

    /* UPDATE BENEFICIARY */
    public updateBeneficiary (params: any) {
        return this.http.post(services.admin.accounts['update-beneficiary'], params);
    }

    /* RESET PASSWORD */
    public resetPassword (params: any) {
        return this.http.post(services.admin.accounts['reset-password'], params);
    }

    /* DELETE USER */
    public deleteUser (params: any) {
        return this.http.delete(services.admin.accounts['delete-account'], params);
    }

    /*-------------------------------Reports----------------------------------*/

     /* GET LIST OF INVOICE NUMBERS */
     public getInvoiceNumbers () {
         return this.http.get(services.admin.reports['display-invoice-numbers']);
     }

     /* GET INVOICE DISPLAY INFORMATION */
     public getInvoice (params: any) {
         return this.http.get(services.admin.reports['get-invoice'], params);
     }

     /* GENERATE INVOICE AFTER FILLING IN DETAILS */
     public generateInvoice (params: any) {
         return this.http.post(services.admin.reports['generate-invoice'], params);
     }

     /* GET INVOICE PDF URL */
     public retrieveInvoice (params: any) {
         return this.http.get(services.admin.reports['retrieve-invoice'], params);
     }

}
