import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../env.service';
import { catchError, map } from 'rxjs/operators';
import { IUserProfile } from './user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private _baseUrl = '';
    private _apiUrl = `${this._baseUrl}/UserManagement/Users`;

    constructor(private http: HttpClient, private env: EnvService) {
        this._baseUrl = env.baseApiUrl;
        this._apiUrl = `${this._baseUrl}/UserManagement/Users`;
    }

    initializeObject() {
        let obj: IUserProfile = {
            firstName: null,
            lastName: null,
            initials: null,
            title: null,
            email: null,
            phone: null,
            extension: null,
            fax: null,
            userGroupId: null,
            loginId: null,
            password: null,
            confirmPassword: null,
            typeId: null
        };

        return obj;
    }

    getSearchListWithPagination(
        _page: number,
        _pageSize: number,
        _keyword: string
    ): Observable<any> {
        return this.http
            .get(
                this._apiUrl +
                    '/Search?page=' +
                    _page +
                    '&&pageSize=' +
                    _pageSize +
                    '&&searchText=' +
                    _keyword
            )
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }

    save(data): Observable<IUserProfile> {
        if (data.id === undefined) {
            return this.create(data);
        }
        return this.update(data);
    }

    getById(id: number): Observable<IUserProfile> {
        return this.http.get(`${this._apiUrl}/${id}`).pipe(
            map((response: any) => {
                //console.log(response);
                return response.data;
            })
        );
    }

    private create(data: any): Observable<IUserProfile> {
        console.log(data);
        return this.http.post(this._apiUrl, data).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
        return null;
    }

    private update(data: any): Observable<IUserProfile> {
        console.log(data);
        return this.http.put(this._apiUrl, data).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    updatePassword(data: any): Observable<IUserProfile> {
        console.log(data);
        return this.http.put(this._apiUrl + '/UpdatePassword', data).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    getUserProfilesByClientDropDown(
        clientId: number
    ): Observable<IUserProfile[]> {
        return this.http
            .get(this._apiUrl + '/GetUserProfilesByClientDropDown/' + clientId)
            .pipe(
                map((response: any) => {
                    return response.data;
                })
            );
    }
}
