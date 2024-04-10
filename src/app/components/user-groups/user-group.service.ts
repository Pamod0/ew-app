import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { IUserGroup, IUserGroupDropdown } from './user-group.model';
import { EnvService } from 'src/app/env.service';

@Injectable()
export class UserGroupService {
  private _baseUrl = '';
  private _apiUrl = `${this._baseUrl}/Admin/UserGroups`;

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/Admin/UserGroups`;
  }

  initializeObject() {
    let obj: IUserGroup = {
      code: null,
      description: null,
      policyIds: null,
      recordStatusId:null
    };
    return obj;
  }

  getSearchListWithPagination(
    page: Number,
    pageSize: Number,
    keyword: string
  ): Observable<any> {
    return this.http
      .get(
        this._apiUrl +
          '/Search?page=' +
          page +
          '&&pageSize=' +
          pageSize +
          '&&searchText=' +
          keyword
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAll(): Observable<IUserGroup[]> {
    return this.http.get(this._apiUrl).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getById(id: number): Observable<IUserGroup> {
    return this.http.get(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  save(data): Observable<IUserGroup> {
    if (data.id === undefined) {
      return this.create(data);
    }
    return this.update(data);
  }

  private create(data: any): Observable<IUserGroup> {
    return this.http.post(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  private update(data): Observable<IUserGroup> {
    return this.http.put(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getDropdownList(): Observable<IUserGroupDropdown[]> {
    return this.http.get(this._apiUrl + '/GetDropdown').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getSearchList(keyword: string): Observable<IUserGroup[]> {
    return this.http.get(this._apiUrl + '/Search?value=' + keyword).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  delete(id: number): Observable<IUserGroup> {
    return this.http.delete(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }
}
