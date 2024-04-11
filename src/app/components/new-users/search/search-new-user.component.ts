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
import { UIMessageService } from 'src/app/shared/services/ui-message.service';
import { INewUsers, RecordStatusList } from '../new-user.model';
import { NewUserService } from '../new-user.service';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'picvs-search-new-user',
  templateUrl: './search-new-user.component.html',
  styleUrls: ['./search-new-user.component.css'],
})
export class SearchNewUserComponent implements OnInit {
  _recordStatus = RecordStatusList;
  _pageTitle: string = 'NewUsers';
  _pageSubTitle: string = '';
  _form: UntypedFormGroup;
  _tableColumns: any[];

  _list: INewUsers[] = [];
  _totalRecords: number = 0;
  _page: number = 0;
  _rows: number = 10;
  _currentSearchMethod = SearchMethod.Regular;
  selectedRows: [];
  _keyword: string;

  @Input() _controllerId?: string;
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
    private newUserService: NewUserService
  ) {}

  ngOnInit(): void {
    this._currentSearchMethod = SearchMethod.Regular;

    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],
    });

    this._tableColumns = [
      { field: 'id', header: 'Id', width: '0%', visible: false },
      {
        field: 'rowVersion',
        header: 'Row Version',
        width: '0%',
        visible: false,
      },
      {
        field: 'client',
        header: 'Client',
        width: '',
        visible: false,
      },
      {
        field: 'company',
        header: 'Company',
        width: '',
        visible: false,
      },
      {
        field: 'firstName',
        header: 'First Name',
        width: '',
        visible: true,
      },
      {
        field: 'lastName',
        header: 'Last Name',
        width: '',
        visible: true,
      },
      {
        field: 'phone',
        header: 'phone',
        width: '',
        visible: true,
      },
      {
        field: 'email',
        header: 'email',
        width: '',
        visible: true,
      },
      {
        field: 'usersType',
        header: 'User Type',
        width: '',
        visible: true,
      },
      
      {
        field: 'userGroup',
        header: 'User Group',
        width: '',
        visible: true,
      },
      {
        field: 'password',
        header: 'Password',
        width: '',
        visible: true,
      },
      {
        field: 'confirmPassword',
        header: 'Confirm Password',
        width: '',
        visible: true,
      },
      //{
      //  field: 'insurance',
      //  header: 'Insurance',
      //  width: '',
      //  visible: true,
     // },
    ];

    this.search();
  }

  public focusComponent() {}

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

  onClearSearchClick() {
    this._list = null;
    this._totalRecords = 0;
    this._form.reset();
  }

  search() {
    this._page = 1;
    if(this._el_p_table){

      this._el_p_table.reset();
    }

    if (this._currentSearchMethod == SearchMethod.Regular) {
      this.searchRegular();
    }
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

  searchRegular() {
    setTimeout(() => {
      this.newUserService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(finalize(() => {}))
        .subscribe(
          (response) => {
            //console.log('eventTypesService : ' + JSON.stringify(response.data));
            //let res = JSON.parse(JSON.stringify(response) || null);
            this._list = response.data;
            this._totalRecords = response.totalRecords;
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 1000);
  }

  searchByMultipleFilters() {}

  onLazyLoad(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this._rows = event.rows;

    if (!this.validateSearch()) return;

    if (this._currentSearchMethod == SearchMethod.Regular) {
      this.searchRegular();
    }
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode != 13) {
      this._list = null;
      return;
    }

    this._currentSearchMethod = SearchMethod.Regular;
    this.search();
  }

  onSearchClick() {
    this._currentSearchMethod = SearchMethod.Regular;
    this._list = null;
    this.search();
  }

  clearSearch() {
    this._list = null;
    this._totalRecords = 0;
    this._form.reset();
    this.selectedRows = [];
  }

  onRowSelect(event) {
    //console.log(event.data);
    event.data.controllerId = this._controllerId;
    event.data.objectTypeId = 14;
    event.data.multipleSelection = true;
    this.onRecordSelect.emit(event.data);
  }

  close() {
    this.onClose.emit();
  }
}
