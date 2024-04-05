import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EnvService } from '../../../../app/env.service';

@Injectable()
export class LoginService {
  private _baseUrl = environment.baseApiUrl;
  private _apiUrl = `${this._baseUrl}/Authenticate`;

  constructor(public env: EnvService, private httpClient: HttpClient) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/Authenticate`;
  }

  login(userId: string, password: string, key: string) {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'No-Auth': 'True',
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient
      .post(
        this._apiUrl,
        { userId: userId, password: password, key: key },
        { headers: reqHeader }
      )
      .pipe(
        map((response: Response) => {
          return response;
        })
        //catchError((ex) => throwError(ex))
        //finalize()
      );
  }
}
