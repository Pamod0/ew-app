import { DashboardService } from "./dashboard.service";
import { NgModule } from "@angular/core"; 
import { SharedModule } from "src/app/shared/shared.module"; 
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CasesDashboardComponent } from "./cases/cases-dashboard.component";
import { EventsDashboardComponent } from "./events/events-dashboard.component";
import { MessagesDashboardComponent } from "./messages/messages-dashboard.component";
import { TasksDashboardComponent } from "./tasks/tasks-dashboard.component";
import { ListDashboardComponent } from "./list/list-dashboard.component";
import { CaseModule } from "../case/case.module";

@NgModule({
    imports: [     
        SharedModule,DashboardRoutingModule,CaseModule
    ],
    declarations: [
        CasesDashboardComponent,
        EventsDashboardComponent,
        MessagesDashboardComponent,
        TasksDashboardComponent,
        ListDashboardComponent
    ],
    exports: [
        CasesDashboardComponent,
        EventsDashboardComponent,
        MessagesDashboardComponent,
        TasksDashboardComponent,
        ListDashboardComponent
    ],
    providers: [DashboardService],
})
export class DashboardModule { }
