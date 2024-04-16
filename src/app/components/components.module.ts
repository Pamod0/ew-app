import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LandingPageComponent } from '../modules/public/landing-page/landing-page.component';

import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng.module';

@NgModule({
    declarations: [
        LandingPageComponent,
    ],
    imports: [
        CommonModule,
        PrimengModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
})
export class ComponentsModule {}
