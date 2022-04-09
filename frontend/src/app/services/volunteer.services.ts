import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import services from './../../config/services';

interface Inventory {
    donors: Pairs;
}

interface Pairs {
    value: string;
    viewValue: string;
}

@Injectable()
export class VolunteerService {

    constructor (private http: HttpClient) {

    }

    public getVolunteerPackingList () {
        return this.http.get<Inventory>(services['volunteer']['dashboard']);
    }

    public getVolunteerEntryForm(){
        return this.http.get<Inventory>(services['volunteer']['inventory'])
    }

}
