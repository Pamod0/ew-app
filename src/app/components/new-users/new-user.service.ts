import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { INewUsers } from './new-user.model';

@Injectable()
export class NewUserService {
  private _baseUrl = 'UserManagement';
  private _apiUrl = `${this._baseUrl}/UserManagement/Users`;

  private _list: INewUsers[] = [];
  _page: number;
  _pageSize: number;
  _keyword: string;

  private listSource = new BehaviorSubject(this._list);
  currentList = this.listSource.asObservable();

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/UserManagement/Users`;
  }

  initializeObject() {
    let obj: INewUsers = {
      companyId: null,
      clientId: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      typeId: null,
      userGroupId: null,
      password: null,
      confirmPassword: null,

    };

    return obj;
  }

  getById(id: number): Observable<INewUsers> {
    return this.http.get(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        //console.log(response);
        return response.data;
      })
    );
  }

  save(data): Observable<INewUsers> {
    if (!data.id) {
      return this.create(data);
    } else {
      return this.update(data);
    }
  }

  private create(data: any): Observable<INewUsers> {
    //console.log(data);

    return this.http.post(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }



  sendLoginDetails(data: any): Observable<INewUsers> {
    //console.log(data);

    return this.http.post(this._apiUrl+'/ResendLogin', data).pipe(
      map((response: any) => {
        return response.data;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }


  private update(data): Observable<INewUsers> {
    //console.log(data);

    return this.http.put(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      })
      // catchError((error) => this.handleError(error))
    );
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
          this._list = response.data;

          //console.log(this._list);
          return response;
        })
      );
  }

  updateList() {
    console.log(this._keyword);
    this.getSearchListWithPagination(this._page, this._pageSize, this._keyword)
      .pipe(
        finalize(() => {
          //this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          console.log(response);
          this._list = response.data;
          this.changeList();
        },
        (error) => {}
      );
  }

  getAll(): Observable<any> {
    console.log(this._apiUrl);
    return this.http.get(`${this._apiUrl}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  changeList() {
    this.listSource.next(this._list);
  }
}
