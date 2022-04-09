import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OnlyNumberDirective } from '@directives/only-number.directive';
import { PipeModule } from '@pipes/pipes.module';
import { ConfirmationModal } from './confirm-modal/confirm-modal.component';
import { ForgotPasswordModal } from './forgot-password-modal/forgot-password-modal.component';
import { SettingsModal } from '@components/settings-modal/settings-modal.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        PipeModule
    ],
    declarations: [
        BaseLayoutComponent,
        AuthLayoutComponent,
        TopbarComponent,
        NavigationComponent,
        OnlyNumberDirective,
        PaginationComponent,
        ConfirmationModal,
        ForgotPasswordModal,
        SettingsModal
    ],
    exports: [
        OnlyNumberDirective,
        PaginationComponent
    ],
    entryComponents: [
        ConfirmationModal,
        ForgotPasswordModal,
        SettingsModal
    ]
})

export class AppCommonModule {}
