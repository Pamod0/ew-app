import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Message, MessageService } from 'primeng/api';

import { CurrentUserService } from "./../../shared/services";

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(
        private router: Router,
        private messageService: MessageService,
        private currentUserService: CurrentUserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        //return true;

        let _refEx = this.currentUserService.getRefreshTokenExpTime();
        let expires = Date.now();

        if (parseInt(_refEx) > expires) {
            return true;
        } else {
            // this.alertService.error('An authentication data was not found in the security context.',
            //     'An authentication data was not found in the security context.');
            this.messageService.add({key: 'tst', severity: 'info', summary: 'Info Message', detail: 'Test message'});
        }

        this.router.navigate(['/authentication/login'], { queryParams: { returnurl: state.url}});
        //this.router.navigate(['/authentication/activateAttorney'], { queryParams: { returnurl: state.url}});
       
        return false;
    }
}