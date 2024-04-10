import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewCases, NewCaseStatuses } from './case.model';
import { EnvService } from '../../../env.service';
import { BehaviorSubject, Observable, catchError, finalize, map, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { CasesDashboardComponent } from '../dashboard/cases/cases-dashboard.component';


@Injectable()
export class CaseService {
    private _baseUrl = '';
    private _apiUrl = `${this._baseUrl}/Kase`;
    _allRecordCount: number;
    private _list: NewCases[] = [];

    private listSource = new BehaviorSubject(this._list);
    currentList = this.listSource.asObservable();

    constructor(private http: HttpClient, private env: EnvService,private dashboardService : CasesDashboardComponent) {
        this._baseUrl = env.baseApiUrl;
        this._apiUrl = `${this._baseUrl}`;
    }

    getNewCases() {
        return this.http.get<any>('assets/demo/data/new-kases.json')
        .toPromise()
        .then(res => res.data as NewCases[])
        .then(data => data);
    } 

    getCaseStatuses() {
        return this.http.get<any>('assets/demo/data/new-kases.json')
        .toPromise()
        .then(res => res.kase_statuses as NewCaseStatuses[])
        .then(data => data);
    } 
    getAllCases(pageId:number,pageLimit:number): Observable<NewCases[]> {
        const params = new HttpParams()
        .set('pageId', pageId.toString())
        .set('pageLimit', pageLimit.toString());
        console.log(this._apiUrl);
        return this.http.get(`${this._apiUrl}/Kase/GetAllKases`,{params}).pipe(
            map((response: any) => {
                this._allRecordCount = response.totalRecords;
                return response.data as NewCases[];
            })
        );
    }

    deleteCase(id: string): Observable<any> {
        const url = `${this._apiUrl}/${id}`;
        return this.http.delete(url);
      }

    getDropDownData(): Observable<any> {
        const url = `${this._apiUrl}`;
        return this.http.get(url +'/Kase/GetKaseDropdownData')
        .pipe(
            map((response: any) => {
                return response;
            })
        );
    }
    
    save(data): Observable<NewCases> {
        if (!data.id) {
            return this.create(data);
        } else {
            return this.update(data);
        }
    }

    private create(data: any): Observable<NewCases> {
        //console.log(data);
        const url = `${this._apiUrl}`;
        return this.http.post(url +'/CaseFile', data).pipe(
            map((response: any) => {
                return response.data as NewCases;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    private update(data): Observable<NewCases> {
        const url = `${this._apiUrl}`;
        return this.http.put(url +'/CaseFile', data).pipe(
            map((response: any) => {
                 return response as NewCases;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
    changeList() {
        this.listSource.next(this._list);
    }

    uploadFile(formData: FormData, caseId: number) {
        const url = `${this._apiUrl}/CaseFile/FileUpload`;
        formData.append('caseId', caseId.toString()); // Append caseId to formData
      
        return this.http.post<any>(url, formData);
      }

      getCaseById(id: number): Observable<NewCases> {
        return this.http.get(`${this._apiUrl}/Kase/${id}`).pipe(
            map((response: any) => {
                //console.log(response);
                return response.data;
            })
        );
    }
    getCaseAgendaById(id: number): Observable<NewCases> {
        return this.http.get(`${this._apiUrl}/CaseFile/${id}`).pipe(
            map((response: any) => {
                //console.log(response);
                return response.data;
            })
        );
    }
    }