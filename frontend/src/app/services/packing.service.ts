import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import Globals from '@config/globals';
import services from '@config/services';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

/*

    THIS WEBSOCKET SERVICE ESTABLISHES A LIVE SESSION ON A PACKING LIST, THUS
    ALLOWING MULTIPLE VOLUNTEERS TO VIEW THE LIVE PROGRESS ON THE PACKING LIST

*/

@Injectable()
export class PackingService {

    private id: string;
    private client: any;
    private websocket: string;
    private listener: string;
    private topic: string;
    private result = new BehaviorSubject<any>(null);

    constructor () {}

    /* ESTABLISH WEBSOCKET CONNECTION WITH BACKEND */
    public connect (data: any) {

        this.id = data.id;
        this.websocket = services.volunteer.packinglist['websocket']
        this.listener = services.volunteer.packinglist['listener'] + this.id;
        this.topic = services.volunteer.packinglist['topic'] + this.id;

        let socket = new SockJS(this.websocket);
        this.client = Stomp.over(socket);
        if (!Globals.VERBOSE) this.client.debug = null;

        this.client.connect({}, (frame) => {

            this.client.subscribe(this.topic, (res: any) => {
                if (res) {
                    res.loaded = true;
                    this.result.next(JSON.parse(res.body));
                }
            });

            // INITIALISE PACKING LIST UPON ENTRY, NOTE THAT ITEM INDEX IS -1
            this.update({
                id: this.id,
                itemIndex : -1,
                packedQuantity : 0,
                itemPackingStatus : false
            });

        });
    }

    /* SEND PACKING LIST UPDATES TO SERVER */
    public update (item: any) {
        item.id = this.id;
        this.client.send(this.listener, {}, JSON.stringify(item));
    }

    /* GET RESULT OBSERVABLE */
    public response (): Observable<any> {
        return this.result.asObservable();
    }

}
