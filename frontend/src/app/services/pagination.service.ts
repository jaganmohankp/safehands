import { Injectable } from '@angular/core';

/*

    THIS PAGINATION SERVICE HANDLES THE DATA PROCESSING REQUIRED FOR PAGINATION

*/

@Injectable()
export class PaginationService {

    /* RENDERS PAGE DATA */
    public loadPage (data: any, pager: any, pageSize: number = null) {
        if (pageSize) {
            if (pageSize !== pager.pageSize) {
                pager.pageSize = pageSize;
                pager.page = 1;
                let start = pager.pageSize * (pager.page - 1);
                let end = pager.page * pager.pageSize;
                pager.data = data.slice(start, end);
            }
        } else {
            let start = pager.pageSize * (pager.page - 1);
            let end = pager.page * pager.pageSize;
            pager.data = data.slice(start, end);
        }
    }

    /* GO TO PREVIOUS PAGE */
    public prev (data: any, pager: any) {
        pager.page--;
        this.loadPage(data, pager);
    }

    /* GO TO NEXT PAGE */
    public next (data: any, pager: any) {
        pager.page++;
        this.loadPage(data, pager);
    }

    /* GO TO SPECIFIED PAGE */
    public go (data: any, pager: any, page: number) {
        pager.page = page;
        this.loadPage(data, pager);
    }

}
