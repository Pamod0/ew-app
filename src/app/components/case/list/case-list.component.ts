import { Component, HostListener } from '@angular/core';
import { NewCases } from '../case.model';
import { BehaviorSubject } from 'rxjs';
import { CaseService } from '../case.service';
import { DatePipe } from '@angular/common';
import { UIMessageService } from 'src/app/shared/services';
import { LazyLoadEvent } from 'primeng/api';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class ListCaseComponent {
  newkases: NewCases[] = [];
  newkase : NewCases={};
  showAddNew: boolean = false;
  formEdit: boolean = false;
  _innerHeight : any ='0px';
  isViewMode: string;
  formWidth: string;
  currentIndex: number = 0;
  currentPage: number = 1;
  rows: number = 10;
  _totalRecords: number = 0;
  _page: number = 1;
  _selectedRow: any;
  deleteKaseDialog: boolean=false;
  @HostListener ('window : resize',['$event'])
  onResize(event){
    this._innerHeight = window.innerHeight + 'px';
  }
  _listSource = new BehaviorSubject(this.newkases);
  viewMode: boolean = false;
  kaseEdit: boolean = false;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  constructor(private newKaseService: CaseService,
    private datePipe: DatePipe,
    private uiMessageService: UIMessageService,) {
          
      }
  ngOnInit() {
      // this.newKaseService.getNewKases().then(data => this.newkases = data);
      this._innerHeight = window.innerHeight + 'px';
      this.formWidth = 'col-12';
      this.getKases();
      this.items = [
        { label: 'My Case'},
        { label: 'Firm Cases'},
        { label: 'My Open' },
        { label: 'My Closed'},
    ];

    this.activeItem = this.items[0];

  }
  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }
  showAddNewForm() {
    this.showAddNew = true;
    this.kaseEdit = false;
    this.isViewMode = '!isViewMode';
    this.formWidth = 'hideBox';
  }

  hideAddnew() {
    this.formEdit = false;
    this.showAddNew = false;
    this.formWidth = 'col-12';
  }

  getKases(pageId: number = 1, pageLimit: number = this.rows) {
    this.newKaseService.getAllCases(pageId, pageLimit).subscribe(
      (response) => {
        this._totalRecords = this.newKaseService._allRecordCount;
        this.newkases = response
          .filter(e => !e.isDeleted)
          .map((e, index) => {
            const formattedKaseDate = this.transformDate(e.createdDateTime);
            return {
              ...e,
              formattedKaseDate,
              customerId: (pageId - 1) * pageLimit + index + 1
            };
          });
        this.currentIndex = (pageId - 1) * pageLimit + this.rows;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  transformDate(apiDate: string): string {
    const formattedDate = this.datePipe.transform(apiDate, 'yyyy-MM-dd');
    return formattedDate || ''; // Return an empty string or handle null case
  }

  onLazyLoad(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this.rows = event.rows;
   
    this.getKases(this._page,this.rows);
     
  }
  deleteSelectedKase(id) {
    this.deleteKaseDialog = true;
    this.newkase = this.newkases.find(item => item.id === id);
  }
  
  deleteKase(kase) {
    this.newKaseService.deleteCase(kase.id).subscribe(
      () => {
        this.uiMessageService.success('Record successfully deleted');
        this.deleteKaseDialog = false;
        this.updateKaseList(kase.id);
        this.changeList();
        this.getKases();
      },
      (error) => {
        this.uiMessageService.error(error);
      }
    );
  }
  private updateKaseList(kaseId) {
    const index = this.newkases.findIndex((kase) => kase.id === kaseId);

    if (index !== -1) {
      this.newkases.splice(index, 1);
    }
  }

  changeList() {
    this._listSource.next(this.newkases);
  }
  editKase(id) {
    this.newkase = this.newkases.find(item => item.id === id);
    this.kaseEdit = true;
    this.viewMode = false;
    this.showAddNew = false;
    this.formWidth = 'hideBox';
  }
  
}
