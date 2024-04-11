import { NgModule } from "@angular/core";
import { ListCaseComponent } from "./list/case-list.component";
import { CaseService } from "./case.service";
import { CaseCrudComponent } from "./crud/case-crud.component";
import { CaseRoutingModule } from "./case-routing.module";
import { TableModule } from "primeng/table";
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from "primeng/button";
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedModule } from "../../shared/shared.module"; 
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CasesDashboardComponent } from "../dashboard/cases/cases-dashboard.component";
import { OverviewCaseComponent } from './overview-case/overview-case.component';
@NgModule({
    imports: [ 
        CaseRoutingModule ,
        TableModule,
        CardModule,
        ToolbarModule,
        ButtonModule,
        TabMenuModule,
        SharedModule  ,
        DropdownModule,
        InputTextModule
    ],
    declarations: [
        ListCaseComponent,
        CaseCrudComponent,
        OverviewCaseComponent,
    ],
    exports: [
        ListCaseComponent,
        CaseCrudComponent
    ],
    providers: [CaseService,CasesDashboardComponent],
})
export class CaseModule { }