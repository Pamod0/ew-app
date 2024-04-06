import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

import { CurrentUserService } from './../services/current-user.service';
import { map } from 'jquery';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private currentUserService: CurrentUserService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('http response inteceptor loaded');
        return next.handle(request).pipe(
            tap((response) => {
                if (response instanceof HttpResponse) {
                    console.log('compate request');

                    if (response instanceof HttpResponse) {
                        let loader = document.getElementById('loading');
                        loader.style.display = 'none';

                        // for (let i = 0; i < buttons.length; i++) {
                        //   buttons[i].disabled = false;
                        // }
                    }
                }
            })
        );
    }
}
