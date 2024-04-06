import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    APP_INITIALIZER
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrimengModule } from './primeng.module';
import { ContainersModule } from './containers/containers.module';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared/shared.module';
import { SecurityModule } from './modules/security/security.module';

import { NgxPermissionsService } from 'ngx-permissions';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EnvServiceProvider } from './env.service.provider';
import { AuthenticationService, PermissionService } from './shared/services';

import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

@NgModule({
    declarations: [AppComponent,],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PrimengModule,
        ContainersModule,
        ComponentsModule,
        SharedModule,
        SecurityModule,
        NgxPermissionsModule.forRoot(),
        LoadingBarHttpClientModule,

    ],
    providers: [
        EnvServiceProvider,
        AuthenticationService,
        {
            provide: APP_INITIALIZER,
            useFactory: (authenticationService: AuthenticationService) => () =>
                authenticationService.initiateUserCheck(),
            deps: [AuthenticationService],
            multi: true
        },
        PermissionService,
        {
            provide: APP_INITIALIZER,
            useFactory: (permissionService: PermissionService) => () =>
                permissionService.setUserPermissions(),
            deps: [PermissionService, NgxPermissionsService],
            multi: true
        }
    ],

    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
