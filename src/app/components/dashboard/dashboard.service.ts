import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskList, CaseList, MessageLists } from './dashboard.model';
import { CaseCrudComponent } from '../case/crud/case-crud.component';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class DashboardService {

    constructor(private http: HttpClient) { }

    getTaskLists() {
        return this.http.get<any>('assets/demo/data/dashboard-data.json')
        .toPromise()
        .then(res => res.taskdata as TaskList[])
        .then(data => data);
    }

    getCaseLists() {
        return this.http.get<any>('assets/demo/data/dashboard-data.json')
        .toPromise()
        .then(res => res.casedata as CaseList[])
        .then(data => data);
    }

    getMessageLists() {
        return this.http.get<any>('assets/demo/data/dashboard-data.json')
        .toPromise()
        .then(res => res.messagedata as MessageLists[])
        .then(data => data);
    }
    private _displaySidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displaySidebar$: Observable<boolean> = this._displaySidebar.asObservable();

  toggleSidebar(): void {
    this._displaySidebar.next(!this._displaySidebar.value);
  }
}
