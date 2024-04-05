import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/public/landing-page/landing-page.component';
import { LoginComponent } from './components/login-register/login/login.component';
import { AccountTypeComponent } from './components/login-register/account-type/account-type.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '1',
    pathMatch: 'full',
  },
  {
    path: '1',
    component: LandingPageComponent,
  },
  {
    path: '2',
    component: AccountTypeComponent,
  },  
  {
    path: '3',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
