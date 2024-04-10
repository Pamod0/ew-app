import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicComponent } from './public.component';

const _routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        data: {
            title: 'Public'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(_routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule {}
