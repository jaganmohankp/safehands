import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import Globals from '@config/globals';
import services from '@config/services';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

/*

    THIS WEBSOCKET SERVICE MONITORS THE SYSTEM HEALTH OF THE BACKEND SERVICE

*/

@Injectable()
    export class SystemService {

    private client: any;
    private websocket: string;
    private topic: string;
    private listener: string;
    private result: BehaviorSubject<any>;
    private subscription: any;

    constructor () {
        this.websocket = services.admin.system['websocket'];
        this.topic = services.admin.system['topic'];
        this.listener = services.admin.system['listener'];
    }

    /* ESTABLISH WEBSOCKET CONNECTION WITH BACKEND */
    public connect () {

        this.result = new BehaviorSubject<any>(null);
        let socket = new SockJS(this.websocket);
        this.client = Stomp.over(socket);
        if (!Globals.VERBOSE) this.client.debug = null;

        this.client.connect({}, (frame) => {

            this.client.send(this.listener, {}, '');

            this.subscription = this.client.subscribe(this.topic, (res: any) => {
                if (res) {
                    res.loaded = true;
                    this.result.next(res);
                }
            });

        });

    }

    /* DISCONNECT WEBSOCKET */
    public disconnect () {
        if (this.subscription) this.subscription.unsubscribe();
        if (this.client) this.client.disconnect();
        if (this.result) this.result.unsubscribe();
    }

    /* GET RESULT OBSERVABLE */
    public response (): Observable<any> {
        return this.result.asObservable();
    }

}
