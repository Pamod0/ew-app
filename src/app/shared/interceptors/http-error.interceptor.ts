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
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private currentUserService: CurrentUserService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('http error inteceptor loaded');
        return next.handle(request).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';

                console.log(error);
                let loader = document.getElementById('loading');
                loader.style.display = 'none';

                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    if (error?.error?.title != undefined) {
                        errorMessage = `Error Code: ${error?.status}\n Message: ${error?.error?.title}`;

                        if (error?.error?.errors != undefined) {
                            if (error?.error?.errors?.State != undefined) {
                                for (
                                    let c = 0;
                                    c < error?.error?.errors?.State.length;
                                    c++
                                ) {
                                    errorMessage += `\n ${error?.error?.errors?.State[c]}\n`;
                                }
                            }
                        }

                        if (error?.error?.errors != undefined) {
                            if (error?.error?.errors?.page != undefined) {
                                for (
                                    let c = 0;
                                    c < error?.error?.errors?.page.length;
                                    c++
                                ) {
                                    errorMessage += `\n ${error?.error?.errors?.page[c]}\n`;
                                }
                            }
                        }
                    } else {
                        errorMessage = `Error Code: ${
                            error?.status
                        }\n Message: ${
                            error?.error?.message == undefined
                                ? error?.message
                                : error?.error?.message
                        }`;
                    }
                    if (error.status == 401) {
                        this.router.navigate([`/home`]);
                    }
                }
                //  window.alert(errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}
