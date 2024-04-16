import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../primeng.module';

import { LoginRegisterRoutingModule } from './login-register-routing.module';

import { LoginComponent } from './login/login.component';
import { AccountTypeComponent } from './account-type/account-type.component';
import { RegisterCommunityComponent } from './register/register-community/register-community.component';
import { LeftCommonSectionComponent } from './left-common-section/left-common-section.component';

import { LoginService } from './login/login.service';
import { RegisterOrganizationComponent } from './register/register-organization/register-organization.component';
import { RegisterSchoolUniversityComponent } from './register/register-school-university/register-school-university.component';
import { RegisterPartnerOrganizationComponent } from './register/register-partner-organization/register-partner-organization.component';

import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        LoginComponent,
        AccountTypeComponent,
        RegisterCommunityComponent,
        LeftCommonSectionComponent,
        RegisterOrganizationComponent,
        RegisterSchoolUniversityComponent,
        RegisterPartnerOrganizationComponent
    ],
    imports: [
        LoginRegisterRoutingModule,
        CommonModule,
        PrimengModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
    ],
    providers: [LoginService]
})
export class LoginRegisterModule {}
