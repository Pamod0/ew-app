import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentUserService } from './../services';

@Injectable()
export class RequestTokenInterceptor implements HttpInterceptor {
    constructor(private currentUserService: CurrentUserService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('request token interceptor loaded');

        let buttons = document.getElementsByTagName('button');
        let loader = document.getElementById('loading');
        loader.style.display = 'block';

        // for (let i = 0; i < buttons.length; i++) {
        //   buttons[i].disabled = true;
        // }

        if (this.currentUserService.getAccessToken() != null) {
            let request = req;

            //   if (!req.url.toLowerCase().includes('report')) {
            //     request = req.clone({
            //       setHeaders: {
            //         'Content-Type': 'application/json; charset=utf-8',
            //         Accept: 'application/json',
            //         Authorization:
            //           'Bearer ' + `${this.currentUserService.getAccessToken()}`,
            //         AuthorizationReport:
            //           'Bearer ' + `${this.currentUserService.getReportAccessToken()}`,
            //       },
            //     });
            //   } else {
            //     request = req.clone({
            //       setHeaders: {
            //         'Content-Type': 'application/json; charset=utf-8',
            //         Accept: 'application/json',
            //         AuthorizationReport:
            //           'Bearer ' + `${this.currentUserService.getReportAccessToken()}`,
            //       },
            //     });

            //     var new1 = request;
            //   }

            request = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization:
                        'Bearer ' +
                        `${this.currentUserService.getAccessToken()}`,
                    AuthorizationReport:
                        'Bearer ' +
                        `${this.currentUserService.getReportAccessToken()}`
                }
            });

            return next.handle(request);
        }

        return next.handle(req);
    }
}
