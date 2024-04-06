import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { EnvService } from './../../env.service';

@Injectable()
export class GetCurrentUserAgeService {

    private _baseUrl = '';
    private _apiUrl = `${this._baseUrl}/GeneralManagement/DataGroups`;

    constructor(private http: HttpClient, private env: EnvService) { 
        this._baseUrl = env.baseApiUrl;
        this._apiUrl = `${this._baseUrl}/GeneralManagement/DataGroups`;
      }

    getCurrentUserAge(value: any): Observable<any> {

        let today = new Date();
        let birthday = new Date(value);

        let userAge=(today.getFullYear()-birthday.getFullYear());
        let userAgeMonths=(today.getMonth()-birthday.getMonth());
        let userAgeDays=(today.getDay()-birthday.getDay());

        return 
    }











}