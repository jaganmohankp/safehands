import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

/*

    THIS SERVICE IS A WRAPPER FOR ALL HTTP REQUESTS
    - DIRECTS APPLICATON TO LOCAL OR AWS SERVERS
    - CONVERTS OBJECTS TO HTTPPARAMS FOR GET AND DELETE HTTP METHODS

*/

@Injectable()
export class HttpService {

    constructor (private http: HttpClient) {}

    /* HTTP POST requests */
    public post (url: string, params: any = {}) {
        if (environment.production) {
            return this.http.post(url, params);
        } else {
            return this.http.get(url);
        }
    }

    /* HTTP GET REQUEST */
    public get (url: string, params: any = {}) {
        return this.http.get(url, { params: this.getHttpParams(params) });
    }

    /* HTTP PUT REQUEST */
    public put (url: string, params: any = {}) {
        if (environment.production) {
            return this.http.put(url, params);
        } else {
            return this.http.get(url);
        }
    }

    /* HTTP DELETE REQUEST */
    public delete (url: string, params: any = {}) {
        if (environment.production) {
            return this.http.delete(url, { params: this.getHttpParams(params) });
        } else {
            return this.http.get(url);
        }
    }

    /* CONVERT OBJECT INTO HTTPPARAMS */
    private getHttpParams (params: any): HttpParams {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            httpParams = httpParams.set(key, params[key]);
        });
        return httpParams;
    }

}
