import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
  CurrentUserService,
} from '../../../shared/services';
import { EnumToDropdown } from '../../../shared/utils';
import {
  RecordStatus,
  SeverityLevel,
  ReportOption,
  ObjectType,
} from '../../../shared/enums';
import { EnumAsStringPipe, TrueFalseToYesNoPipe } from '../../../shared/pipes';
import { Table } from 'primeng/table';

import { RecordStatusList } from '../email-templates.model';
import { EmailTemplateService } from '../email-template.service';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'aeliusmd-list-email-template',
  templateUrl: './list-email-templates.component.html',
  styleUrls: [
    './list-email-templates.component.css',
    './list-email-templates.component.scss',
  ],
})
export class ListEmailTemplateComponent {
  _objectType: ObjectType = ObjectType.Question;
  _pageTitle: string = 'EMAIL TEMPLATES';
  _pageSubTitle: string = '';

  _form: UntypedFormGroup;

  _questionsTableColumns: any[];
  _list: any[] = [];

  _keyword: string;

  _totalRecords: number = 0;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;

  _isRowExpanded: boolean = false;
  _expandedRows = {};
  _dataLength: number = 0;

  _isCreateQuestionVisible: boolean = false;
  _isViewQuestionVisible: boolean = false;
  _isEditQuestionVisible: boolean = false;
  _isViewAnswerVisible: boolean = false;

  _recordStatus = RecordStatusList;

  _searchMethod = SearchMethod.Regular;

  @ViewChild('id_visitType_table')
  _el_p_table: Table;

  @ViewChild('keyword', { static: false })
  _el_Keyword: ElementRef;

  subscription: Subscription;
  message: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private currentUserService: CurrentUserService,
    private uiMessageService: UIMessageService,
    private emailTemplateService: EmailTemplateService
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      keyword: [{ value: '', disabled: false }],
      code: [{ value: null, disabled: false }],
      description: [{ value: null, disabled: false }],

      recordStatusId: [{ value: null, disabled: false }],
      recordStatus: [{ value: null, disabled: false }],
      recordStatusDisplayName: [{ value: null, disabled: false }],
    });

    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);

    this.subscription = this.emailTemplateService.currentList.subscribe(
      (message) => (this._list = message)
    );
  }

  search() {
    this._page = 1;
    // this._el_p_table._first = 0;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  onRegularSearchClick() {
    this._searchMethod = SearchMethod.Regular;
    this._list = [];
    this.search();
  }

  regularSearch() {
    this._keyword = this._form.get('keyword').value;

    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(this._keyword)) {
      this.uiMessageService.warning('Please check search text');
    }

    this.emailTemplateService._page = this._page;
    this.emailTemplateService._pageSize = this._rows;
    this.emailTemplateService._keyword = this._keyword;

    setTimeout(() => {
      this.emailTemplateService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(finalize(() => {}))
        .subscribe(
          (response) => {
            console.log(response);
            //this._list = [];
            this._totalRecords = response.totalRecords;
            this.emailTemplateService.changeList();
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 1000);
  }

  clearSearch() {
    this._list = null;
    this._totalRecords = 0;
    this._form.reset();

    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  onLazyLoad(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this._rows = event.rows;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode != 13) {
      this._list = null;
      return;
    }

    this._searchMethod = SearchMethod.Regular;
    this.search();
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-email-template' },
      },
    ]);
  }

  view(rowData: any) {
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-email-template/' + rowData.id },
      },
    ]);
  }

  edit(rowData: any) {
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-email-template/' + rowData.id },
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

  // getAll() {
  //   setTimeout(() => {
  //     this.emailTemplateService
  //       .getAll()
  //       .pipe(finalize(() => {}))
  //       .subscribe(
  //         (response) => {
  //           //console.log(response);
  //           this._list = response;

  //           //this._totalRecords = response.totalRecords;
  //         },
  //         (error) => {
  //           this.uiMessageService.error(error);
  //         }
  //       );
  //   }, 1000);
  // }
}
