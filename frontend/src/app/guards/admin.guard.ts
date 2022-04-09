import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { UserService } from '@services/user.service';
import Globals from '@config/globals';

@Injectable()
export class AdminGuard implements CanLoad {

    constructor(private router: Router, private userSvc: UserService) { }

    canLoad () {
        let usertype = this.userSvc.getUsertype();
        if (usertype) {
            if (usertype === Globals.ADMIN) {
                return true;
            }
            let redirectUrl = '/' + usertype + '/home';
            this.router.navigate([ redirectUrl ]);

        } else {
            this.router.navigate([ '/sessions/login' ]);
        }
        return false;
    }

}
