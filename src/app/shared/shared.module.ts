import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  APP_INITIALIZER,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

// import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

// Pipes
// import {
//   EnumAsStringPipe,
//   EnumAsSelectPipe,
//   TrueFalseToYesNoPipe,
//   TickToDateTimePipe,
//   ListAsStringPipe,
// } from './pipes';

/// Components
import { UIValidationMessageComponent, UIMessageComponent } from './components';
// import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
// import { DateToAgeString } from './utils/date-to-age-string';

// Common Services
import {
  UIValidationService,
  LocalStorageService,
  CurrentUserService,
  GroupDataService,
  AuthenticationService,
  UIMessageService,
  DateToAgeStringService,
  LocationFormattedService,
  CustomNgbDateAdapter,
  CustomNgbDateParserFormatter,
  CommonService,
  RouteEventsService,
} from './services';

// import { CustomNgbDateAdapter } from './services/custom-ngb-date-adapter';

import { RequestTokenInterceptor, HttpErrorInterceptor, HttpResponseInterceptor } from './interceptors';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

// import { EmptyToNullDirective, ClockPickerDirective } from './directives';
// import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    RippleModule,
    // PdfJsViewerModule,
    // ImageCropperModule,
    NgxPermissionsModule,
  ],
  exports: [
    UIValidationMessageComponent,    
    // EnumAsStringPipe,
    // EnumAsSelectPipe,
    // TrueFalseToYesNoPipe,
    // TickToDateTimePipe,
    UIMessageComponent,
    // ListAsStringPipe,
    // EmptyToNullDirective,
    // ClockPickerDirective,
    // ReportViewerComponent
  ],
  declarations: [
    UIValidationMessageComponent,
    // EnumAsStringPipe,
    // EnumAsSelectPipe,
    // TrueFalseToYesNoPipe,
    // TickToDateTimePipe,
    UIMessageComponent,
    // ListAsStringPipe,
    // EmptyToNullDirective,
    // ClockPickerDirective,
    // ReportViewerComponent,
  ],
  providers: [
    UIValidationService,
    UIMessageService,
    LocationFormattedService,
    LocalStorageService,
    CurrentUserService,
    MessageService,
    GroupDataService,
    AuthenticationService,
    DateToAgeStringService,
    CommonService,
    RouteEventsService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: NgbDateAdapter,
      useClass: CustomNgbDateAdapter,
    },
    {
      provide: NgbDateParserFormatter,
      useClass: CustomNgbDateParserFormatter,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
