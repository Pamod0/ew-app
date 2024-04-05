import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/public/landing-page/landing-page.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
