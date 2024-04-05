import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { EnvService } from 'src/app/env.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private _baseUrl = '';
  private _apiUrl = `${this._baseUrl}/api/Reports`;

  constructor(private http: HttpClient, private env: EnvService) {
    this._baseUrl = env.reportApiUrl;
    this._apiUrl = `${this._baseUrl}/api/Reports`;
  }

  getReports(caseId?) {
    let _url = this._baseUrl + '/api/Reports?caseId=' + caseId;
    return this.http.get(_url, { responseType: 'arraybuffer' }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // getReports(caseId?) {
  //   let obj = {
  //     CaseId : caseId,
  //     //QuestionIDs : [1,2]
  //   };
  // return this.http.post(this._baseUrl+"/api/Reports", obj).pipe(
  //   map((response: any) => {
  //     return response.data;
  //   })   
  // );}
}
