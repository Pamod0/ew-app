import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministrationDashboardComponent } from './administration-dashboard/administration-dashboard.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '0',
        pathMatch: 'full'
    },
    {
        path: '0',
        component: AdministrationDashboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule {}
