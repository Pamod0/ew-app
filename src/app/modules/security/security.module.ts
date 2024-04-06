import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { PrimengModule } from '../../primeng.module';
import { AuthenticationGuard } from './authentication.guard';
import { SecurityRoutingModule } from './security-routing.module';
import { MessageService } from 'primeng/api';
import { LoginService } from './../../components/login-register/login/login.service';

@NgModule({
    declarations: [],
    imports: [SharedModule, PrimengModule, SecurityRoutingModule],
    exports: [SecurityRoutingModule],
    providers: [MessageService, AuthenticationGuard, LoginService],
    schemas: []
})
export class SecurityModule {}
//providers: [MessageService, AuthenticationGuard,RegisterAttorneyComponent,AttorneyService, LoginService,AttorneyDashboardComponent,ActivateAttorneyComponent],
