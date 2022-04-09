import { Component, OnInit } from '@angular/core';
import { SearchPipe } from './../search.pipe';
import { VolunteerService } from './../../../services/volunteer.services';

@Component({
    selector: 'vol-dash',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css' ],
    providers: [VolunteerService]
})

export class VolunteerDashboardComponent implements OnInit{
    rows = [];
    columns = [];
    temp = [];

    data;

    constructor(private vlnSvc: VolunteerService) { }

    ngOnInit() {
        this.vlnSvc.getVolunteerPackingList().subscribe(res => {
          if (res) {
            this.data = res;
          }
          
          this.columns = this.data.title;
          this.rows = this.temp = this.data.products
        });
    }

    onPacked(item){
        item.packed=true;
    }

    updateFilter(event) {
      // console.log(event)
    const val = event.target.value.toLowerCase();
    console.log(this)
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length -1);

    // console.log(columns);
    if(!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for(let i = 0; i <= columns.length; i++) {
        var column = columns[i];
        // console.log(d[column]);
        if(d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.rows = rows;

  }
}
