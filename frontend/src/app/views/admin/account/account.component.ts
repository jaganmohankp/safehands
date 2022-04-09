import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService, ProgressService, PaginationService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'adm-acc',
    templateUrl: './account.component.html'
})

export class AdminAccountManagementComponent implements OnInit {

    public headers = ['#', 'Username', 'Name', 'Email', 'Account Type', 'Action'];
    public userTypes = [Globals.ALL, Globals.ADMIN, Globals.BENEFICIARY, Globals.VOLUNTEER];
    public accountType = Globals.ALL;
    public criteria = '';
    public data: any;
    public fullData: any;
    public newUser: any = {};

    public pager = {
        page: 1,
        data: [],
        pagesToShow: 3,
        pageSize: 10
    };

    constructor (
        public pgSvc: PaginationService,
        private admSvc: AdminService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getUsers().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.data = this.processData(result);
                    this.fullData = _.cloneDeep(this.data);
                    this.pgSvc.loadPage(this.data, this.pager);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* FILTER PAGE DATA */
    public onFilter (refresh: boolean) {
        let type = '';
        if (this.accountType !== Globals.ALL) type = this.accountType;
        this.data = this.fullData.filter(item => (
            item.usertype.toLowerCase().includes(type) &&
            (
                item.name.toLowerCase().includes(this.criteria.toLowerCase()) ||
                item.username.toLowerCase().includes(this.criteria.toLowerCase()) ||
                item.email.toLowerCase().includes(this.criteria.toLowerCase()) ||
                item.usertype.toLowerCase().includes(this.criteria.toLowerCase())
            )
        ));
        if (refresh) this.pager.page = 1;
        this.pgSvc.loadPage(this.data, this.pager);
    }

    /* CREATE USER OR BENEFICIARY */
    public onCreate () {
        let namelist = this.fullData.map(e => e.username);
        this.admSvc.openCreateAccountDialog(namelist).subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                this.progSvc.load();
                if (dialogResponse.usertype === Globals.BENEFICIARY) {
                    this.admSvc.createBeneficiary({
                        username: dialogResponse.username,
                        name: dialogResponse.name,
                        password: dialogResponse.password,
                        email: dialogResponse.email,
                        address: dialogResponse.address,
                        numBeneficiary: dialogResponse.numBeneficiary,
                        contactPerson: dialogResponse.contactPerson,
                        contactNumber: dialogResponse.contactNumber,
                        memberType: dialogResponse.memberType,
                        hasTransport: dialogResponse.hasTransport,
                        score: dialogResponse.score
                    }).subscribe(
                        (res: any) => {
                            DataUtil.processResponse(res,
                                (result) => {
                                    this.fullData.push({
                                        sn: 0,
                                        username: dialogResponse.username,
                                        usertype: dialogResponse.usertype,
                                        name: dialogResponse.name,
                                        password: dialogResponse.password,
                                        email: dialogResponse.email
                                    });
                                    this.fullData.sort((a, b) => {
                                        let x = a.name.toLowerCase();
                                        let y = b.name.toLowerCase();
                                        return x < y ? -1 : x > y ? 1 : 0;
                                    });
                                    let index = 1;
                                    this.fullData.forEach(e => e.sn = index++);
                                    this.onFilter(false);
                                    this.snackBar.open('Successfully created!', 'Close', {
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
                } else {
                    this.admSvc.createUser(dialogResponse).subscribe(
                        (res: any) => {
                            DataUtil.processResponse(res,
                                (result) => {
                                    dialogResponse.sn = this.fullData.length + 1;
                                    this.fullData.push(dialogResponse);
                                    this.fullData.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0));
                                    let index = 1;
                                    this.fullData.forEach(e => e.sn = index++);
                                    this.onFilter(false);
                                    this.snackBar.open('Successfully created!', 'Close', {
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
        });
    }

    /* VIEW OR EDIT USER DETAILS */
    public onView (user: any) {
        if (user.usertype === Globals.BENEFICIARY) {
            this.progSvc.load();
            this.admSvc.getBeneficiary({
                beneficiary: user.username
            }).subscribe(
                (res: any) => {
                    DataUtil.processResponse(res, (result) => {
                        this.admSvc.openViewAccountDialog(user, result).subscribe((dialogResponse: any) => {
                            if (dialogResponse && dialogResponse.status) {
                                this.updateBeneficiary(user, dialogResponse);
                            }
                        });
                    });
                },
                (err) => { Globals.print(err) },
                () => { this.progSvc.complete() }
            );
        } else {
            this.admSvc.openViewAccountDialog(user, null).subscribe((dialogResponse: any) => {
                if (dialogResponse && dialogResponse.status) {
                    this.updateUser(user, dialogResponse);
                }
            });

        }
    }

    /* RESET PASSWORD FOR USER */
    public onReset (user: any) {
        let title = 'Confirmation';
        let message = `This will reset`;
        let messageName = `${user.name}'s` ;
        let messageEnd = `password.`;
        let confirmMsg = `Are you sure?`;
        this.admSvc.confirmResetPasswordDialog(title, message, messageName, messageEnd, confirmMsg).subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                this.progSvc.load();
                this.admSvc.resetPassword({ username: user.username }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.snackBar.open('Password reset!', 'Close', {
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

    /* DELETE USER */
    public onDelete (user: any) {
        let title = 'Confirmation';
        let message = `Are you sure you want to delete ${user.name}'s account?`;
        this.admSvc.confirmDeleteUserDialog(title, message).subscribe((dialogResponse: any) => {
            if (dialogResponse) {
                this.progSvc.load();
                this.admSvc.deleteUser({ username: user.username }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.fullData = this.fullData.filter(e => e.username !== user.username);
                                this.onFilter(false);
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
                        this.progSvc.complete();
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
            }
        });
    }

    /* UPDATE USER */
    private updateUser (user: any, dialogResponse: any) {
        this.progSvc.load();
        this.admSvc.updateUser({
            username: user.username,
            usertype: dialogResponse.user.usertype,
            name: dialogResponse.user.name,
            email: dialogResponse.user.email
        }).subscribe(
            (res: any) => {
                DataUtil.processResponse(res,
                    (result) => {
                        user.usertype = dialogResponse.user.usertype;
                        user.name = dialogResponse.user.name;
                        user.email = dialogResponse.user.email;
                        this.fullData.forEach(e => {
                            if (e.username === user.username) {
                                e.usertype = user.usertype;
                                e.name = user.name;
                                e.email = user.email;
                                return;
                            }
                        });
                        this.snackBar.open('Successfully updated!', 'Close', {
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

    /* UPDATE BENEFICIARY */
    private updateBeneficiary (user: any, dialogResponse: any) {
        this.progSvc.load();
        this.admSvc.updateBeneficiary({
            username: user.username,
            usertype: dialogResponse.user.usertype,
            name: dialogResponse.user.name,
            email: dialogResponse.user.email,
            address: dialogResponse.user.address,
            contactPerson: dialogResponse.user.contactPerson,
            contactNumber: dialogResponse.user.contactNumber,
            memberType: dialogResponse.user.memberType,
            hasTransport: dialogResponse.user.hasTransport,
            score: dialogResponse.user.score,
            numBeneficiary: dialogResponse.user.numBeneficiary
        }).subscribe(
            (res: any) => {
                DataUtil.processResponse(res,
                    (result) => {
                        user.usertype = dialogResponse.user.usertype;
                        user.name = dialogResponse.user.name;
                        user.email = dialogResponse.user.email;
                        this.fullData.forEach(e => {
                            if (e.username === user.username) {
                                e.usertype = user.usertype;
                                e.name = user.name;
                                e.email = user.email;
                                return;
                            }
                        });
                        this.snackBar.open('Successfully updated!', 'Close', {
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

    /* PROCESS DATA FROM INITIAL PULL */
    private processData (data: any) {
        data.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        let index = 1;
        return data.map((e: any) => {
            e.sn = index++;
            return e;
        });
    }

}
