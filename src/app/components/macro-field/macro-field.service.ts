import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { EnvService } from "src/app/env.service";
import { IMacroFields, IMacroFieldsDropdown } from "./macro-field.model";

@Injectable()
export class MacroFieldService {
  private _baseUrl = '';
  private _apiUrl = `${this._baseUrl}/Admin/MacroField`;

  private _list: IMacroFields[] = [];
  _page: number;
  _pageSize: number;
  _keyword: string;


  private listSource = new BehaviorSubject(this._list);
  currentList = this.listSource.asObservable();

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/Admin/MacroField`;
  }

  initializeObject() {
    let obj: IMacroFields = {

      name: null,
      description: null,
      query: null,
      ParameterList: [],

    };

    return obj;
  }

  getById(id: number): Observable<IMacroFields> {

    return this.http.get(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        //console.log(response);
        return response.data;
      })
    );
  }

  save(data): Observable<IMacroFields> {
    if (!data.id) {
      return this.create(data);
    } else {
      return this.update(data);
    }
  }

  private create(data: any): Observable<IMacroFields> {
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

  private update(data): Observable<IMacroFields> {
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



    return this.http.get(
      this._apiUrl +
      '/Search?page=' +
      page +
      '&&pageSize=' +
      pageSize +
      '&&searchText=' +
      keyword
    ).pipe(
      map((response: any) => {
        this._list = response.data;

        console.log(this._list);
        return response;
      })
    );
  }

  getSearchListWithPaginationById(
    page: Number,
    pageSize: Number,
    keyword: string,
    id:Number
  ): Observable<any> {



    return this.http.get(
      this._apiUrl +
      '/GetResultListByMacroField?page=' +
      page +
      '&&pageSize=' +
      pageSize +
      '&&searchText=' +
      keyword +
      '&&id='+
      id
    ).pipe(
      map((response: any) => {
        this._list = response.data;

        console.log(this._list);
        return response;
      })
    );
  }

  updateList() {
    console.log(this._keyword);
    this.getSearchListWithPagination(this._page, this._pageSize, this._keyword).pipe(
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
        (error) => {

        }
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
    this.listSource.next(this._list)
  }

  getDropdownList(): Observable<IMacroFieldsDropdown[]> {
    return this.http.get(this._apiUrl + '/GetDropdown').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

}



