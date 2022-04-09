import { NgModule } from '@angular/core';
import { SplitAndGetPipe } from './split.pipe';
import { UpperCamelCasePipe } from './camelcase.pipe';

@NgModule({
    declarations: [
        SplitAndGetPipe,
        UpperCamelCasePipe
    ],
    exports: [
        SplitAndGetPipe,
        UpperCamelCasePipe
    ]
})

export class PipeModule {}
