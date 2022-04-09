import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Globals from '@config/globals';

@Component({
    selector: 'view-acc-modal',
    templateUrl: './view-modal.component.html'
})

export class ViewAccountModal {

    public accForm: FormGroup;
    public editMode = false;

    public membertypes = [
        'Elderly Care',
        'Children Care',
        'Children and Elderly Care',
        'Family Service Centre',
        'Other VWO',
        'Soup Kitchen'
    ];
    public hasTransportTypes = [Globals.YES, Globals.NO];
    private benFormNames = [
        'numBeneficiary',
        'address',
        'contactPerson',
        'contactNumber',
        'memberType',
        'hasTransport'
    ];

    public username: string;
    public name: string;
    public email: string;
    public usertype: string;
    public numBeneficiary: number;
    public address: string;
    public postalCode: string;
    public contactPerson: string;
    public contactNumber: string;
    public memberType: string = this.membertypes[0];
    public hasTransport: string = this.hasTransportTypes[0];

    private score: number;

    constructor (
        private dialogRef: MatDialogRef<ViewAccountModal>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.username = data.user.username;
        this.name = data.user.name;
        this.email = data.user.email;
        this.usertype = data.user.usertype;
        if (data.beneficiary) {
            this.numBeneficiary = Number(data.beneficiary.numBeneficiary);
            let ad = data.beneficiary.address;
            this.address = ad.substring(0, ad.lastIndexOf(','));
            this.postalCode = ad.substring(ad.lastIndexOf(',') + 1);
            this.contactPerson = data.beneficiary.contactPerson;
            this.contactNumber = data.beneficiary.contactNumber;
            this.memberType = data.beneficiary.memberType;
            this.hasTransport = data.beneficiary.hasTransport ? 'Yes' : 'No';
            this.score = data.beneficiary.score;
        }
        this.initFormGroup();
    }

    public toggleEdit () {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.accForm.enable();
        } else {
            this.accForm.disable();
        }
    }

    public onClose () {
        let res: any = { status: false };
        if (!this.editMode) {
            if (!this.compareUserData()) {
                res = {
                    status: true,
                    user: {
                        name: this.accForm.value.name,
                        email: this.accForm.value.email,
                        usertype: this.usertype,
                        numBeneficiary: this.accForm.value.numBeneficiary,
                        address: this.accForm.value.address + ',' + this.accForm.value.postalCode,
                        contactPerson: this.accForm.value.contactPerson,
                        contactNumber: this.accForm.value.contactNumber,
                        memberType: this.accForm.value.memberType,
                        hasTransport: this.accForm.value.hasTransport === 'Yes'
                    }
                };
            }
        }
        this.dialogRef.close(res);
    }

    private compareUserData () {
        let userBoolean = (
            this.name === this.accForm.value.name &&
            this.email === this.accForm.value.email
        );
        let beneficiaryBoolean = true;
        if (this.usertype === Globals.BENEFICIARY) {
            beneficiaryBoolean = (
                this.numBeneficiary === Number(this.accForm.value.numBeneficiary) &&
                this.address === this.accForm.value.address &&
                this.postalCode === this.accForm.value.postalCode &&
                this.contactPerson === this.accForm.value.contactPerson &&
                this.contactNumber === this.accForm.value.contactNumber &&
                this.memberType === this.accForm.value.memberType &&
                this.hasTransport === this.accForm.value.hasTransport
            );
        }
        return userBoolean && beneficiaryBoolean;
    }

    private initFormGroup () {
        this.accForm = new FormGroup({
            'name': new FormControl(this.name, Validators.required),
            'email': new FormControl(this.email, [
                Validators.required,
                Validators.email
            ]),
            'numBeneficiary': new FormControl(this.numBeneficiary),
            'address': new FormControl(this.address),
            'postalCode': new FormControl(this.postalCode),
            'contactPerson': new FormControl(this.contactPerson),
            'contactNumber': new FormControl(this.contactNumber),
            'memberType': new FormControl(this.memberType),
            'hasTransport': new FormControl(this.hasTransport)
        });
        if (this.usertype === Globals.BENEFICIARY) {
            this.benFormNames.forEach(e => {
                this.accForm.controls[e].setValidators(Validators.required);
            });
            this.benFormNames.forEach(e => {
                this.accForm.controls[e].updateValueAndValidity();
            });
        }
        this.accForm.disable();
    }

}
