import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";
import { EnvService } from './../../env.service';


@Injectable()
export class GroupDataService {

    private _baseUrl = '';
    private _apiUrl = `${this._baseUrl}/GeneralManagement/DataGroups`;

    constructor(private http: HttpClient, private env: EnvService) {
        this._baseUrl = env.baseApiUrl;
        this._apiUrl = `${this._baseUrl}/GeneralManagement/DataGroups`;
    }

    getGroupDataDropdown(groupType: number): Observable<any> {
        return this.http.get(this._apiUrl + "/GetDropdown/" + groupType).pipe(
            map((response: any) => {
                return response.data;
            })
        );
    }

}