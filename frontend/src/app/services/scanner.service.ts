import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Globals from '@config/globals';
import Quagga from 'quagga';

/*

    THIS SERVICE UTILISES THE QUAGGA JS LIBRARY TO DECODE IMAGES INTO BARCODE
    NUMBERS.

    // Note from first developer

    The quagga JS library is incomplete and the image decoding is highly unlikely
    to yield results. The current implementation for the web application is for
    static images only. There exists a solution for live video decoding, but it
    is even more unreliable than the static image processing library. WebRTC for
    browsers are still new at this point in time as well.

    If there are any future improvements to the quagga JS library, or there exists
    other solutions. Kindly do upgrade this web barcode scanner function. Doing so
    would remove the need for a mobile application in the Helping Hands inventory system,
    which was developed mainly for the barcode scanning capabilities.

    https://github.com/serratus/quaggaJS

*/

@Injectable()
export class ScannerService {

    public result = new BehaviorSubject<any>(null);

    /* DECODE BARCODE IMAGE */
    public decodeImage (image) {

        if (image) {

            Quagga.decodeSingle({
                numOfWorkers: 0,
                decoder: {
                    readers: Globals.DECODERS
                },
                src: URL.createObjectURL(image)
            }, (result) => {
                if (result && result.codeResult) {
                    this.result.next(result.codeResult.code);
                } else {
                    this.result.next(false);
                }
            });

        }

    }

}
