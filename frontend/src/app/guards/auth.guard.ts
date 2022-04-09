import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userSvc: UserService) { }

    canActivate() {
        if (this.userSvc.getUsertype()) {
            return true;
        } else {
            this.router.navigate(['/sessions/login']);
            return false;
        }
    }

}
