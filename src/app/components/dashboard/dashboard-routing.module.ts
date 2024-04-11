import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core'; 
import { ModalViewLayoutComponent, ModuleLayoutComponent } from 'src/app/containers';
import { ObjectType } from 'src/app/shared/enums';
import { AppMainComponent } from 'src/app/app.main.component';
import { CasesDashboardComponent } from "./cases/cases-dashboard.component";
import { EventsDashboardComponent } from "./events/events-dashboard.component";
import { MessagesDashboardComponent } from "./messages/messages-dashboard.component";
import { TasksDashboardComponent } from "./tasks/tasks-dashboard.component";
import { ListDashboardComponent } from "./list/list-dashboard.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: String(ObjectType.Job),
        component: AppMainComponent,
        children: [
          {
            path: '',
            component: ListDashboardComponent,
          },
          {
            path: 'modal',
            outlet: 'modal',
            component: ModalViewLayoutComponent,
            children: [
              {
                path: 'events',
                component: EventsDashboardComponent,
              },
              {
                path: 'tasks',
                component: TasksDashboardComponent,
              },
              {
                path: 'messages',
                component: MessagesDashboardComponent,
              },
              {
                path: 'cases',
                component: CasesDashboardComponent,
              },
              
    
            ],
          },
        ],
      },
    ])
],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}