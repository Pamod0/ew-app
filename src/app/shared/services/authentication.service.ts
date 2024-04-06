import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineAll, ignoreElements, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { CurrentUserService } from './current-user.service';
import { EnvService } from './../../env.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _baseUrl = '';
  private _refreshTokenTimeout;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService,
    private activatedRoute: ActivatedRoute,
    private env: EnvService
  ) {
    this._baseUrl = env.identityApi;
  }

  login(userId: string, password: string, key: string) {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'No-Auth': 'True',
    });

    const body = new HttpParams()
      .set('username', userId)
      .set('password', password)
      .set('client_secret', 'f06e903b-c15e-44d0-8a2e-b4da7a7dbaf3')
      .set('client_id', 'resource')
      .set('grant_type', 'password')
      .set('Scope', 'app.api.resource offline_access');

    let _authUrl = this._baseUrl + '/connect/token';

    return this.httpClient
      .post(_authUrl, body.toString(), { headers: reqHeader })
      .pipe(
        map((response: Response) => {
          this.startRefreshTokenTimer();
          return response;
        })
      );
  }

  logout() {
    let _currentToken = this.currentUserService.getAccessToken();
    let _clinetKey = this.currentUserService.getActivationKey();
    let _bearerToken = 'Bearer ' + _currentToken;
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: _bearerToken,
    });

    this.httpClient
      .post<any>(
        this._baseUrl + '/Authenticate/logout',
        {},
        { headers: reqHeader }
      )
      .subscribe((data) => {
        this.currentUserService.setAccessToken('');
        this.currentUserService.setRefreshToken('');
      });

    this.currentUserService.clearAuthenticationContext();
    this.stopRefreshTokenTimer();
    this.router.navigate(['/authentication/login'], {
      queryParams: { activationkey: _clinetKey },
    });
  }

  refreshToken() {
    console.log('refreshToken call');

    // let reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    // const body = new HttpParams()
    // .set('refresh_token', this.currentUserService.getRefreshToken())
    // .set('client_secret', 'a75a559d-1dab-4c65-9bc0-f8e590cb388d')
    // .set('client_id', 'resource')
    // .set('grant_type', 'refresh_token')
    // .set('Key', '10000001');

    // console.log(body.toString());

    // this.httpClient.post('https://devidentity.telemedcube.com/connect/token',
    // body.toString(), { headers: reqHeader }
    // ).subscribe(data => {
    //     console.log(data);
    //     // this.currentUserService.setAccessToken(data.access_token);
    //     // this.currentUserService.setRefreshToken(data.refresh_token);

    // })

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    let urlencoded = new URLSearchParams();
    urlencoded.append(
      'refresh_token',
      this.currentUserService.getRefreshToken()
    );
    urlencoded.append('client_secret', 'f06e903b-c15e-44d0-8a2e-b4da7a7dbaf3');
    urlencoded.append('client_id', 'resource');
    urlencoded.append('grant_type', 'refresh_token');

    let _authUrl = this._baseUrl + '/connect/token';

    //console.log(urlencoded.toString());

    fetch(_authUrl, {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    })
      .then((response) => response.text())
      .then((result) => {
        let data = JSON.parse(result);
        console.log(data);
        this.currentUserService.setAccessToken(data.access_token);
        this.currentUserService.setRefreshToken(data.refresh_token);

        this.startRefreshTokenTimer();
      })
      .catch((error) => console.log('error', error));
  }

  public async initiateUserCheck() {
    // let queryString = window.location.search;
    // let urlParams = new URLSearchParams(queryString);
    // let _activationkeyUrl = urlParams.get('activationkey');
    // let urlParamReturnurl = urlParams.get('returnurl');
    // let _loginType = urlParams.get('type');

    // let userId = urlParams.get('userId');
    // let activationKey = urlParams.get('activationKey');

    // let _returnUrl = '';
    // if (urlParamReturnurl) {
    //   _returnUrl = urlParamReturnurl;
    // } else {
    //   _returnUrl = window.location.pathname + window.location.search;
    // }

    // let _userId = this.currentUserService.getUserId();
    // let _clinetKey = this.currentUserService.getActivationKey();

    // if (_userId == null) {

    //   if (window.location.pathname == '/authentication/registerAttorney') {
    //     this.router.navigate(['/authentication/registerAttorney'], {
    //       queryParams: { type: _loginType, },
    //     });
    //   } 
    //   else if (window.location.pathname == '/authentication/activateAttorney') {
    //     this.router.navigate(['/authentication/activateAttorney'], {
    //       //queryParams: { userId: userId,activationKey : activationKey  },
    //       queryParams: { id: userId,key: activationKey,  },
        
    //     });
    //   } 
    //   else {
    //     this.currentUserService.clearAuthenticationContext();
        
    //     this.router.navigate(['/authentication/login'], {
    //       queryParams: { type: _loginType, returnurl: _returnUrl },
    //     });
    //   }
      
    // } else {
    //   let _refEx = this.currentUserService.getRefreshTokenExpTime();
    //   let expires = Date.now();

    //   if (_refEx == null) {
    //     this.router.navigate(['/authentication/login'], {
    //       queryParams: {
    //         type: _loginType,
    //         returnurl: _returnUrl,
    //       },
    //     });
    //   }

    //   if (parseInt(_refEx) > expires) {
    //     this.refreshToken();

    //     console.log(_returnUrl);
    //   //  if (_returnUrl.includes('/1/16')){
    //      // this.router.navigate(['/1/16/']);
    //   //  }
        

    //     if (
    //       _returnUrl.includes('/authentication/login')
    //      // ||          _returnUrl.includes('/authentication/registerattorney')
    //     ) {
    //       //this.router.navigate(['/1/0']);
    //     } else {
    //       //this.router.navigate([_returnUrl]);
    //     }
    //   } else {
    //     this.router.navigate(['/authentication/login'], {
    //       queryParams: {
    //         type: _loginType,
    //         returnurl: _returnUrl,
    //       },
    //     });
    //   }
    // }
  }

  private startRefreshTokenTimer() {
    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 50);
    this.currentUserService.setRefreshTokenExpTime(expires.getTime());
    const timeout = 60 * 1000 * 50;
    //const timeout = (60 * 1000) * 1;
    setTimeout(() => {
      this.refreshToken();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this._refreshTokenTimeout);
  }
}
