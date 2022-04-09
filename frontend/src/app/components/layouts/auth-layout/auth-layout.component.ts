import { Component, OnDestroy } from '@angular/core';
import { ProgressService } from '@services/progress.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'auth-layout',
    templateUrl: './auth-layout.component.html'
})

export class AuthLayoutComponent implements OnDestroy {

    public loading = false;
    private progSubscription: Subscription;

    constructor (private progSvc: ProgressService) {
        this.progSubscription = progSvc.getStatus().subscribe(res => {
            this.loading = res.length !== 0;
        });
    }

    ngOnDestroy () {
        this.progSubscription.unsubscribe();
    }

}
