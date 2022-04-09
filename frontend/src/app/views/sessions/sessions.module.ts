import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionsRoutes } from './sessions.routing';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSnackBarModule,
        RouterModule.forChild(SessionsRoutes)
    ],
    declarations: [
        PageNotFoundComponent,
        LoginComponent
    ]
})

export class SessionsModule {}
