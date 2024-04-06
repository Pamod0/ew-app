import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { PrimengModule } from '../../primeng.module';
import { AdministrationRoutingModule } from './administration-routing.module';

import { AdministrationDashboardComponent } from './administration-dashboard/administration-dashboard.component';

@NgModule({
    declarations: [AdministrationDashboardComponent],
    imports: [
        CommonModule,
        AdministrationRoutingModule,
        PrimengModule,
        SharedModule
    ],
    providers: [DatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AdministrationModule {}
