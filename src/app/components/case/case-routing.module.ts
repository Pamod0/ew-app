import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core'; 
import { ModalViewLayoutComponent, ModuleLayoutComponent } from 'src/app/containers';
import { ObjectType } from 'src/app/shared/enums';
import { AppMainComponent } from 'src/app/app.main.component';
import { OverviewCaseComponent } from './overview-case/overview-case.component';
import { ListCaseComponent } from './list/case-list.component';
import { CaseCrudComponent } from './crud/case-crud.component';

@NgModule({
    imports: [
        RouterModule.forChild([
          {
            path: String(ObjectType.Customer),
            component: AppMainComponent,
            children: [
              {
                path: '',
                component: ListCaseComponent,
              },
              { path: 'dashboard/case-overview', 
                component: OverviewCaseComponent 
              },
              {
                path: 'modal',
                outlet: 'modal',
                component: ModalViewLayoutComponent,
                children: [
                  {
                    // canActivate: [CanActivateGuard],
                    path: 'crud-case',
                    component: CaseCrudComponent,
                  },
                  // {
                  //   // canActivate: [CanActivateGuard],
                  //   path: 'view-employer/:id',
                  //   component: EditEmployerComponent,
                  // },
                  // {
                  //   // canActivate: [CanActivateGuard],
                  //   path: 'edit-employer/:id',
                  //   component: EditEmployerComponent,
                  // }
        
                ],
              },
            ],
          },
        ])
    ],
    exports: [RouterModule]
})
export class CaseRoutingModule {
}