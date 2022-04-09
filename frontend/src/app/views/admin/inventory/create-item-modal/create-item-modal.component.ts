import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Globals from '@config/globals';
import DataUtil from '@utils/data.util';

@Component({
    selector: 'create-item-modal',
    templateUrl: './create-item-modal.component.html'
})

export class CreateItemModal {

    /*----------------------------CLASS VARIABLES----------------------------*/

    public category: string = '';
    public classification: string = '';
    public description: string = '';
    public measurement: string = '';
    public unit: string = '';
    public quantity: number = null;
    public value: number = null;
    public halal: boolean = false;

    public catTog1: boolean = false;
    public catTog2: boolean = true;
    public clsTog1: boolean = false;
    public clsTog2: boolean = true;
    public descTog1: boolean = false;
    public descTog2: boolean = true;

    public categories: any = [];
    public classifications: any = [];
    public descriptions: any = [];
    public measurements: any;
    public units: any = [
        '',
        'g (gram)',
        'kg (kilogram)',
        'ml (millilitre)',
        'l (litre)'
    ];
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

    private dataTree: any;

    /*-----------------------------INITIALISATION-----------------------------*/

    constructor (
        private dialogRef: MatDialogRef<CreateItemModal>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.dataTree = this.generateTree(data);
        this.categories = [''].concat(Object.keys(this.dataTree));
    }

    /*--------------------------------METHODS--------------------------------*/

    // CANCEL DIALOG EVENT
    public onCancel () {
        this.dialogRef.close({ status: false });
    }

    // CLOSE DIALOG EVENT WITH NEW INFORMATION
    public onConfirm () {
        let desc = this.description;
        desc += '-' + this.measurement.split(' ')[0] + this.unit.split(' ')[0];
        if (this.halal) desc += '-Halal';
        this.dialogRef.close({
            status: true,
            item: {
                category: this.category,
                classification: this.classification,
                description: desc,
                quantity: this.quantity,
                value: this.value
            }
        });
    }

    // FILTER BY CATEGORY
    public onSelectCategory (event) {
        this.category = event.target.value;
        this.classification = '';
        this.description = '';
        this.descriptions = [];
        if (this.category !== '') {
            this.classifications = [''].concat(Object.keys(this.dataTree[this.category]));
        } else {
            this.classifications = [];
        }
    }

    // FILTER BY CLASSIFICATION
    public onSelectClassification (event) {
        this.classification = event.target.value;
        this.description = '';
        if (this.classification !== '') {
            this.descriptions = [''].concat(this.dataTree[this.category][this.classification]);
        } else {
            this.descriptions = [];
        }
    }

    public onSelectUnit () {
        if (DataUtil.notEmptyString(this.unit)) {
            let _unit = this.unit.split(' ')[0];
            if (_unit === Globals.UNITS.GRAM || _unit === Globals.UNITS.MILLILITRE) {
                this.measurements = this.measurementListA;
            } else if (_unit === Globals.UNITS.KILOGRAM || _unit === Globals.UNITS.LITRE) {
                this.measurements = this.measurementListB;
            }
        } else if (DataUtil.isEmptyString(this.unit)) {
            this.measurements = null;
            this.measurement = '';
        }
    }

    // TOGGLE INPUT AND SELECT FIELDS FOR CATEGORY, CLASSIFICATION AND DESCRIPTION
    public toggleInputs (group: string) {
        switch (group) {
            case Globals.CATEGORY:
                this.catTog1 = !this.catTog1;
                this.clsTog1 = !this.clsTog1;
                this.descTog1 = !this.descTog1;
                this.clsTog2 = !this.clsTog2;
                this.descTog2 = !this.descTog2;
                this.category = '';
                this.classification = '';
                this.description = '';
                this.classifications = [];
                this.descriptions = [];
                break;
            case Globals.CLASSIFICATION:
                this.clsTog1 = !this.clsTog1;
                this.descTog1 = !this.descTog1;
                this.catTog2 = !this.catTog2;
                this.descTog2 = !this.descTog2;
                this.classification = '';
                this.description = '';
                this.descriptions = [];
                if (this.clsTog1) {
                    this.classifications = [];
                } else {
                    this.classifications = [''].concat(Object.keys(this.dataTree[this.category]));
                }
                break;
            case Globals.DESCRIPTION:
                this.descTog1 = !this.descTog1;
                this.catTog2 = !this.catTog2;
                this.clsTog2 = !this.clsTog2;
                this.description = '';
                if (this.descTog1) {
                    this.descriptions = [];
                } else {
                    this.descriptions = [''].concat(this.dataTree[this.category][this.classification]);
                }
                break;
        }
    }

    // RETURN VALIDITY OF FORM
    public getValid () {
        return (
            this.category !== '' &&
            this.classification !== '' &&
            this.description !== '' &&
            this.measurement !== '' &&
            this.unit !== '' &&
            this.quantity !== null &&
            this.value !== null
        );
    }

    // GENERATE CATEGORY, CLASSIFICATION AND DESCRIPTION NESTED TREE
    private generateTree (data: any) {
        let tree: any = {};
        data.forEach(e => {
            let desc = e.description.split('-')[0];
            if (tree[e.category]) {
                if (tree[e.category][e.classification]) {
                    tree[e.category][e.classification].add(desc);
                } else {
                    tree[e.category][e.classification] = new Set([ desc ]);
                }
            } else {
                tree[e.category] = {};
                tree[e.category][e.classification] = new Set([ desc ]);
            }
        });
        Object.keys(tree).forEach(cat => {
            Object.keys(tree[cat]).forEach(cls => {
                tree[cat][cls] = Array.from(tree[cat][cls]);
            });
        });
        return tree;
    }

}
