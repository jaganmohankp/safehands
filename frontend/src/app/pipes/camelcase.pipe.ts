import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'camel'
})

export class UpperCamelCasePipe implements PipeTransform {

    public transform (input: string): string {
        return _.upperFirst(input);
    }

}
