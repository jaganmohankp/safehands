import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppCommonModule } from '@components/app-common.module';
import { VolunteerService } from '@services/volunteer.service';
import { PipeModule } from '@pipes/pipes.module';

import { VolunteerRoutes } from './volunteer.routing';

import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { VolunteerHomeComponent } from './home/home.component';
import { VolunteerPackingListComponent } from './packing-list/packing-list.component';
import { VolunteerPackingSelectComponent } from './packing-list/select/select.component';
import { VolunteerPackingPackComponent } from './packing-list/pack/pack.component';
import { VolunteerPackingConfirmComponent } from './packing-list/confirm/confirm.component';

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatSnackBarModule,
        MatTooltipModule,
        PipeModule,
        RouterModule.forChild(VolunteerRoutes)
    ],
    declarations: [
        StockTakingComponent,
        VolunteerHomeComponent,
        VolunteerPackingListComponent,
        VolunteerPackingSelectComponent,
        VolunteerPackingPackComponent,
        VolunteerPackingConfirmComponent
    ],
    providers: [
        VolunteerService
    ]
})

export class VolunteerModule {}
