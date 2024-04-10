/* #region angular imports */
import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
/* #endregion */

/* #region 3rd party imports */
import { LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
/* #endregion */

/* #region app imports */
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { EnumToDropdown } from '../../../shared/utils';
import { RecordStatus, SeverityLevel } from '../../../shared/enums';
import { EnumAsStringPipe } from '../../../shared/pipes';

import { Location } from '@angular/common';
import { Table } from 'primeng/table';
import { IMacroFields, RecordStatusList } from '../macro-field.model';
import { MacroFieldService } from '../macro-field.service';
import { EditMacroFieldComponent } from '../edit/edit-macro-field.component';
export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'aeliusmd-list-macro-field',
  templateUrl: './list-macro-field.component.html',
  styleUrls: [
    './list-macro-field.component.css',
    './list-macro-field.component.scss',
  ],
})
export class ListMacroFieldsComponent {
  /* #region initialization */
  _routePath: string = 'administration/macro-field';
  _pageTitle: string = 'Administration Labs';
  _pageSubTitle: string = '/ List';
  _recordStatus = RecordStatusList;
  _tableColumns: any[];

  _spinner: string = 'listMacroFieldsSpinner';

  _form: UntypedFormGroup;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;
  _searchMethod = SearchMethod.Regular;
  //_list: IPolicy[];

  _isViewPolicyVisible: boolean = false;
  _isCreatePolicyVisible: boolean = false;
  _isEditMacroFieldVisible: boolean = false;

  _keyword: string;
  _totalRecords: number;
  _macroField: IMacroFields[] = [];

  @ViewChild('labsTable')
  _labsTableElementRef: Table;

  subscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private uiMessageService: UIMessageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private macroFieldService: MacroFieldService
  ) {}
  /* #endregion */

  /* #region lifecycle events */
  ngOnInit() {
    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],
    });

    this.list();
    this.subscription = this.macroFieldService.currentList.subscribe((list) => {
      this._macroField = list;
    });
  }

  refresh() {
    this.list();
  }

  list() {
    this.spinner.show(this._spinner);

    this.macroFieldService
      .getAll()
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this._macroField = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSearchKeyUp(event: KeyboardEvent, keyword: string) {
    if (event.keyCode != 13) {
      this._macroField = null;
      return;
    }
    this.spinner.show(this._spinner);

    this._keyword = keyword;
    this.macroFieldService
      .getSearchListWithPagination(1, 10, this._keyword)
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this._macroField = response.data;
          this._totalRecords = response.totalRecords;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  macroFieldSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode != 13) {
      this._macroField = null;
      return;
    }

    this._searchMethod = SearchMethod.Regular;
    this.search();
  }

  search() {
    this._page = 1;
    this._labsTableElementRef._first = 0;
    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  regularSearch() {
    this.spinner.show(this._spinner);
    this._keyword = this._form.get('keyword').value;

    this.macroFieldService._page = this._page;
    this.macroFieldService._pageSize = this._rows;
    this.macroFieldService._keyword = this._keyword;

    setTimeout(() => {
      this.macroFieldService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(finalize(() => {}))
        .subscribe(
          (response) => {
            console.log(response);
            this._macroField = response.data;
            console.log('kkkk', this._macroField);
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 1000);
  }

  validateSearch(): boolean {
    this._keyword = this._form.get('keyword').value;

    if (this._searchMethod == SearchMethod.Regular) {
      if (this._keyword == null || this._keyword == '') {
        return false;
      }
    }
  }

  onRegularSearchClick() {
    this._keyword = this._form.get('keyword').value;

    this.macroFieldService
      .getSearchListWithPagination(this._page, this._rows, this._keyword)
      .pipe(finalize(() => {}))
      .subscribe(
        (response) => {
          this._macroField = response.data;
          console.log('macro_Field', this._macroField);
          this._totalRecords = response.totalRecords;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  clearSearch() {
    this._totalRecords = 0;
    this._form.reset();
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-macro-field' },
      },
    ]);
  }

  edit(rowData: any) {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-macro-field/' + rowData.id },
      },
    ]);
  }

  view(rowData: any) {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-macro-field/' + rowData.id },
      },
    ]);
  }

  close() {
    let s = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
    s = s + '/0';
    this.router.navigate([
      s,
      {
        outlets: { modal: null },
      },
    ]);
  }

  loadDate(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this._rows = event.rows;

    if (this._searchMethod == SearchMethod.Regular) {
      this.onRegularSearchClick();
    }
  }
  administrationLabsCreateCloseEventHandler(event: any) {
    this._isCreatePolicyVisible = false;
  }

  policyCreateEventHandler(event: any) {
    this._isCreatePolicyVisible = false;
  }

  policyViewCloseEventHandler(event: any) {
    this._isViewPolicyVisible = false;
  }

  administrationLabsEditCloseEventHandler(event: any) {
    this._isEditMacroFieldVisible = false;
  }

  administrationLabsEditEventHandler(event: any) {
    this._isEditMacroFieldVisible = false;
  }
}
