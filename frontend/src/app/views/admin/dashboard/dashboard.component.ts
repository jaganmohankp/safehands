import { Component, OnInit, HostListener, ElementRef, ViewChild, Input, ViewEncapsulation  } from '@angular/core';
import { RequestChartComponent } from './request-chart/request-chart.component';
import { InventoryChartComponent } from './inventory-chart/inventory-chart.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService, ProgressService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as moment from 'moment';

@Component({
    selector: 'adm-dash',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AdminDashboardComponent implements OnInit {

    @ViewChild('multRef', {static: true}) multiplierRef: ElementRef;
    @ViewChild('decayRef', {static: true}) decayRef: ElementRef;
    @ViewChild('reqChartCard', {static: true}) reqChartCard: ElementRef;
    @ViewChild('invChartCard', {static: true}) invChartCard: ElementRef;
    @ViewChild('reqChart', {static: true}) reqChart: RequestChartComponent;
    @ViewChild('invChart', {static: true}) invChart: InventoryChartComponent;

    public windowStatus = false;
    public noOfReq = 0;
    public openDate = '';
    public closeDate = '';
    public days: number;
    public multiplierRate: number;
    public decayRate: number;
    public ratesEdit = 'Edit';
    public dailyPassword = '';
    public reqChartWidth: number;
    public invChartWidth: number;

    private openDateMoment: any;
    private closeDateMoment: any;
    private todayMoment: any;

    constructor (
        private admSvc: AdminService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getDashboardInfo().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.windowStatus = result.windowStatus;
                    this.noOfReq = result.uniqueBeneficiaryCount;
                    this.openDateMoment = moment(result.windowStartDate, 'YYYY-MM-DD').startOf('day');
                    this.openDate = this.openDateMoment.format('D MMM YYYY');
                    this.closeDateMoment = moment(result.windowEndDate, 'YYYY-MM-DD').startOf('day');
                    this.closeDate = this.closeDateMoment.format('D MMM YYYY');
                    this.days = Math.abs(this.openDateMoment.diff(this.closeDateMoment, 'days')) + 1;
                    this.todayMoment = moment(new Date()).startOf('day');
                    this.multiplierRate = result.multiplierRate;
                    this.decayRate = result.decayRate;
                    this.dailyPassword = result.dailyPassword;
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
        this.reqChartWidth = this.reqChartCard.nativeElement.offsetWidth;
        this.invChartWidth = this.invChartCard.nativeElement.offsetWidth;
    }

    /* OPEN/CLOSE WINDOW OR EDIT CLOSING DATE */
    public toggleWindow (action) {
        if (this.windowStatus) {
            if (action.includes('toggle')) {
                let title = 'Close Window';
                let message = 'Are you sure you want to close the window?';
                this.admSvc.confirmCloseWindow(title, message).subscribe((confirm: boolean) => {
                    if (confirm) {
                        this.progSvc.load();
                        this.admSvc.changeWindowStatus({}).subscribe(
                            (res: any) => {
                                DataUtil.processResponse(res,
                                    (result) => {
                                        this.windowStatus = false;
                                        this.reqChart.initialize();
                                        this.invChart.initialize();
                                        this.snackBar.open('Successfully closed!', 'Close', {
                                            duration: 2000,
                                        });
                                    },
                                    () => {
                                        this.snackBar.open('Please try again!', 'Close', {
                                            duration: 2000,
                                        });
                                    }
                                );
                            },
                            (err) => { Globals.print(err) },
                            () => { this.progSvc.complete() }
                        );
                    }
                });
            } else {
                this.admSvc.openRequestWindowDialog(this.openDateMoment, this.closeDateMoment).subscribe((dialogResponse: any) => {
                    if (dialogResponse) {
                        if (dialogResponse.status) {
                            this.progSvc.load();
                            this.admSvc.updateClosingDate({
                                'windowEndDate': dialogResponse.value.format('DD-MM-YYYY')
                            }).subscribe(
                                (res: any) => {
                                    DataUtil.processResponse(res,
                                        (result) => {
                                            this.closeDate = dialogResponse.value.format('D MMM YYYY');
                                            this.closeDateMoment = dialogResponse.value;
                                            this.days = Math.abs(this.openDateMoment.diff(this.closeDateMoment, 'days')) + 1;
                                            this.reqChart.initialize();
                                            this.invChart.initialize();
                                            this.snackBar.open('Successfully updated!', 'Close', {
                                                duration: 2000,
                                            });
                                        },
                                        () => {
                                            this.snackBar.open('Please try again!', 'Close', {
                                                duration: 2000,
                                            });
                                        }
                                    );
                                },
                                (err) => { Globals.print(err) },
                                () => { this.progSvc.complete() }
                            );
                        }
                    }
                });
            }
        } else {
            this.admSvc.openRequestWindowDialog(this.todayMoment, null).subscribe((dialogResponse: any) => {
                if (dialogResponse) {
                    if (dialogResponse.status) {
                        this.progSvc.load();
                        this.admSvc.changeWindowStatus({
                            'windowEndDate': dialogResponse.value.format('DD-MM-YYYY')
                        }).subscribe(
                            (res: any) => {
                                DataUtil.processResponse(res,
                                    (result) => {
                                        this.openDate = this.todayMoment.format('D MMM YYYY');
                                        this.openDateMoment = this.todayMoment;
                                        this.closeDate = dialogResponse.value.format('D MMM YYYY');
                                        this.closeDateMoment = dialogResponse.value;
                                        this.days = Math.abs(this.openDateMoment.diff(this.closeDateMoment, 'days')) + 1;
                                        this.windowStatus = true;
                                        this.reqChart.initialize();
                                        this.invChart.initialize();
                                        this.snackBar.open('Successfully opened!', 'Close', {
                                            duration: 2000,
                                        });
                                    },
                                    () => {
                                        this.snackBar.open('Please try again!', 'Close', {
                                            duration: 2000,
                                        });
                                    }
                                );
                            },
                            (err) => { Globals.print(err) },
                            () => { this.progSvc.complete() }
                        );
                    }
                }
            });
        }
    }

    /* UPDATE RATES */
    public onEditRates () {
        this.ratesEdit = this.ratesEdit === 'Edit' ? 'Update' : 'Edit';
        if (this.ratesEdit === 'Edit') {
            let mRate = Number(this.multiplierRef.nativeElement.value);
            let dRate = Number(this.decayRef.nativeElement.value);
            if (mRate !== this.multiplierRate) {
                let prev = this.multiplierRate;
                this.multiplierRate = mRate;
                this.progSvc.load();
                this.admSvc.updateMultiplier({
                    multiplierRate: mRate
                }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res,
                            (result) => {
                                this.snackBar.open('Successfully updated!', 'Close', {
                                    duration: 2000,
                                });
                            },
                            () => {
                                this.multiplierRate = prev;
                                this.snackBar.open('Please try again!', 'Close', {
                                    duration: 2000,
                                });
                            }
                        );
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
            }
            if (dRate !== this.decayRate) {
                let prev = this.decayRate;
                this.decayRate = dRate;
                this.progSvc.load();
                setTimeout(() => {
                    this.admSvc.updateDecayRate({
                        decayRate: dRate
                    }).subscribe(
                        (res: any) => {
                            DataUtil.processResponse(res,
                                (result) => {
                                    this.snackBar.open('Successfully updated!', 'Close', {
                                        duration: 2000,
                                    });
                                },
                                () => {
                                    this.decayRate = prev;
                                    this.snackBar.open('Please try again!', 'Close', {
                                        duration: 2000,
                                    });
                                }
                            );
                        },
                        (err) => { Globals.print(err) },
                        () => { this.progSvc.complete() }
                    );
                }, 100);
            }
        }
    }

    @HostListener('window:resize', ['$event'])
    private onResize (event) {
        this.reqChartWidth = this.reqChartCard.nativeElement.offsetWidth;
        this.invChartWidth = this.invChartCard.nativeElement.offsetWidth;
    }

}
