import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { UserService } from '@services/user.service';
import Globals from '@config/globals';

@Injectable()
export class BeneficiaryGuard implements CanLoad {

    constructor(private router: Router, private userSvc: UserService) { }

    canLoad () {
        let usertype = this.userSvc.getUsertype();
        if (usertype) {
            if (usertype === Globals.BENEFICIARY) {
                return true;
            } else if (usertype === Globals.ADMIN) {
                this.router.navigate([ '/admin/dashboard' ]);
            } else if (usertype === Globals.VOLUNTEER) {
                this.router.navigate([ '/volunteer/home' ]);
            }
        } else {
            this.router.navigate([ '/sessions/login' ]);
        }
        return false;
    }

}
