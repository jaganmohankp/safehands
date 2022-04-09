import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './app.interceptor';
import { AppComponent } from './app.component';
import { ResetPasswordComponent } from '@views/sessions/reset-password/reset-password.component';
import { AppCommonModule } from './components/app-common.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { rootRouterConfig } from './app.routing';
import { MatDividerModule  } from '@angular/material/divider'; 
import { MatIconModule  } from '@angular/material/icon';
import { MatButtonModule  } from '@angular/material/button';
import {
    AuthService,
    UserService,
    HttpService,
    ProgressService,
    PaginationService,
    BreadcrumbService
} from './services/services';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { VolunteerGuard } from './guards/volunteer.guard';
import { BeneficiaryGuard } from './guards/beneficiary.guard';

@NgModule({
    declarations: [
        AppComponent,
        ResetPasswordComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppCommonModule,
        FormsModule, 
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDividerModule, 
        MatIconModule,
        MatButtonModule,
        RouterModule.forRoot(rootRouterConfig)
    ],
    providers: [
        AuthService,
        UserService,
        HttpService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        ProgressService,
        PaginationService,
        BreadcrumbService,
        AuthGuard,
        AdminGuard,
        VolunteerGuard,
        BeneficiaryGuard
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
