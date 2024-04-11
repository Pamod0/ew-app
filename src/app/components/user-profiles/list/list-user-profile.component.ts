import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { UIMessageService } from 'src/app/shared/services';
import { IUserProfile, RecordStatus } from '../user-profile.model';
import { UserProfileService } from '../user-profile.service';
import { Router } from '@angular/router';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'app-list-user-profile',
  templateUrl: './list-user-profile.component.html',
  styleUrls: ['./list-user-profile.component.css'],
})
export class ListUserProfileComponent implements OnInit {
  _pageTitle: string = 'USER PROFILES';
  _pageSubTitle: string = '';

  _form: FormGroup;
  

  _totalRecords: number = 0;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;

  _recordStatus = RecordStatus;

  _list: IUserProfile[];
  _userProfile: IUserProfile;

  _searchMethod = SearchMethod.Regular;
  _keyword: string;
  _routePath: string = 'administration/user-profile';

  _isViewUserProfileVisible: boolean = false;
  _isCreateUserProfileVisible: boolean = false;
  _isEditUserProfileVisible: boolean = false;

  @ViewChild('userProfileTable')
  _userProfileTableElementRef: Table;

  @ViewChild('keyword', { static: false })
  _el_Keyword: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private userProfileService: UserProfileService,
    private uiMessageService: UIMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],
    });
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  get userProfile() {
    return this._userProfile;
  }
  set userProfile(value: any) {
    this._userProfile = value;
  }

  search() {
    this._page = 1;
    this._userProfileTableElementRef._first = 0;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  regularSearch() {
    // this.spinner.show(this._spinner);

    this._keyword = this._form.get('keyword').value;

    setTimeout(() => {
      this.userProfileService
        .getSearchListWithPagination(this._page, this._rows, this._keyword)
        .pipe(
          finalize(() => {
            // this.spinner.hide(this._spinner);
          })
        )
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
    this._userProfile = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-user-profile/' + rowData.id },
      },
    ]);
  }

  userProfileViewCloseEventHandler(event: any) {
    this._isViewUserProfileVisible = false;
    this._userProfile = null;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-user-profile' },
      },
    ]);
  }

  userProfileCreatedEventHandler(event: any) {
    this._isCreateUserProfileVisible = false;
    this.search();
  }

  userProfileCreateCloseEventHandler(event: any) {
    this._isCreateUserProfileVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  edit(rowData: any) {
    this.userProfile = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-user-profile/' + rowData.id },
      },
    ]);
  }

  userProfileEditedEventHandler(event: any) {
    this._isEditUserProfileVisible = false;
    this.search();
  }

  userProfileEditCloseEventHandler(event: any) {
    this._isEditUserProfileVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  userGroupSearchEventHandler(event: any) {
    this.search();
  }

  close() {
    //this.location.back();
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
