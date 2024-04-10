import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { environment } from '../../../environments/environment';
import { IPolicy } from './policy.model';

@Injectable()
export class PolicyService {
  private _baseUrl = environment.baseApiUrl;
  private _apiUrl = `${this._baseUrl}/UserManagement/Policy`;

  private _list: IPolicy[] = [];
  _page: number;
  _pageSize: number;
  _keyword: string;

  private listSource = new BehaviorSubject(this._list);
  currentList = this.listSource.asObservable();

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/UserManagement/Policy`;
   }

  initializeObject() {
    let obj: IPolicy = {
      id:null,
      code: null,
      description: null,
    };
    return obj;
  }

  getSelectList(): Observable<any> {
    return this.http.get(this._apiUrl + '/GetDropdown').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }
  getSearchListWithPagination(page: Number, pageSize: Number, keyword: string): Observable<any> {
    return this.http.get(this._apiUrl + "/Search?page=" + page + "&pageSize=" + pageSize + "&SearchText=" + keyword).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  save(data): Observable<IPolicy> {
    if (!data.id) {
      return this.create(data);
    } else {
      return this.update(data);
    }
  }

  private create(data: any): Observable<IPolicy> {
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

  private update(data): Observable<IPolicy> {
    //console.log(data);

    return this.http.put(this._apiUrl, data).pipe(
      map((response: any) => {
        return response.data;
      })
      // catchError((error) => this.handleError(error))
    );
  }

  getById(id: number): Observable<IPolicy> {

    return this.http.get(`${this._apiUrl}/${id}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );

  }

  /*GetView */
  getView(id: number): Observable<IPolicy> {

    return this.http.get(this._apiUrl + "/GetView/" + id).pipe(
      map((response: any) => {
        return response.data;
      })
    );

  }

  updateList(){
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

  changeList() {

    console.log(this._list);
    this.listSource.next(this._list)
  }
}

