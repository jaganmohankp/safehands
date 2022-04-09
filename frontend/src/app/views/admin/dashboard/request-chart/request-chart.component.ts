import {
    Component,
    Input,
    HostListener,
    ViewChild,
    ElementRef,
    OnInit
} from '@angular/core';
import { AdminService, ProgressService } from '@services/services';
import DataUtil from '@utils/data.util';
import Globals from '@config/globals';
import tooltip from 'd3-tip';
import * as D3 from 'd3';
import * as _ from 'lodash';

@Component({
    selector: 'req-chart',
    template: '<svg #svgEl (click)="onRevert($event)"></svg>'
})

export class RequestChartComponent implements OnInit {

    @ViewChild('svgEl', {static: true}) svgEl: ElementRef;
    @Input('chartWidth') chartWidth: number;
    private chartHeight: number = 400;
    private initialised = false;
    private svg: any;
    private chartData: any;
    private dataList: any;
    private dataTree: any;
    private fullDataTree: any;
    private layer = Globals.CATEGORY;
    private selectedCategory = null;
    private selectedClassification = null;
    private margin = {
        top: 50,
        bottom: 50,
        left: 70,
        right: 50,
        gap: 20,
        tipX: 0,
        tipY: -10,
        labelAngle: -10,
        labelX: -5,
        labelY: 10
    };

    constructor (
        private admSvc: AdminService,
        private progSvc: ProgressService
    ) {}

    ngOnInit () {
        this.initialize();
    }

    /* INITIALIZATION */
    public initialize () {
        this.progSvc.load();
        this.admSvc.getRequests().subscribe(
            (res: any) => {
                DataUtil.processResponse(res, (result) => {
                    result = result.map((e: any) => {
                        return {
                            category: e.foodItem.category,
                            classification: e.foodItem.classification,
                            description: e.foodItem.description,
                            quantity: e.requestedQuantity
                        }
                    });
                    this.dataList = this.processData(result);
                    this.dataTree = this.generateTree(result);
                    this.fullDataTree = _.cloneDeep(this.dataTree);
                    this.chartData = this.initChartData();
                    this.plot();
                });
            },
            (err) => { Globals.print(err) },
            () => { this.progSvc.complete() }
        );
    }

    /* SELECT CHART DATA TO SELECTED LOWER LEVEL */
    public onSelect (item: any) {
        if (this.layer !== Globals.DESCRIPTION) {
            if (this.layer === Globals.CATEGORY) {
                this.layer = Globals.CLASSIFICATION;
                this.selectedCategory = item.key;
            } else if (this.layer === Globals.CLASSIFICATION) {
                this.layer = Globals.DESCRIPTION;
                this.selectedClassification = item.key;
            }
            this.dataTree = this.dataTree[item.key];
            this.chartData = this.initChartData();
            this.plot();
        }
    }

    /* REVERT CHART DATA TO HIGHER LEVEL */
    public onRevert (event) {
        if (event.target.localName === 'svg' && this.layer !== Globals.CATEGORY) {
            switch (this.layer) {
                case Globals.CLASSIFICATION:
                    this.layer = Globals.CATEGORY;
                    this.dataTree = this.fullDataTree;
                    this.selectedCategory = null;
                    break;
                case Globals.DESCRIPTION:
                    this.layer = Globals.CLASSIFICATION;
                    this.dataTree = this.fullDataTree[this.selectedCategory];
                    this.selectedClassification = null;
                    break;
            }
            this.chartData = this.initChartData();
            this.plot();
        }
    }

    /* REPLOT CHART ON RESIZE */
    @HostListener('window:resize', ['$event'])
    private onResize (event) {
        try {
        this.plot();
        } catch (err) {
            Globals.print(err);
        }
    }

    /* PLOT CHART */
    private plot () {
        // CALCULATE SIZE OF CHART
        let width = this.chartWidth - this.margin.left - this.margin.right;
        let height = this.chartHeight - this.margin.top - this.margin.bottom;
        width = width < 0 ? 0 : width;
        height = height < 0 ? 0 : height;

        // SCALERS
        let xScaler = D3.scaleBand()
        .domain(this.chartData.map(e => e.key))
        .range([0, width]);
        let yScaler = D3.scaleLinear()
        .domain([0, D3.max(this.chartData, (e) => e.value)])
        .range([height, 0]);

        // GRIDLINES
        let yGridlines = D3.axisLeft(yScaler)
        .tickSize(-width, 0, 0)
        .tickFormat('');

        // AXES
        let xAxis = D3.axisBottom(xScaler);
        let yAxis = D3.axisLeft(yScaler);

        // CREATE TOOLTIPS
        let tip = tooltip()
        .attr('class', 'd3-tip')
        .offset([this.margin.tipY, this.margin.tipX])
        .html((item) => {
            let i = item.key.split('-');
            let name = i[0];
            if (i[2]) name += ' (' + i[2] + ')';
            if (i[1]) name += ' - ' + i[1];
            return `<span style='color:white'>${ name }</span><br/><span style='color:white'>${ item.value } item(s)</span>`;
        });

        // SELECT SVG ELEMENT
        this.svg = D3.select(this.svgEl.nativeElement)
        .attr('width', this.chartWidth)
        .attr('height', this.chartHeight);

        if (!this.initialised) {

            // ADD CHART BACKLAY
            this.createGrid(yScaler, yGridlines);
            this.createAxes(xAxis, yAxis, height);

            // POSITION FRAME OF BAR CHARTS
            this.svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${ this.margin.left }, ${ this.margin.top })`)

            // CLOSE INITIALIZATION FLAG
            this.initialised = true;

        } else {

            // RE-RENDER GRIDLINES
            this.svg.selectAll('.gridline').call(yGridlines);

            // RE-RENDER AXES
            this.svg.selectAll('.x-axis')
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${ this.margin.labelAngle }), translate(${ this.margin.labelX }, ${ this.margin.labelY })`);
            this.svg.selectAll('.y-axis')
            .call(yAxis);

        }
        this.renderBars(tip, xScaler, yScaler, height);
        this.clearElements();
    }

    /* CREATE AXES ELEMENT */
    private createAxes (xAxis, yAxis, height) {
        this.svg.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(${ this.margin.left }, ${ this.margin.top + height })`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${ this.margin.labelAngle }), translate(${ this.margin.labelX }, ${ this.margin.labelY })`);
        this.svg.append('g')
            .classed('y-axis', true)
            .attr('transform', `translate(${ this.margin.left }, ${ this.margin.top })`)
            .call(yAxis);
    }

    /* CREATE GRID ELEMENT */
    private createGrid (yScaler, yGridlines) {
        this.svg.append('g')
            .attr('transform', `translate(${ this.margin.left }, ${ this.margin.top })`)
            .classed('gridline', true)
            .call(yGridlines);
    }

    /* RENDER BAR CHARTS AND TIPS */
    private renderBars (tip, xScaler, yScaler, height) {
        this.svg.call(tip);
        this.svg.select('g.display').selectAll('.bar')
            .data(this.chartData)
            .enter()
                .append('rect')
                .classed('bar', true)
                .classed('req-bar', true)
                .attr('transform', `translate(${ this.margin.gap / 2 }, 0)`)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click', (item: any) => {
                    this.onSelect(item);
                    tip.hide(item);
                });
        this.svg.selectAll('.bar')
            .transition()
            .attr('x', (e: any) => xScaler(e.key))
            .attr('y', (e: any) => yScaler(e.value))
            .attr('width', xScaler.bandwidth() - this.margin.gap)
            .attr('height', (e: any) => {
                let h = height - yScaler(e.value);
                return h < 0 ? 0 : h;
            });
    }

    /* REMOVE BAR CHARTS AND TIPS */
    private clearElements () {
        this.svg.selectAll('.bar')
            .data(this.chartData)
            .exit()
            .remove();
        // CLEARING D3-TIP DOM CAUSES ERRONEOUS BEHAVIOUR
        // D3.selectAll('.d3-tip')
        //     .data(this.chartData)
        //     .exit()
        //     .remove();
    }

    /* CREATE INVENTORY DATA TREE */
    private generateTree (data: any) {
        let treemap: any = {};
        data.forEach((e: any) => {
            if (treemap[e.category]) {
                if (treemap[e.category][e.classification]) {
                    treemap[e.category][e.classification][e.description] = e.quantity;
                } else {
                    treemap[e.category][e.classification] = {};
                    treemap[e.category][e.classification][e.description] = e.quantity;
                }
            } else {
                treemap[e.category] = {};
                treemap[e.category][e.classification] = {};
                treemap[e.category][e.classification][e.description] = e.quantity;
            }
        });
        return treemap;
    }

    /* INITIALIZE CHART DATA FORMAT */
    private initChartData () {
        let chartData = [];
        Object.keys(this.dataTree).forEach(e1 => {
            chartData.push({
                key: e1,
                value: this.dataList
                    .filter(e2 => {
                        switch (this.layer) {
                            case Globals.CATEGORY:
                                return e2.category === e1;
                            case Globals.CLASSIFICATION:
                                return (
                                    e2.category === this.selectedCategory &&
                                    e2.classification === e1
                                );
                            case Globals.DESCRIPTION:
                                return (
                                    e2.category === this.selectedCategory &&
                                    e2.classification === this.selectedClassification &&
                                    e2.description === e1
                                );
                        }
                    })
                    .map(e3 => e3.quantity)
                    .reduce((prev, curr) => prev + curr)
            });
        });
        chartData.sort((prev, curr) => {
            return curr.value - prev.value;
        });
        return chartData.slice(0, 10);
    }

    /* FORMAT DESCRIPTION DISPLAY */
    private processData (data: any) {
        data.forEach((e: any) => {
            let desc = e.description.split('-');
            e.description = `${ desc[0] } (${ desc[1] }`;
            e.description +=  desc[2] ? ', Halal)' : ')';
        });
        return data;
    }

}
