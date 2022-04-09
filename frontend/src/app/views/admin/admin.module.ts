import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { AppCommonModule } from '@components/app-common.module';
import { AdminService, SystemService } from '@services/services';
import { PipeModule } from '@pipes/pipes.module';

import { AdminRoutes } from './admin.routing';

import { AdminAccountManagementComponent } from './account/account.component';
import { AdminAllocationComponent } from './allocation/allocation.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { InventoryChartComponent } from './dashboard/inventory-chart/inventory-chart.component';
import { RequestChartComponent } from './dashboard/request-chart/request-chart.component';
import { AdminInventoryComponent } from './inventory/inventory.component';
import { AdminPackingListComponent } from './packing-list/packing-list.component';
import { AdminReportComponent } from './report/report.component';
import { AdminInvoiceComponent } from './report/invoice/invoice.component';
import { AdminSystemHealthComponent } from './system/health.component';

import { CreateAccountModal } from './account/create-modal/create-modal.component';
import { CreateItemModal } from './inventory/create-item-modal/create-item-modal.component';
import { ConfirmResetModal } from './inventory/confirm-reset-modal/confirm-reset-modal.component';
import { RequestWindowModal } from './dashboard/req-win-modal/req-win-modal.component';
import { ViewAccountModal } from './account/view-modal/view-modal.component';

@NgModule({
    imports: [
        AppCommonModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTabsModule,
        PipeModule,
        RouterModule.forChild(AdminRoutes)
    ],
    declarations: [
        AdminAccountManagementComponent,
        AdminAllocationComponent,
        AdminDashboardComponent,
        InventoryChartComponent,
        RequestChartComponent,
        AdminInventoryComponent,
        AdminPackingListComponent,
        AdminReportComponent,
        AdminInvoiceComponent,
        AdminSystemHealthComponent,
        CreateItemModal,
        ConfirmResetModal,
        CreateAccountModal,
        RequestWindowModal,
        ViewAccountModal
    ],
    providers: [
        AdminService,
        SystemService
    ],
    entryComponents: [
        CreateAccountModal,
        CreateItemModal,
        ConfirmResetModal,
        RequestWindowModal,
        ViewAccountModal
    ]
})

export class AdminModule {}
