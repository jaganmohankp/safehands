import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Globals from '@config/globals';

@Component({
    selector: 'cr-acc-modal',
    templateUrl: './create-modal.component.html'
})

export class CreateAccountModal implements OnInit {

    public newAccForm: FormGroup;
    public namelist: string[];
    public usertypes = [Globals.ADMIN, Globals.BENEFICIARY];
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
        'postal',
        'contactPerson',
        'contactNumber',
        'memberType',
        'hasTransport'
    ];

    constructor (
        private dialogRef: MatDialogRef<CreateAccountModal>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.namelist = data.namelist;
    }

    ngOnInit () {
        this.newAccForm = new FormGroup({
            'username': new FormControl(null, [
                Validators.required,
                this.validateName.bind(this)
            ]),
            'name': new FormControl(null, Validators.required),
            'password': new FormControl(null, Validators.required),
            'confirm-password': new FormControl(null, Validators.required),
            'email': new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            'usertype': new FormControl(this.usertypes[0], Validators.required),
            'numBeneficiary': new FormControl(null),
            'address': new FormControl(null),
            'postal': new FormControl(null),
            'contactPerson': new FormControl(null),
            'contactNumber': new FormControl(null),
            'memberType': new FormControl(this.membertypes[0]),
            'hasTransport': new FormControl(this.hasTransportTypes[0])
        });
    }

    public onSelectUsertype (event) {
        let usertype = event.target.value.toLowerCase();
        if (usertype === Globals.BENEFICIARY) {
            this.benFormNames.forEach(e => {
                this.newAccForm.controls[e].setValidators(Validators.required);
            });
        } else {
            this.benFormNames.forEach(e => {
                this.newAccForm.controls[e].setValidators(null);
            });
        }
        this.benFormNames.forEach(e => {
            this.newAccForm.controls[e].updateValueAndValidity();
        });
    }

    public onSubmit () {
        let user: any = {
            username: this.newAccForm.value.username,
            name: this.newAccForm.value.name,
            password: this.newAccForm.value.password,
            email: this.newAccForm.value.email,
            usertype: this.newAccForm.value.usertype.toLowerCase()
        };
        if (user.usertype === Globals.BENEFICIARY) {
            user.numBeneficiary = Number(this.newAccForm.value.numBeneficiary);
            user.address = this.newAccForm.value.address + ', ' + this.newAccForm.value.postal;
            user.score = 100;
            user.contactPerson = this.newAccForm.value.contactPerson;
            user.contactNumber = this.newAccForm.value.contactNumber;
            user.memberType = this.newAccForm.value.memberType;
            user.hasTransport = this.newAccForm.value.hasTransport === Globals.YES;
        }
        this.dialogRef.close(user);
    }

    public onCloseCancel () {
        this.dialogRef.close();
    }

    private validateName (control: FormControl): { [ s: string ]: boolean } {
         if (this.namelist.indexOf(control.value) !== -1) {
             return { 'forbiddenName': true }
         }
         return null;
    }

}
