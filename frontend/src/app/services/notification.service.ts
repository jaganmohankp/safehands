import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import Globals from '@config/globals';
import services from '@config/services';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

/*

    THIS WEBSOCKET SERVICE MONITORS WHETHER THERE EXISTS AT LEAST ONE ITEM IN
    THE INVENTORY DATABASE THAT CONTAINS A VALUE OF $0.00, THUS PROMPTING THE
    ADMIN TO UPDATE THE INVENTORY ITEM'S VALUE

*/

@Injectable()
export class NotificationService {

    private client: any;
    private websocket: string;
    private topic: string;
    private result = new BehaviorSubject<any>(null);

    constructor () {
        this.websocket = services.admin.notification['websocket'];
        this.topic = services.admin.notification['topic'];
    }

    /* ESTABLISH WEBSOCKET CONNECTION WITH BACKEND */
    public connect () {

        let socket = new SockJS(this.websocket);
        this.client = Stomp.over(socket);
        if (!Globals.VERBOSE) this.client.debug = null;

        this.client.connect({}, (frame) => {
            this.client.subscribe(this.topic, (res: any) => {
                if (res) {
                    this.result.next(JSON.parse(res.body));
                }
            });
        });
        
    }

    /* GET NOTIFICATIONS OBSERVABLE */
    public response (): Observable<any> {
        return this.result.asObservable();
    }

}
