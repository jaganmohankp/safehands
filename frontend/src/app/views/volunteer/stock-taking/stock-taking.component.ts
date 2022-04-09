import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScannerService, VolunteerService, ProgressService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import * as _ from 'lodash';

@Component({
    selector: 'vol-stk',
    templateUrl: './stock-taking.component.html',
    providers: [ ScannerService ]
})

export class StockTakingComponent implements OnInit {

    @ViewChild('file', {static: true}) file: ElementRef;
    public invForm: FormGroup;
    public donors: any;
    public donorName = '';
    public categories: any;
    public classifications: any;
    public descriptions: any;
    public halal: boolean;
    public non_halal: boolean;
    public measurements: any;
    public barcode = '';
    public units: any = [
        '',
        'g (gram)',
        'kg (kilogram)',
        'ml (millilitre)',
        'l (litre)'
    ];
    private dataTree: any;
    private measurementMap = {
        '50': '50 (1 - 99)',
        '150': '150 (100 - 199)',
        '250': '250 (200 - 299)',
        '350': '350 (300 - 399)',
        '450': '450 (400 - 499)',
        '550': '550 (500 - 599)',
        '650': '650 (600 - 699)',
        '750': '750 (700 - 799)',
        '850': '850 (800 - 899)',
        '950': '950 (900 - 999)',
        '1.5': '1.5 (1.00 - 1.99)',
        '2.5': '2.5 (2.00 - 2.99)',
        '3.5': '3.5 (3.00 - 3.99)',
        '4.5': '4.5 (4.00 - 4.99)',
        '5.5': '5.5 (5.00 - 5.99)',
        '6.5': '6.5 (6.00 - 6.99)',
        '7.5': '7.5 (7.00 - 7.99)',
        '8.5': '8.5 (8.00 - 8.99)',
        '9.5': '9.5 (9.00 - 9.99)',
        '10.5': '10.5 (10.00 - 10.99)',
        '11.5': '11.5 (11.00 - 11.99)',
        '12.5': '12.5 (12.00 - 12.99)',
        '13.5': '13.5 (13.00 - 13.99)',
        '14.5': '14.5 (14.00 - 14.99)',
        '15.5': '15.5 (15.00 - 15.99)',
        '16.5': '16.5 (16.00 - 16.99)',
        '17.5': '17.5 (17.00 - 17.99)',
        '18.5': '18.5 (18.00 - 18.99)',
        '19.5': '19.5 (19.00 - 19.99)'
    };
    private measurementListA = [
        '',
        '50 (1 - 99)',
        '150 (100 - 199)',
        '250 (200 - 299)',
        '350 (300 - 399)',
        '450 (400 - 499)',
        '550 (500 - 599)',
        '650 (600 - 699)',
        '750 (700 - 799)',
        '850 (800 - 899)',
        '950 (900 - 999)',
    ];
    private measurementListB = [
        '',
        '1.5 (1.00 - 1.99)',
        '2.5 (2.00 - 2.99)',
        '3.5 (3.00 - 3.99)',
        '4.5 (4.00 - 4.99)',
        '5.5 (5.00 - 5.99)',
        '6.5 (6.00 - 6.99)',
        '7.5 (7.00 - 7.99)',
        '8.5 (8.00 - 8.99)',
        '9.5 (9.00 - 9.99)',
        '10.5 (10.00 - 10.99)',
        '11.5 (11.00 - 11.99)',
        '12.5 (12.00 - 12.99)',
        '13.5 (13.00 - 13.99)',
        '14.5 (14.00 - 14.99)',
        '15.5 (15.00 - 15.99)',
        '16.5 (16.00 - 16.99)',
        '17.5 (17.00 - 17.99)',
        '18.5 (18.00 - 18.99)',
        '19.5 (19.00 - 19.99)'
    ];
    private unitMap = {
        'g': 'g (gram)',
        'kg': 'kg (kilogram)',
        'ml': 'ml (millilitre)',
        'l': 'l (litre)'
    };

    constructor (
        private scnSvc: ScannerService,
        private vlnSvc: VolunteerService,
        private progSvc: ProgressService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit () {
        this.scnSvc.result.subscribe((res: any) => {
            if (res) {
                this.barcode = res;
                this.progSvc.load();
                this.vlnSvc.getItem({ barcode: this.barcode }).subscribe(
                    (res: any) => {
                        DataUtil.processResponse(res, (result) => {
                            this.classifications = [''].concat(Object.keys(this.dataTree[result.category]));
                            this.descriptions = [''].concat( this.dataTree[result.category][result.classification]);
                            this.initForm(result);
                        });
                    },
                    (err) => { Globals.print(err) },
                    () => { this.progSvc.complete() }
                );
            } else {
                if (res === false) {
                    this.snackBar.open('Failed to detect barcode. Please try again!', 'Close', {
                        duration: 2000,
                    });
                }
            }
        });
        this.progSvc.load();
        this.vlnSvc.getInventory().subscribe(
            (res1: any) => {
                DataUtil.processResponse(res1, (result1) => {
                    this.dataTree = this.generateTree(result1.sort(DataUtil.sortInventory));
                    this.categories = [''].concat(Object.keys(this.dataTree));
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
        this.progSvc.load();
        this.vlnSvc.getDonors().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    this.donors = ['', Globals.OTHERS].concat(result.sort((a, b) => {
                        if (DataUtil.isNone(a)) return 1;
                        if (DataUtil.isNone(b)) return -1;
                        let x = a.toLowerCase();
                        let y = b.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    }));
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
        this.initForm();
    }

    /* CAPTURE IMAGE FOR BARCODE DECODING */
    public onCapture (event) {
        let image = event.target.files[0];
        if (image) {
            this.scnSvc.decodeImage(image);
        }
        this.file.nativeElement.value = '';
    }

    /* FILTER CATEGORY, CLASSIFICATION, DESCRIPTION FIELDS */
    public onFilter (field: string) {
        let donor = this.invForm.get(Globals.DONOR).value;
        let category = this.invForm.get(Globals.CATEGORY).value;
        let classification = this.invForm.get(Globals.CLASSIFICATION).value;
        let description = this.invForm.get(Globals.DESCRIPTION).value;
        let unit = this.invForm.get(Globals.UNIT).value;
        let measurement = this.invForm.get(Globals.MEASUREMENT).value;
        switch (field) {
            case Globals.CATEGORY:
                this.resetClassification();
                this.resetDescription();
                if (DataUtil.notEmptyString(category)) {
                    this.classifications = [''].concat(Object.keys(this.dataTree[category]));
                } else if (DataUtil.isEmptyString(category)) {
                    this.classifications = null;
                }
                break;
            case Globals.CLASSIFICATION:
                this.resetDescription();
                if (DataUtil.notEmptyString(classification)) {
                    this.descriptions = [''].concat(this.dataTree[category][classification]);
                } else if (DataUtil.isEmptyString(classification)) {
                    this.descriptions = null;
                }
                break;
            case Globals.UNIT:
                if (DataUtil.notEmptyString(unit)) {
                    let _unit = unit.split(' ')[0];
                    if (_unit === Globals.UNITS.GRAM || _unit === Globals.UNITS.MILLILITRE) {
                        this.measurements = this.measurementListA;
                    } else if (_unit === Globals.UNITS.KILOGRAM || _unit === Globals.UNITS.LITRE) {
                        this.measurements = this.measurementListB;
                    }
                } else if (DataUtil.isEmptyString(unit)) {
                    this.measurements = null;
                }
                break;
        }
    }

    /* RESET ALL FIELDS */
    public resetForm () {
        this.resetClassification();
        this.resetDescription();
        this.resetMeasurement();
        this.initForm();
        this.barcode = null;
    }

    /* SUBMIT FORM */
    public onSubmit () {
        let description = this.invForm.value.description + '-' +
                          this.invForm.value.measurement.split(' ')[0] +
                          this.invForm.value.unit.split(' ')[0];
        description += this.invForm.value.halal ? '-Halal' : '';
        let donor = this.invForm.value.donor === Globals.OTHERS ?
            this.donorName : this.invForm.value.donor;
        this.vlnSvc.addInventoryItem({
            donorName: donor,
            category: this.invForm.value.category,
            classification: this.invForm.value.classification,
            description: description,
            quantity: Number(this.invForm.value.quantity),
            barcode: this.barcode
        }).subscribe((res: any) => {
            DataUtil.processResponse(res,
                (result) => {
                    this.resetForm();
                    this.barcode = null;
                    let donorsList = this.donors.slice(2);
                    donorsList.push(donor);
                    donorsList.sort();
                    this.donors = ['', Globals.OTHERS].concat(donorsList);
                    this.snackBar.open('Successfully Added!', 'Close', {
                        duration: 2000,
                    });
                },
                () => {
                    this.snackBar.open('Failed to add. Try again!', 'Close', {
                        duration: 2000,
                    });
                }
            );
        });
    }

    /* VALIDATE FORM FIELDS */
    public validateForm () {
        let donorValidity = true;
        if (this.invForm.value.donor === Globals.OTHERS) {
            if (DataUtil.isEmptyString(this.donorName)) {
                donorValidity = false;
            }
        } else {
            if (DataUtil.isEmptyString(this.invForm.value.donor)) {
                donorValidity = false;
            }
        }
        return (
            donorValidity &&
            this.invForm.value.category !== '' &&
            this.invForm.value.classification !== '' &&
            this.invForm.value.description !== '' &&
            this.invForm.value.unit !== '' &&
            this.invForm.value.measurement !== '' &&
            this.invForm.get('quantity').valid &&
            Number(this.invForm.value.quantity) > 0 &&
            this.invForm.get('halal').valid
        );
    }

    /* VALIDATE DONOR FIELDS */
    public invalidDonor () {
        if (this.invForm.value.donor === Globals.OTHERS) {
            return this.invForm.get('donor').touched && DataUtil.isEmptyString(this.donorName);
        } else {
            return this.invForm.get('donor').touched && DataUtil.isEmptyString(this.invForm.value.donor);
        }
    }

    /* PROCESS HALAL CHECKBOXES */
    public onCheck (event, field) {
        let value = event.target.checked;
        switch (field) {
            case Globals.HALAL:
                this.halal = value ? true : false;
                this.non_halal = value ? false : true;
                break;
            case Globals.NON_HALAL:
                this.halal = value ? false : true;
                this.non_halal = value ? true : false;
                break;
        }
        this.invForm.get('halal').setValue(this.halal);
        this.invForm.get('halal').updateValueAndValidity();
    }

    /* GENERATE HIERARCHY OF CATEGORY, CLASSIFICATION, DESCRIPTION */
    private generateTree (data: any) {
        let treeMap: any = {};
        data.forEach(e => {
            let desc = e.description.split('-')[0];
            if (treeMap[e.category]) {
                if (treeMap[e.category][e.classification]) {
                    treeMap[e.category][e.classification].add(desc);
                } else {
                    treeMap[e.category][e.classification] = new Set([ desc ]);
                }
            } else {
                treeMap[e.category] = {};
                treeMap[e.category][e.classification] = new Set([ desc ]);
            }
        });
        Object.keys(treeMap).forEach(cat => {
            Object.keys(treeMap[cat]).forEach(cls => {
                treeMap[cat][cls] = Array.from(treeMap[cat][cls]);
            });
        });
        return treeMap;
    }

    /* INITIALIZE FORM FROM BARCODE MAPPING */
    private initForm (data: any = null) {
        let category = '';
        let classification = '';
        let description = '';
        let unit = '';
        let measurement = '';
        let halal = null;
        this.halal = false;
        this.non_halal = false;
        if (data) {
            let fullDescription = data.description.split('-');
            let regexp = /[a-z]+$/;
            let regoutput = regexp.exec(fullDescription[1]);
            category = data.category;
            classification = data.classification;
            description = fullDescription[0];
            unit = regoutput[0];
            measurement = this.measurementMap[regoutput.input.slice(0, regoutput.index)];
            halal = fullDescription[2] ? true : false;
            this.halal = halal;
            this.non_halal = !halal;
            if (
                unit === Globals.UNITS.GRAM ||
                unit === Globals.UNITS.MILLILITRE
            ) {
                this.measurements = this.measurementListA;
            } else if (
                unit === Globals.UNITS.KILOGRAM ||
                unit === Globals.UNITS.LITRE
            ) {
                this.measurements = this.measurementListB;
            }
            unit = this.unitMap[unit];
        }
        this.invForm = new FormGroup({
            'donor': new FormControl('', Validators.required),
            'category': new FormControl(category, Validators.required),
            'classification': new FormControl(classification, Validators.required),
            'description': new FormControl(description, Validators.required),
            'unit': new FormControl(unit, Validators.required),
            'measurement': new FormControl(measurement, Validators.required),
            'quantity': new FormControl(null, Validators.required),
            'halal': new FormControl(halal, Validators.required)
        });
    }

    /* RESET CLASSIFICATION FIELD */
    private resetClassification () {
        this.invForm.get(Globals.CLASSIFICATION).reset();
        this.classifications = null;
    }

    /* RESET DESCRIPTION FIELD */
    private resetDescription () {
        this.invForm.get(Globals.DESCRIPTION).reset();
        this.descriptions = null;
    }

    /* RESET MEASUREMENTS */
    private resetMeasurement () {
        this.invForm.get(Globals.MEASUREMENT).reset();
        this.measurements = null;
    }

}
