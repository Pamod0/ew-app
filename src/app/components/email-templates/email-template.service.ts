import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IEmailTemplate } from './email-templates.model';
import { EnvService } from 'src/app/env.service';

@Injectable()
export class EmailTemplateService {
  private _baseUrl = '';
  private _apiUrl = `${this._baseUrl}/GeneralManagement/EmailTemplates`;

  private _list: IEmailTemplate[] = [];
  _page: number;
  _pageSize: number;
  _keyword: string;

  private listSource = new BehaviorSubject(this._list);
  currentList = this.listSource.asObservable();

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/GeneralManagement/EmailTemplates`;
  }

  initializeObject() {
    let obj: IEmailTemplate = {
      name: null,
      body: null,
    };

    return obj;
  }

  getById(id: number): Observable<IEmailTemplate> {
    return this.http.get(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        //console.log(response);
        return response.data;
      })
    );
  }

  getTemplateByCode(templateCode: String): Observable<IEmailTemplate> {
    return this.http.get(`${this._apiUrl}/templateCode?templateCode=${templateCode}`).pipe(
      map((response: any) => {
        //console.log(response);
        return response.data;
      })
    );
  }
  

  save(data): Observable<IEmailTemplate> {
    if (!data.id) {
      return this.create(data);
    } else {
      return this.update(data);
    }
  }

  private create(data: any): Observable<IEmailTemplate> {
    //console.log(data);

    return this.http.post(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      }),
      // catchError((error) => {
      //   return throwError(error);
      // })
    );
  }

  private update(data): Observable<IEmailTemplate> {
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

          console.log(this._list);
          return response;
        })
      );
  }

  updateList() {
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

  changeList() {
    this.listSource.next(this._list);
  }
}
