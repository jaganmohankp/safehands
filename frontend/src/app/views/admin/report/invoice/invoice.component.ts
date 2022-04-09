import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService, ProgressService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as moment from 'moment';

@Component({
    selector: 'adm-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: [ './invoice.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class AdminInvoiceComponent implements OnInit {

    public invoiceData: any;
    public report_generated = false;
    public delivery = false;
    public self_collect = false;
    public delivery_date: any;
    public delivery_time: any;
    public issued_by: string;
    public comments: string;

    public invoiceNumber: string;
    public invNumList: any;
    public month: string;
    public monthList: any;
    public monthMap: any;

    constructor (private admSvc: AdminService, private progSvc: ProgressService) {}

    ngOnInit () {
        this.progSvc.load();
        this.admSvc.getInvoiceNumbers().subscribe(
            (res1: any) => {
                DataUtil.processResponse(res1, (result1) => {
                    result1.sort((a, b) => {
                        let a_yr = a.invoiceNumber.split('-')[1];
                        let b_yr = b.invoiceNumber.split('-')[1];
                        if (a_yr < b_yr) return 1;
                        if (b_yr > a_yr) return -1;
                        let a_mth = a.invoiceNumber.split('-')[2];
                        let b_mth = b.invoiceNumber.split('-')[2];
                        return a_mth < b_mth ? 1 : a_mth > b_mth ? -1 : 0;
                    });
                    [this.monthList, this.monthMap] = this.groupByMonth(result1);
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* FILTER INVOICE NUMBER */
    public onSelect (field) {
        switch (field) {
            case Globals.MONTH:
                if (DataUtil.notEmptyString(this.month)) {
                    this.invNumList = this.monthMap[this.month];
                } else {
                    this.invNumList = [];
                }
                this.invoiceData = null;
                break;
            case Globals.INVOICE:
                this.loadInvoice(this.invoiceNumber);
                break;
        }
    }

    /* SELECT SELF_COLLECT OR DELIVERY MODES */
    public onCheck (event, field) {
        let value = event.target.checked;
        switch (field) {
            case Globals.DELIVERY:
                this.delivery = value;
                this.self_collect = !value;
                break;
            case Globals.SELF_COLLECT:
                this.delivery = !value;
                this.self_collect = value;
                break;
        }
        if (this.self_collect) {
            this.delivery_date = null;
            this.delivery_time = null;
        }
    }

    /* DOWNLOAD INVOICE */
    public onDownload () {
        if (this.invoiceNumber) {
            this.admSvc.retrieveInvoice({ invoiceNumber: this.invoiceNumber }).subscribe((res: any) => {
                DataUtil.processResponse(res, (result) => {
                    window.open(result);
                });
            });
        }
    }

    /* GENERATE INVOICE FROM BACKEND */
    public onGenerateInvoice () {
        if (
            moment(this.invoiceData.deliveryDate, 'DD/MM/YYYY').format('DD/MM/YYYY') !== moment(this.delivery_date).format('DD/MM/YYYY') ||
            this.invoiceData.deliveryTime !== this.delivery_time ||
            this.invoiceData.issuedBy !== this.issued_by ||
            this.invoiceData.comments !== this.comments ||
            this.invoiceData.deliveryRequired !== this.delivery
        ) {
            this.progSvc.load();
            let dDate = moment(this.delivery_date).format('DD-MM-YYYY');
            let dTime = this.delivery_time;
            if (this.self_collect) {
                dDate = '';
                dTime = '';
            }
            this.admSvc.generateInvoice({
                invoiceNumber: this.invoiceNumber,
                deliveryRequired: this.delivery,
                deliveryDate: dDate,
                deliveryTime: dTime,
                issuedBy: this.issued_by,
                comments: this.comments
            }).subscribe(
                (res) => {
                    DataUtil.processResponse(res, (result) => {
                        this.report_generated = true;
                    });
                },
                (err) => { Globals.print(err) },
                () => { this.progSvc.complete() }
            );
        }
    }

    /* VALIDATE FIELDS FOR INVOICE GENERATION */
    public invalidGenerateFields () {
        if (DataUtil.isNone(this.invoiceData)) return true;
        let deliveryNone = (
            DataUtil.isNone(this.delivery_date) ||
            DataUtil.isNone(this.delivery_time)
        );
        if (!deliveryNone) {
            let deliveryEmpty = (
                this.delivery_date.toString() === Globals.INVALID_DATE &&
                DataUtil.isEmptyString(this.delivery_time)
            );
            let deliveryHalfFilled = (
                (
                    DataUtil.exists(this.delivery_date) &&
                    this.delivery_date.toString() !== Globals.INVALID_DATE &&
                    DataUtil.isEmptyString(this.delivery_time)
                ) ||
                (
                    DataUtil.exists(this.delivery_date) &&
                    this.delivery_date.toString() === Globals.INVALID_DATE &&
                    DataUtil.notEmptyString(this.delivery_time)
                )
            );
            return deliveryEmpty || deliveryHalfFilled;
        } else {
            return this.self_collect ? false : true;
        }
    }

    /* DISPLAY INVOICE DATA */
    private loadInvoice (invoiceNumber: string) {
        if (DataUtil.notEmptyString(invoiceNumber)) {
            this.progSvc.load();
            this.admSvc.getInvoice({ invoiceNumber: invoiceNumber }).subscribe(
                (res2: any) => {
                    DataUtil.processResponse(res2, (result2) => {
                        this.invoiceData = result2;
                        this.report_generated = this.invoiceData.reportGenerated;
                        this.delivery_date = moment(this.invoiceData.deliveryDate, 'DD-MM-YYYY').toDate();
                        this.delivery_time = this.invoiceData.deliveryTime;
                        this.issued_by = this.invoiceData.issuedBy;
                        this.comments = this.invoiceData.comments;
                        this.delivery = this.invoiceData.deliveryRequired;
                        this.self_collect = !this.invoiceData.deliveryRequired;
                        if (this.self_collect) {
                            this.delivery_date = null;
                            this.delivery_time = '';
                        }
                    });
                },
                (err) => { Globals.print(err) },
                () => { this.progSvc.complete() }
            );
        } else {
            this.invoiceData = null;
        }
    }

    /* PROCESS INVOICE LIST NUMBERS */
    private groupByMonth (invoiceList: any) {
        let map: any = {};
        invoiceList.forEach((e: any) => {
            let inv = e.invoiceNumber;
            let key = Globals.MONTH_ENUM[inv.split('-')[2].trim()] + ' ' + inv.split('-')[1].trim();
            if (map[key]) {
                map[key].push(inv);
            } else {
                map[key] = ['', inv];
            }
        });
        let list = [''].concat(Object.keys(map));
        return [list, map];
    }

}
