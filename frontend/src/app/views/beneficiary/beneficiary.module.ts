import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule  } from '@angular/material/dialog';
import {MatTooltipModule  } from '@angular/material/tooltip';
import {MatSnackBarModule } from '@angular/material/snack-bar';

import { AppCommonModule } from '@components/app-common.module';
import { BeneficiaryService } from '@services/beneficiary.service';
import { PipeModule } from '@pipes/pipes.module';

import { BeneficiaryRoutes } from './beneficiary.routing';

import { BeneficiaryHomeComponent } from './home/home.component';
import { BeneficiaryRequestComponent } from './request/request.component';

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        PipeModule,
        RouterModule.forChild(BeneficiaryRoutes),
    ],
    declarations: [
        BeneficiaryHomeComponent,
        BeneficiaryRequestComponent
    ],
    providers: [
        BeneficiaryService
    ]
})

export class BeneficiaryModule {}
