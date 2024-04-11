import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';


@Injectable()
export class NodeService {
  private _baseUrl = '';
  private _apiUrl = `${this._baseUrl}/Admin/Module`;
  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.baseApiUrl;
    this._apiUrl = `${this._baseUrl}/Admin/Module`;
  }

  getFiles() {
    return this.http.get<any>(this._apiUrl + "/GetList").toPromise().then(res => <TreeNode[]>res.data);
    // [
    //   {
    //     label: "",
    //     data: "",
    //     children: [],
    //     key:"",
    //     parent:[],
    //   },
    // ];
  }

  getSelectList(): Observable<any> {
    return this.http.get(this._apiUrl + '/GetList').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }
}
