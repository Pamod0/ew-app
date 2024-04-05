import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputMaskModule,
    MegaMenuModule,
    MenubarModule,
    TagModule,
    ToolbarModule,
    CarouselModule,
    CheckboxModule,
    PasswordModule,
    InputTextModule,
    
    RadioButtonModule,
  ],
  exports: [
    ButtonModule,
    CardModule,
    DropdownModule,
    InputMaskModule,
    MegaMenuModule,
    MenubarModule,
    TagModule,
    ToolbarModule,
    CarouselModule,
    CheckboxModule,
    PasswordModule,
    InputTextModule,
    RadioButtonModule,
  ],
})
export class PrimengModule {}
