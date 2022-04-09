import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'split'
})

export class SplitAndGetPipe implements PipeTransform {

    public transform (input: string, separator: string, index:number): string {
        return input.split(separator)[index];
    }

}
