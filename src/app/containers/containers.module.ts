import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';

import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { AppMainComponent } from './module-layout/app.main.component';
import { ModalViewLayoutComponent } from './modal-view-layout';
import { AppMenuComponent } from './_subs/app.menu.component';
import { AppTopBarComponent } from './_subs/top-bar/app.topbar.component';
import { AppSideBarComponent } from './_subs/side-bar/app.sidebar.component';
import { AppSideBarTabContentComponent } from './_subs/side-bar/app.sidebartabcontent.component';
import { AppConfigComponent } from './_subs/app.config.component';

@NgModule({
    declarations: [
        DefaultLayoutComponent,
        AppMainComponent,
        ModalViewLayoutComponent,
        DefaultLayoutComponent,
        AppTopBarComponent,
        AppSideBarComponent,
        AppSideBarTabContentComponent,
        AppMenuComponent,
        AppConfigComponent,
    ],
    imports: [CommonModule, PrimengModule, SharedModule, FormsModule,]
})
export class ContainersModule {}
