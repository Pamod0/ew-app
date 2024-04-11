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
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { EnumToDropdown } from '../../../shared/utils';
import { RecordStatus, SeverityLevel } from '../../../shared/enums';
import { EnumAsStringPipe } from '../../../shared/pipes';
import { INewUsers } from '../new-user.model';
import { NewUserService } from '../new-user.service';
import { Table } from 'primeng/table';
//import { ViewClientComponent } from '../view/view-client.component';
//import { CreateClientComponent } from '../create/create-client.component';
//import { EditClientComponent } from '../edit/edit-client.component';

export enum SearchMethod {
  Regular,
  MultipleFilters,
}

@Component({
  selector: 'aeliusmd-list-new-user',
  templateUrl: './list-new-user.component.html',
  styleUrls: [
    './list-new-user.component.css',
    './list-new-user.component.scss',
  ],
})
export class ListNewUserComponent {
  _pageTitle: string = 'User';
  _pageSubTitle: string = '';

  _form: UntypedFormGroup;

   _spinner: string = 'listNewUSerSpinner';

  _totalRecords: number = 0;
  _page: number = 1;
  _rows: number = 10;
  _selectedRow: any;
  _usersTypeId: any;
  _userTypeId: any;
  _clientId: any;

  _recordStatus = RecordStatus;

  _list: INewUsers[];
  _newUser: INewUsers;

  _searchMethod = SearchMethod.Regular;
  _keyword: string;
  _routePath: string = 'administration/newUsers';

  _isViewNewUserVisible: boolean = false;
  _isCreateNewUserVisible: boolean = false;
  _isEditNewUserVisible: boolean = false;
  subscription: Subscription;

  @ViewChild('newUserTable')
  _newUserTableElementRef: Table;

  @ViewChild('keyword', { static: false })
  _el_Keyword: ElementRef;

  

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private newUserService: NewUserService,
    private uiMessageService: UIMessageService,
    private location: Location,
    private spinner: NgxSpinnerService,
    //private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      keyword: [{ value: null, disabled: false }],     
    });

    /*this._userTypeId = Number(this.currentUserService.getUserTypeId())

    if (this._userTypeId == 0) {
      this._clientId = 0
    }
    else {
      this._clientId = Number(this.currentUserService.getClientId());

    }*/

    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);

    this.subscription = this.newUserService.currentList.subscribe(
      (message) => (this._list = message)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get newUser() {
    return this._newUser;
  }
  set newUser(value: any) {
    this._newUser = value;
  }

  search() {
    this._page = 1;
    this._newUserTableElementRef._first = 0;

    if (this._searchMethod == SearchMethod.Regular) {
      this.regularSearch();
    }
  }

  regularSearch() {
     this.spinner.show(this._spinner);

    this._keyword = this._form.get('keyword').value;

    this.newUserService._page = this._page;
    this.newUserService._pageSize = this._rows;
    this.newUserService._keyword = this._keyword;
    //this.newUserService._clientId = this._clientId;


    setTimeout(() => {
      this.newUserService
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
    this._page = (this._page - 1) * 10;
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
    this._newUser = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/view-new-user/' + rowData.id + "/view" }
      },
    ]);
  }

  newUserViewCloseEventHandler(event: any) {
    this._isViewNewUserVisible = false;
    this._newUser = null;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  create() {
    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/add-new-user/' + "create" },
      },
    ]);
  }

  newUserCreatedEventHandler(event: any) {
    this._isCreateNewUserVisible = false;
    this.search();
  }

  newUserCreateCloseEventHandler(event: any) {
    this._isCreateNewUserVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  edit(rowData: any) {
    this.newUser = rowData;
    this._selectedRow = rowData;

    this.router.navigate([
      this.router.url,
      {
        outlets: { modal: 'modal/edit-new-user/' + rowData.id + "/edit" },
      },
    ]);
  }

  sendLoginDetails(rowData: any) {
    this.newUser = rowData;
    this._selectedRow = rowData;
    setTimeout(() => {
      this.newUserService
        .sendLoginDetails(this.newUser)
        .pipe(
          finalize(() => {
            this.spinner.hide(this._spinner);
          })
        )
        .subscribe(
          (response) => {
            //alert("Sending Login Credentials Successful");
            this.uiMessageService.success('Sending Login Credentials Successful');
          },
          (error) => {
            this.uiMessageService.error(error);
          }
        );
    }, 500);
  
  }


  newUserEditedEventHandler(event: any) {
    this._isEditNewUserVisible = false;
    this.search();
  }

  newUserEditCloseEventHandler(event: any) {
    this._isEditNewUserVisible = false;
    setTimeout(() => {
      this._el_Keyword.nativeElement.focus();
    }, 100);
  }

  newUserSearchEventHandler(event: any) {
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
