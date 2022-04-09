import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import services from '@config/services';
import Globals from '@config/globals';

/*

    THIS SERVICE MANAGES USER INFORMATION REQUIRED FOR THE APPLICATION

*/

@Injectable()
export class UserService {

    constructor (private http: HttpService) {}

    /* GET USER DETAILS FROM BACKEND */
    public getUser (params: any) {
        return this.http.get(services['user'], params);
    }

    /* GET USERNAME FROM SESSION STORAGE */
    public getUsername () {
        let session = JSON.parse(sessionStorage.getItem(Globals.SESSION_STORAGE));
        return session ? session.username : null;
    }

    /* GET USERTYPE FROM SESSION STORAGE */
    public getUsertype () {
        let session = JSON.parse(sessionStorage.getItem(Globals.SESSION_STORAGE));
        return session ? session.usertype : null;
    }

    /* CHANGE PASSWORD */
    public changePassword (params: any) {
        return this.http.post(services['change-password'], params);
    }

}
