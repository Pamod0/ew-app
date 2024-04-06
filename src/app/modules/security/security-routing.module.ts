import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ChangePasswordComponent, LoginComponent } from '../../components/login';
import { LoginComponent } from '../../components/login-register/login';
// import { CreateCompanyNameComponent } from 'src/app/components/company-informations/_sub/company-name/create-company-name.component';
const _routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login:type',
    component: LoginComponent,
  },
  {
    path: 'login:id',
    component: LoginComponent,
  },
  // {
  //   path: 'change-password',
  //   component: ChangePasswordComponent,
  // },
  // {
  //   path: 'create-company-name',
  //   component: CreateCompanyNameComponent,
  // },
  // {
  //   path: 'activateAttorney',
  //   component: ActivateAttorneyComponent,
  // },
 
];

@NgModule({
  imports: [RouterModule.forChild(_routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
