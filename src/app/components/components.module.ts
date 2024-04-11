import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LandingPageComponent } from '../modules/public/landing-page/landing-page.component';
import { LoginComponent } from './login-register/login/login.component';
import { AccountTypeComponent } from './login-register/account-type/account-type.component';
import { RegisterCommunityComponent } from './login-register/register/register-community/register-community.component';

import { LoginService } from './login-register/login/index';

import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng.module';

@NgModule({
    declarations: [
        LandingPageComponent,
        LoginComponent,
        AccountTypeComponent,
        RegisterCommunityComponent
    ],
    imports: [
        CommonModule,
        PrimengModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [LoginService]
})
export class ComponentsModule {}
