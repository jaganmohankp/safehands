import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html'
})

export class PaginationComponent {

    @Input() page: number; // current page number
    @Input() perPage: number; // number of rows per page
    @Input() pagesToShow: number; // number of pages between next/prev
    @Input() count: number; // total number of rows
    @Output() goPrev = new EventEmitter<boolean>();
    @Output() goNext = new EventEmitter<boolean>();
    @Output() goPage = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

    public perPageList = [ 5, 10, 25, 50, -1 ];

    constructor () {}

    public getMin (): number {
        return ((this.perPage * this.page) - this.perPage) + 1;
    }

    public getMax (): number {
        let max = this.perPage * this.page;
        if (max > this.count) {
            max = this.count;
        }
        return max;
    }

    public onPage (n: number): void {
        this.goPage.emit(n);
    }

    public onPrev (): void {
        this.goPrev.emit(true);
    }

    public onNext (): void {
        this.goNext.emit(true);
    }

    public onPageSizeChange (event): void {
        this.pageSizeChange.emit(Number(event.target.value));
        this.goPage.emit(1);
    }

    public totalPages (): number {
        return Math.ceil(this.count / this.perPage) || 0;
    }

    public lastPage (): boolean {
        return this.totalPages() === this.page;
    }

    public getPages (): number[] {
        const c = Math.ceil(this.count / this.perPage);
        const p = this.page || 1;
        const pagesToShow = this.pagesToShow || 9;
        const pages: number[] = [];
        pages.push(p);
        const times = pagesToShow - 1;
        for (let i = 0; i < times; i++) {
            if (pages.length < pagesToShow) {
                if (Math.min.apply(null, pages) > 1) {
                    pages.push(Math.min.apply(null, pages) - 1);
                }
            }
            if (pages.length < pagesToShow) {
                if (Math.max.apply(null, pages) < c) {
                    pages.push(Math.max.apply(null, pages) + 1);
                }
            }
        }
        pages.sort((a, b) => a - b);
        return pages;
    }

}
