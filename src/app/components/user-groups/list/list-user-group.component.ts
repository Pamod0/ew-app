import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { EnumToDropdown } from '../../../shared/utils';
import { RecordStatus, SeverityLevel } from '../../../shared/enums';
import { EnumAsStringPipe } from '../../../shared/pipes';
import { IUserGroup } from '../user-group.model';
import { UserGroupService } from '../user-group.service';
import { Table } from 'primeng/table';
import { ViewUserGroupComponent } from '../view/view-user-group.component';
import { CreateUserGroupComponent } from '../create/create-user-group.component';
import { EditUserGroupComponent } from '../edit/edit-user-group.component';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'aeliusmd-list-user-group',
  templateUrl: './list-user-group.component.html',
  styleUrls: [
    './list-user-group.component.css',
    './list-user-group.component.scss',
  ],
})
export class ListUserGroupComponent {
  _pageTitle: string = 'USER GROUPS';
  _pageSubTitle: string = '';

  _form: UntypedFormGroup;

   _spinner: string = 'listUserGroupSpinner';

  _totalRecords: number = 0;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;

  _recordStatus = RecordStatus;

  _list: IUserGroup[];
  _userGroup: IUserGroup;

  _searchMethod = SearchMethod.Regular;
  _keyword: string;
  _routePath: string = 'administration/user-groups';

  _isViewUserGroupVisible: boolean = false;
  _isCreateUserGroupVisible: boolean = false;
  _isEditUserGroupVisible: boolean = false;

  @ViewChild('userGroupTable')
  _userGroupTableElementRef: Table;

  @ViewChild('keyword', { static: false })
  _el_Keyword: ElementRef;

  // @ViewChild('viewUserGroupComponent', { static: true })
  // _viewUserGroupComponentElementRef: ViewUserGroupComponent;

  // @ViewChild('createUserGroupComponent', { static: true })
  // _createUserGroupComponentElementRef: CreateUserGroupComponent;

  // @ViewChild('editUserGroupComponent', { static: true })
  // _editUserGroupComponentElementRef: EditUserGroupComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userGroupService: UserGroupService,
    private uiMessageService: UIMessageService,
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],     
    });
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  get userGroup() {
    return this._userGroup;
  }
  set userGroup(value: any) {
    this._userGroup = value;
  }

  search() {
    this._page = 1;
    this._userGroupTableElementRef._first = 0;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  regularSearch() {
     this.spinner.show(this._spinner);

    this._keyword = this._form.get('keyword').value;

    setTimeout(() => {
      this.userGroupService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(
          finalize(() => {
            this.spinner.hide(this._spinner);
          })
        )
        .subscribe(
          (response) => {
            //console.log(response);
            this._list = response.data;
            this._totalRecords = response.totalRecords;
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 1000);
  }

  onRegularSearchClick() {
    this._searchMethod = SearchMethod.Regular;
    this._list = null;
    this.search();
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

  view(rowData: any) {
    this._userGroup = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-user-group/' + rowData.id },
      },
    ]);
  }

  userGroupViewCloseEventHandler(event: any) {
    this._isViewUserGroupVisible = false;
    this._userGroup = null;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-user-group' },
      },
    ]);
  }

  userGroupCreatedEventHandler(event: any) {
    this._isCreateUserGroupVisible = false;
    this.search();
  }

  userGroupCreateCloseEventHandler(event: any) {
    this._isCreateUserGroupVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  edit(rowData: any) {
    this.userGroup = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-user-group/' + rowData.id },
      },
    ]);
  }

  userGroupEditedEventHandler(event: any) {
    this._isEditUserGroupVisible = false;
    this.search();
  }

  userGroupEditCloseEventHandler(event: any) {
    this._isEditUserGroupVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  userGroupSearchEventHandler(event: any) {
    this.search();
  }

  close() {
    // this.location.back();
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
}
