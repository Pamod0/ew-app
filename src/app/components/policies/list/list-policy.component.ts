import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { EnumToDropdown } from '../../../shared/utils';
import { RecordStatus, SeverityLevel } from '../../../shared/enums';
import { EnumAsStringPipe } from '../../../shared/pipes';

import { Location } from '@angular/common';
import { Table } from 'primeng/table';
import { IPolicy, RecordStatusList } from '../policy.model';
import { PolicyService } from '../policy.service';
import { CreatePolicyComponent } from '../create/create-policy.component';
import { EditPolicyComponent } from '../edit/edit-policy.component';
import { ViewPolicyComponent } from '../view/view-policy.component';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'aeliusmd-list-policies',
  templateUrl: './list-policy.component.html',
  styleUrls: ['./list-policy.component.css', './list-policy.component.scss'],
})
export class ListPoliciesComponent {
  _routePath: string = 'administration/administration-labs';
  _pageTitle: string = 'Administration Labs';
  _pageSubTitle: string = '/ List';
  _recordStatus = RecordStatusList;
  _tableColumns: any[];

  _spinner: string = 'listAdministrationLabsSpinner';

  _form: UntypedFormGroup;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;
  _searchMethod = SearchMethod.Regular;
  _list: IPolicy[];

  _isViewPolicyVisible: boolean = false;
  _isCreatePolicyVisible: boolean = false;
  _isEditPolicyVisible: boolean = false;

  _keyword: string;
  _totalRecords: number;

  @ViewChild('policiesTable')
  _policyTableElementRef: Table;

  @ViewChild('keyword', { static: false })
  _el_Keyword: ElementRef;

  // @ViewChild('id_view_policy', { static: true })
  // _viewPolicy: ViewPolicyComponent;

  // @ViewChild('id_edit_policy', { static: true })
  // _editPolicy: EditPolicyComponent;

  // @ViewChild('id_create_policy', { static: true })
  // _createPolicyComponent: CreatePolicyComponent;

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
    private policyService: PolicyService
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],
    });

    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  onSearchKeyUp(event: KeyboardEvent, keyword: string) {
    if (event.keyCode != 13) {
      this._list = null;
      return;
    }
    this.spinner.show(this._spinner);

    this._keyword = keyword;
    this.policyService
      .getSearchListWithPagination(1, 10, this._keyword)
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this._list = response.data;
          this._totalRecords = response.totalRecords;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  resourceSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode != 13) {
      this._list = null;
      return;
    }

    this._searchMethod = SearchMethod.Regular;
    this.search();
  }

  search() {
    this._page = 1;
    this._policyTableElementRef._first = 0;
    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  regularSearch() {
    this.spinner.show(this._spinner);
    this._keyword = this._form.get('keyword').value;

    // this.policyService._page = this._page;
    // this.policyService._pageSize = this._rows;
    // this.policyService._keyword = this._keyword;

    setTimeout(() => {
      this.policyService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(finalize(() => {}))
        .subscribe(
          (response) => {
            console.log(response);
            this._list = response.data;
            this._totalRecords = response.totalRecords;
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

    this.policyService
      .getSearchListWithPagination(this._page, this._rows, this._keyword)
      .pipe(finalize(() => {}))
      .subscribe(
        (response) => {
          this._list = response.data;
          console.log('policy_list', this._list);
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

  onLazyLoad(event: LazyLoadEvent) {
    this._page = event.first / event.rows + 1;
    this._rows = event.rows;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-policy' },
      },
    ]);
  }

  edit(rowData: any) {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-policy/' + rowData.id },
      },
    ]);
  }

  view(rowData: any) {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-policy/' + rowData.id },
      },
    ]);
  }

  close() {
    let toplevelURL = this.router.url.substring(
      0,
      this.router.url.lastIndexOf('/')
    );
    toplevelURL = toplevelURL + '/0';
    this.router.navigate([
      toplevelURL,
      {
        outlets: { modal: null },
      },
    ]);
  }

  loadDate(event: LazyLoadEvent) {}

  policyCreateEventHandler(event: any) {
    this._isCreatePolicyVisible = false;
  }

  policyViewCloseEventHandler(event: any) {
    this._isViewPolicyVisible = false;
  }
}
