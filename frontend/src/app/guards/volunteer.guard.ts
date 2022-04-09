import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { UserService } from '@services/user.service';
import Globals from '@config/globals';

@Injectable()
export class VolunteerGuard implements CanLoad {

    constructor(private router: Router, private userSvc: UserService) { }

    canLoad () {
        let usertype = this.userSvc.getUsertype();
        if (usertype) {
            if (usertype === Globals.VOLUNTEER) {
                return true;
            } else if (usertype === Globals.ADMIN) {
                this.router.navigate([ '/admin/dashboard' ]);
            } else if (usertype === Globals.BENEFICIARY) {
                this.router.navigate([ '/beneficiary/home' ]);
            }
        } else {
            this.router.navigate([ '/sessions/login' ]);
        }
        return false;
    }

}
