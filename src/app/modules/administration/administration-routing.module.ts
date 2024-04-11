import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministrationDashboardComponent } from './administration-dashboard/administration-dashboard.component';
import { AppMainComponent } from '../../containers/module-layout/app.main.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '0',
        pathMatch: 'full'
    },
    {
        path: '0',
        component: AppMainComponent,
        children: [
            {
                path: '',
                component: AdministrationDashboardComponent,
                data: { title: 'dashboard' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule {}
