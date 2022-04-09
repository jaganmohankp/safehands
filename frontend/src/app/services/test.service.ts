import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import services from './../../config/services';

@Injectable()
export class TestService {

    constructor (private httpClient: HttpClient) {

    }

    public testGet () {
        this.httpClient.get(services['test-service']).subscribe(res => {
            console.log(res);
        });
    }

}
