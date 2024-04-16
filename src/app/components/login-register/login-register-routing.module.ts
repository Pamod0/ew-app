import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LeftCommonSectionComponent } from './left-common-section/left-common-section.component';
import { AccountTypeComponent } from './account-type/account-type.component';
import { RegisterCommunityComponent } from './register/register-community/register-community.component';
import { RegisterOrganizationComponent } from './register/register-organization/register-organization.component';
import { RegisterSchoolUniversityComponent } from './register/register-school-university/register-school-university.component';
import { RegisterPartnerOrganizationComponent } from './register/register-partner-organization/register-partner-organization.component';

const routes: Routes = [
    {
        path: 'login',
        component: LeftCommonSectionComponent,
        children: [
            {
                path: '',
                component: LoginComponent
            }
        ]
    },
    {
        path: 'register',
        component: LeftCommonSectionComponent,
        children: [
            {
                path: '',
                component: AccountTypeComponent
            },
            {
                path: 'community',
                component: RegisterCommunityComponent
            },
            {
                path: 'organization',
                component: RegisterOrganizationComponent
            },
            {
                path: 'school',
                component: RegisterSchoolUniversityComponent
            },
            {
                path: 'partner',
                component: RegisterPartnerOrganizationComponent
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRegisterRoutingModule {}
