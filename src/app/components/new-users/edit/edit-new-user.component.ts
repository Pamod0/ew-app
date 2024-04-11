import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { finalize, delay, map, tap, catchError } from 'rxjs/operators';
import _ from 'lodash';
import { NewUserService } from '../new-user.service';
import {
  CurrentUserService,
  UIMessageService,
  UIValidationService,
} from '../../../shared/services';
import { ClientList, ClientUserList, CompanyList, DistrictList, INewUsers, RecordStatusList, UserGroupList, UsersTypeList } from '../new-user.model';
import { ModalViewLayoutComponent } from 'src/app/containers';
import { ObjectType } from 'src/app/shared/enums';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabView } from 'primeng/tabview';
import * as moment from 'moment';
import { Dropdown } from 'primeng/dropdown';
import { ClientsService } from '../../clients';
import { CompanyInformationService } from '../../company-informations';


export enum FormControls {
  Non,
  RecordStatus,
  Id,
  district,
  firstName,
  lastName,
  email,
  usersType,
  userGroup,
  nic,
  address,
  phone,
  loginId,
  password,
}

export enum FormActions {
  Non = 1,
  View = 2,
  Create = 3,
  Edit = 4,
}

@Component({
  selector: 'aeliusmd-edit-new-user',
  templateUrl: './edit-new-user.component.html',
  styleUrls: [
    './edit-new-user.component.css',
    './edit-new-user.component.scss',
  ],
})
export class EditNewUserComponent implements OnInit {
  _pageTitle: string = 'User';
  _pageSubTitle: string = '';
  _routePath: string = 'administration/Users';
  _routeSubscribe: any;
  //_form: UntypedFormGroup;
  _form: FormGroup;
  _newUser: INewUsers;
  _district = DistrictList;
  _company = CompanyList;
  _client = ClientList;
  // _usersType = UsersTypeList;
  _usersType = ClientUserList;
  _userGroup = UserGroupList;
  _recordStatus = RecordStatusList;
  _listTypeEnum = FormControls;
  _formAction: FormActions = FormActions.Non;
  _focusedList: any = this._listTypeEnum.Non;
  _formSubmitAttempt: boolean = false;
  subscription: Subscription;
  message: string;
  _editButtonDisabled: boolean = false;
  _disabled: boolean = true;
  _justUpdated: boolean = false;
  _superAdmin: any;
  _clientName: any;
  _clientId: any;
  _innerHeight: any = 0;
  _innerWidth: any = 0;
  _activeTabIndex: number = 0;
  _userType: any;
  clientList: any[] = [];
  companyList: any[] = [];
  _routeSub: any;
  _keyword: any;
  _exist: boolean = false;
  _newUserId: number;
  _page: number;
  _pageSize: number;
  _requestStatusId: any;
  _companyId: number;
  _objectId: number = 0
  _userTypeId: any;
  _clientEditAccess: boolean = false;
  _companyInformationList: any[] = [];
  


  @Input() id: number;
  @Output() newUserEditedEvent = new EventEmitter<object>();
  @Output() newUserEditCloseEvent = new EventEmitter<object>();
  @Output() newUserSearchEvent = new EventEmitter<object>();
  @Input() screen: string;
  @Input() requestType: number;



  @ViewChild('district', { static: false })
  _newUserInitialsElementRef: ElementRef;

  @ViewChild('firstName', { static: false })
  _newUserFirstNameElementRef: ElementRef;

  @ViewChild('lastName', { static: false })
  _newUserLastNameElementRef: ElementRef;

  @ViewChild('nic', { static: false })
  _newUserTitleElementRef: ElementRef;


  @ViewChild('address', { static: false })
  _newUserEmailElementRef: ElementRef;

  @ViewChild('email', { static: false })
  _newUserPhoneElementRef: ElementRef;

  @ViewChild('photo', { static: false })
  _newUserPhotoElementRef: ElementRef;


  // @ViewChild('insurance', { static: false })
  // _eventTypeInsuranceElementRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._innerHeight = (window.innerHeight) + 'px';
    this._innerWidth = (window.innerWidth) + 'px';
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private newUserService: NewUserService,
    private uiMessageService: UIMessageService,
    private modalViewComponent: ModalViewLayoutComponent,
    private fb: FormBuilder,
    private currentUserService: CurrentUserService,
    private clientsService: ClientsService, 
    private companyInformationService: CompanyInformationService
  ) { }

  ngOnInit() {
    this._clientName = this.currentUserService.getClientName();
    this._clientId = Number(this.currentUserService.getClientId());

    this._userType = this.currentUserService.getUserTypeId();

    if (this._userType == "0") {
      this._superAdmin = true
    } else {

      this._superAdmin = false
    }
    this._innerHeight = window.innerHeight + 'px';
    this._innerWidth = window.innerWidth + 'px';
    this._activeTabIndex = 0;
    this._formSubmitAttempt = false;
    this._newUser = this.newUserService.initializeObject();
    this._form = this.formBuilder.group({
      clientId: [{ value: null, disabled: false }, [Validators.required]],
      companyId: [{ value: null, disabled: false }, [Validators.required]],
      firstName: [{ value: null, disabled: false }, [Validators.required]],
      lastName: [{ value: null, disabled: false }, [Validators.required]],
      phone: [{ value: null, disabled: false }, [Validators.required, UIValidationService.phoneNumberValidator]],
      email: [{ value: null, disabled: false }, [Validators.required, UIValidationService.emailValidator]],
      typeId: [{ value: null, disabled: false }, [Validators.required]],
      userGroupId: [{ value: null, disabled: false }, [Validators.required]],
      //loginId: [{ value: null, disabled: false }, [Validators.required]],
      password: [{ value: null, disabled: false }, [Validators.required]],
      confirmPassword: [{ value: null, disabled: false }, [Validators.required]],
    });

    this._routeSubscribe = this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.id = params['id'];
        this.screen = params['screen'];
        this._newUserId = params['newUserId'];
        this._page = params['page'];
        this._pageSize = params['pageSize'];
        this._keyword = params['keyword'];
        this._clientId = params['clientId'];
        this._requestStatusId = params['requestStatusId'];
        this._companyId = params['companyId'];
        this._objectId = this.id
      }
    });

    this._userTypeId = Number(this.currentUserService.getUserTypeId())

    if (this._userTypeId == 1 || this._userTypeId == 2 || this._userTypeId == 0) {
      this._clientEditAccess = true

      // this._form.get('clients').setValidators([Validators.required]);
      // this._form.get('clients').updateValueAndValidity()
      //this._form.get('eventCardTypeId').setValidators([Validators.required]);
      //this._form.get('eventCardTypeId').updateValueAndValidity()
    }

    if (this._userTypeId == 4 || this._userTypeId == 5) {
      this.requestType = 2
      this._clientEditAccess = false
    }

    if (this._userTypeId == 6 || this._userTypeId == 7) {
      this.requestType = 1
      this._clientEditAccess = false
    }

    this.subscription = this.newUserService.currentList.subscribe()


    if (this.id != undefined) this.get(this.id);


    // if (this.id != undefined) this.get(this.id);
    if (this.screen == "view") {
      this._pageTitle = 'View Client';
      this.view();
    }
    if (this.screen == "create") {
      this._pageTitle = 'New Client';
      this.new();
    }
    if (this.screen == "edit") {
      this._pageTitle = 'Edit Client';
      this.edit();
    }

    this.subscription = this.newUserService.currentList.subscribe()

    if (!this._superAdmin) {
      this._form.patchValue({ clientId: this._clientId })
    }

    this.getClientSelectList();
  }

  ngAfterViewInit() {

    console.log("this.screen", this.screen)


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get newUser() {
    return this._newUser;
  }
  set newUser(value: any) {
    this.newUser = value;
  }

  view() {

    this._formAction = FormActions.View;
    this._focusedList = this._listTypeEnum.Non;
    this._form.disable();
    this._disabled = true;
    this.get(this.id);
  }

  edit() {

    this._formAction = FormActions.Edit;
    this._editButtonDisabled = true;

    this._focusedList = this._listTypeEnum.Non;
    this._disabled = false;
    this.get(this.id);
    this._form.enable();

  }

  new() {

    this._formAction = FormActions.Create;
    this._form.enable();
    this._editButtonDisabled = true;

    this._form.patchValue({
      recordStatusId: 1,
      recordStatus: this._recordStatus.find(
        (t) => t.value === 1
      ),
      recordStatusDisplayName: this._recordStatus.find(
        (t) => t.value === 1
      )?.label,
    });

    this._formAction = FormActions.Create
    this._disabled = false;
  }

  reset() {

    if (this.newUser?.id != null) {
      this.get(this.newUser?.id);
    } else {
      this.ngOnInit();
      this.new();
    }
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  onTabIndexChange(event: any) {}

  

  get(id: number): void {
    this.newUserService
      .getById(id)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response) => {
          this.onRetrieved(response);
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  

  resetForm() {
    this._form.reset();
    this._form.patchValue({
    recordStatusId: null,
    //   id: null,
    //   code: null,
    //   description: null,
     });
  }

  // onListSelect(event) {
  //   switch (this._focusedList) {
  //     case this._listTypeEnum.RecordStatus: {
  //       this._form.patchValue({
  //         recordStatusId: event.option?.value,
  //         recordStatus: event.option,
  //         recordStatusDisplayName: event.option?.label,
  //       });
  //       setTimeout(() => {
  //         this._clientEmailElementRef.nativeElement.focus();
  //       }, 100);
  //       break;
  //     }
  //   }
  // }

  onRetrieved(data: any) {
    if (this._form) {
      this.resetForm();
      this._listTypeEnum.Non;
    }

    this._newUser = JSON.parse(JSON.stringify(data || null));

    console.log("this._event", this._newUser)

    this._form.patchValue({
      recordStatusId: this._newUser?.recordStatusId,
      id: this._newUser?.id,

      firstName: this._newUser?.firstName,
      lastName: this._newUser?.lastName,
      phone: this._newUser?.phone,
      email: this._newUser?.email,
      password: this._newUser?.password,
      confirmPassword: this._newUser?.password,
      typeId: this._newUser?.typeId,
      userGroupId: this._newUser?.userGroupId,
      clientId: this._newUser?.clientId, 
      companyId: this._newUser?.companyId,


      //insurance: this._client?.insurance,
    });


  }

  get eventType() {
    return this._newUser;
  }
  set eventType(value: any) {
    this._newUser = value;
  }

  save() {
    this._formSubmitAttempt = true;
    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }


    this.onSave()
      .pipe(
        finalize(() => {
          // this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          if (this.screen == "create") {
            this.uiMessageService.success('Record successfully Created');
          }
          if (this.screen == "edit") {
            this.uiMessageService.success('Record successfully Modified');
          }
          this._justUpdated = true;

          this._form.patchValue({
            rowVersion: response.rowVersion,
            id: response.id,
            recordStatusId: response.recordStatusId
          })
          this.newUserService.updateList();
          this.modalViewComponent.closeModal();

          // this.uiMessageService.success('Record successfully Modified');

          //   this.modalViewComponent.closeModal();
          //   if (this._form) {
          //     this.modalViewComponent.closeModal();
          //   this.newUserService.updateList();
          // }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSave(): Observable<INewUsers> {
    let saveObject = Object.assign(
      {},
      this._newUser,
      this._form.getRawValue()
    );

    if (!this._superAdmin) {

      saveObject.clientId = this._clientId
    }
    saveObject.loginId = saveObject.email

    console.log(saveObject)
    return this.newUserService.save(saveObject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        // this.spinner.hide(this._spinner);
        return throwError(error);
      })
    );
  }

  getClientSelectList() {
    this.clientsService
      .getSelectList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {

          // let res = response
          // res.unshift({id:null,name:' '})
          this.clientList = response

          if(response.length>0){
            this.getCompanyListByClient(this.clientList[0].id);
          // this._form.patchValue({clientId:response[0].id})
        }
          console.log("getSelectList", response)
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }
  
  onChangeClient(event){
    this.getCompanyListByClient(event.value);
  }

  getCompanyListByClient(clientId){
    this.companyInformationService
      .getCompanyListByClient(clientId)
      .pipe(
        finalize(() => {
          // this.spinner.hide(this._spinner);

          // this._form.patchValue({
          //   companyInformationId : 39
          // })
                  
       
        })
      )
      .subscribe(
        (response) => {
          console.log("getCompanyListByUserTypeAndClient", response);
          this._companyInformationList  = null

          this._companyInformationList  = response


          if(this._companyInformationList.length>0){
            this.requestType =  this._companyInformationList[0].typeId
          }
 
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }  
  validateAllFormFields(formGroup: UntypedFormGroup) {
    this._formSubmitAttempt = true;
    Object.keys(formGroup.controls).forEach((field) => {
      let control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  close() {

    if (this._justUpdated == true) {
      this._justUpdated = false
      this.modalViewComponent.closeModal();
    }
    // console.log("hhhhh",this._form.get("recordStatusId"));
    // if(this._form.get("recordStatusId").value == this){

    // }

    console.log();
    if (this._form.dirty == true) {
      this.confirmationService.confirm({
        key: 'editNewUserConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
          this.modalViewComponent.closeModal();
        },
      });
    } else {
      this.modalViewComponent.closeModal();
    }
  }



}
