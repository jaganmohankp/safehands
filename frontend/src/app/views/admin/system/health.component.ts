import { Component, OnDestroy } from '@angular/core';
import { SystemService } from '@services/services';

@Component({
    selector: 'adm-sys-health',
    templateUrl: './health.component.html'
})

export class AdminSystemHealthComponent implements OnDestroy {

    public log: string[] = [];

    constructor (private ss: SystemService) {}

    ngOnDestroy () {
        this.ss.disconnect();
    }

    /* START TESTING */
    public onStart () {
        this.ss.connect();
        this.ss.response().subscribe((res: any) => {
            if (res) {
                this.log.push(res);
            }
        });
    }

    /* CLEAR CONSOLE */
    public onClear () {
        this.ss.disconnect();
        this.log = [];
    }

    /* RENDER COLORS FOR SUCCESSES AND ERRORS */
    public getResultColor (result: string) {
        if (result.startsWith('[ERROR]')) {
            return 'red';
        } else if (result.startsWith('[SUCCESS]')) {
            return '#a8ff60';
        } else {
            return '#96cbfe';
        }
    }

    /* CONVERY OBJECT TO STRING */
    public objToString (obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + '::' + obj[p] + '\n';
            }
        }
        return str;
    }

}
