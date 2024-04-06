import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';

import { DefaultLayoutComponent } from './default-layout/default-layout.component';

@NgModule({
    declarations: [DefaultLayoutComponent],
    imports: [CommonModule, PrimengModule, SharedModule]
})
export class ContainersModule {}
