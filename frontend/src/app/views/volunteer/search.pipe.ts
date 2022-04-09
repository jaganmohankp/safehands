import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  transform(foodName: any, searchText: any): any {
    if(searchText == null) return foodName;

    return foodName.filter(function(food){
      return food.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}
