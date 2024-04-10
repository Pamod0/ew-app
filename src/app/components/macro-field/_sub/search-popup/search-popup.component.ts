import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { ObjectType } from 'src/app/shared/enums';
import { UIMessageService } from 'src/app/shared/services/ui-message.service';
//import { runInThisContext } from 'vm';
import { RecordStatusList } from '../../macro-field.model';
import { MacroFieldService } from '../../macro-field.service';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'picvs-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css'],
})
export class SearchPopupComponent implements OnInit {
  _recordStatus = RecordStatusList;
  _pageTitle: string = 'Clients';
  _pageSubTitle: string = '';
  _form: UntypedFormGroup;
  _tableColumns: any[];

  _list: any[] = [];
  columns: any[] = [];
  _totalRecords: number = 0;
  _page: number = 1;
  _rows: number = 10;
  _currentSearchMethod = SearchMethod.Regular;
  selectedRows: any[];
  _keyword: string;

  _selectionMode: string = 'single';

  @Input() _controllerId?: string;
  @Input() _macroFiledId?: number;
  @Input() _isMultiple?: boolean;
  @Input() _objectId?: number;
  @Output() onRecordSelect = new EventEmitter<object>();
  @Output() onRecordUnSelect = new EventEmitter<object>();
  @Output() onClose = new EventEmitter();

  @ViewChild('id_p_table')
  _el_p_table: Table;

  @ViewChild('id_Keyword_input', { static: false })
  _el_Keyword_input: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private uiMessageService: UIMessageService,
    private macroFieldService: MacroFieldService
  ) {}

  ngOnInit(): void {
    this._currentSearchMethod = SearchMethod.Regular;

    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],
    });

    if (this._isMultiple) {
      this._selectionMode = 'multiple';
    }

    this._tableColumns = [
      { field: 'id', header: 'Id', width: '', visible: true },
      {
        field: 'displayName',
        header: 'Display Name',
        width: '',
        visible: true,
      },
    ];

    console.log("_objectId " , this._objectId);
    

    this._pageTitle = ObjectType[this._objectId];


    //this.search();
  }
  ngOnChanges(questionList: any) {
    console.log("_objectId " , this._objectId);
    console.log('_macroFiledId ', this._macroFiledId);

    if(this._objectId){

      let str = ObjectType[this._objectId];
      this._pageTitle  = str.replace(/[A-Z]/g, ' $&').trim() + " Search";
    }

    //this._pageTitle = ObjectType[this._objectId];
  }

  search() {

    
    this._page = 1;
    if(this._el_p_table){

      this._el_p_table.reset();
    }

    

    this._keyword = this._form.get('keyword').value;


    this.searchRegular();
  }

  searchRegular() {

    if(this._keyword != null){
      this._keyword = this._keyword.split('.').join('');
   }

    setTimeout(() => {
      this.macroFieldService
        .getSearchListWithPaginationById(
          this._page,
          this._rows,
          this._keyword,
          this._macroFiledId
        )
        .pipe(finalize(() => {}))
        .subscribe(
          (response) => {
            console.log('clientsService : ' + JSON.stringify(response.data));
            this._list = response.data;
            this._totalRecords = response.totalRecords;
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 1000);
  }

  onClearSearchClick() {
    
    this._form.patchValue({
      keyword:null
    }) 

    this._list = null;
  }

  onSearchClick(keyword) {
    this._currentSearchMethod = SearchMethod.Regular;
    this._list = null;
    this.search();
  }

  public searchData(keyword: string) {
    this._form.patchValue({
      keyword: keyword,
    });

    this._list = null;
    this._currentSearchMethod = SearchMethod.Regular;
  }

  onSearchTextKeyUp(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.search();
    } else {
      return;
    }
  }

  clearSearch() {
    this._list = null;
    this._totalRecords = 0;
    this._form.reset();
    this.selectedRows = [];
  }

  onRowSelect(event) {
    console.log(event.data);
    event.data.controllerId = this._controllerId;
    event.data.objectTypeId = 14;
    event.data.multipleSelection = this._isMultiple;
    this.onRecordSelect.emit(event.data);
  }

  onLazyLoad(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this._rows = event.rows;

    if (!this.validateSearch()) return;

    //if (this._currentSearchMethod == SearchMethod.Regular) {
      this.searchRegular();
   // }
  }

  validateSearch(): boolean {
    this._keyword = this._form.get('keyword').value;

    if (this._currentSearchMethod == SearchMethod.Regular) {
      if (this._keyword == null || this._keyword == '') {
        return false;
      }
    }

    return true;
  }

  close() {
    this.onClose.emit();
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode != 13) {
      this._list = null;
      return;
    } 
    this.search();
  }
  
}
