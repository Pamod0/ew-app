import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { Observable, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { UIMessageService, UIValidationService } from 'src/app/shared/services';
import { ArrayReverse, EnumToDropdown } from 'src/app/shared/utils';
import { IUserGroupDropdown, UserGroupService } from '../../user-groups';
import { IUserProfile, UserTypeList, BillingDefaultList, YesNo, RecordStatusList, TelemedUserTypeList } from '../user-profile.model';
import _ from 'lodash'; import { UserProfileService } from '../user-profile.service';
import { ModalViewLayoutComponent } from 'src/app/containers';
import { ActivatedRoute } from '@angular/router';
'../user-profile.service';


@Component({
  selector: 'aeliusmd-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css'],
})
export class ViewUserProfileComponent implements OnInit {

  _pageTitle: string = 'View User Profile';
  _pageSubTitle: string = '';
  _routePath: string = 'userManagement/userProfile';
  _routeParametersSubscription: any;

  _form: FormGroup;
  _spinner: string = 'viewUserProfileSpinner';
  _userProfile: IUserProfile;
  _activeTabIndex: number = 0;
  _formSubmitAttempt: boolean = false;
  _focusedDropdown: any;
  _routeSubscribe: any;

  _userGroupDropdownList: IUserGroupDropdown[] = [];
  _recordStatus = RecordStatusList;
  _userTypeList = UserTypeList


  @Input() id: number;
  @Output() userProfileViewCloseEvent = new EventEmitter<object>();

  constructor(
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private uiMessageService: UIMessageService,
    private userProfileService: UserProfileService,
    private userGroupService: UserGroupService,
    private modalViewComponent: ModalViewLayoutComponent
  ) { }

  ngOnInit(): void {

    this._activeTabIndex = 0;

    this._userProfile = this.userProfileService.initializeObject();

    this._form = this.formBuilder.group({
      recordStatusId: [{ value: null, disabled: false }, [Validators.required]],

      firstName: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(50)],
      ],
      initials: [{ value: null, disabled: false }, Validators.maxLength(10)],
      title: [{ value: null, disabled: false }, Validators.maxLength(30)],

      email: [{ value: null, disabled: false }, [UIValidationService.emailValidator, Validators.maxLength(100)]],
      phone: [{ value: null, disabled: false }, Validators.maxLength(20)],
      extension: [{ value: null, disabled: false }, [UIValidationService.numericValidator, Validators.maxLength(4)]],
      fax: [{ value: null, disabled: false }, Validators.maxLength(20)],

      userGroupId: [{ value: null, disabled: false }, [Validators.required]],

      loginId: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(20)]],
      password: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(50)]],
      confirmPassword: [
        { value: null, disabled: false },
        [Validators.required, UIValidationService.mustMatch],
      ],
      typeId: [{ value: null, disabled: false }],

    });

    this._routeSubscribe = this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.id = params['id'];
      }
    });

    if (this.id != undefined) this.get(this.id);

    this.getUserGroupDropdownList();
  }

  getUserGroupDropdownList() {
    this.spinner.show(this._spinner);
    this.userGroupService
      .getDropdownList()
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this._userGroupDropdownList = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  validateAllFormFields(formGroup: FormGroup) {
    this._formSubmitAttempt = true;

    Object.keys(formGroup.controls).forEach((field) => {
      let control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get userProfile() {
    return this._userProfile;
  }
  set userProfile(value: any) {
    this._userProfile = value;
  }

  get(id: number): void {
    this.resetForm();
    this.spinner.show(this._spinner);

    this.userProfileService
      .getById(id)
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
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
  }


  onRetrieved(data: any) {
    if (this._form) {
      this._form.reset();
    }

    this.userProfile = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      id: this.userProfile.id,
      recordStatusId: this.userProfile?.recordStatusId,

      firstName: this.userProfile?.firstName,
      lastName: this.userProfile?.lastName,
      initials: this.userProfile?.initials,
      title: this.userProfile?.title,

      email: this.userProfile?.email,
      phone: this.userProfile?.phone,
      extension: this.userProfile?.extension,
      fax: this.userProfile?.fax,

      userGroupId: this.userProfile?.userGroupId,

      loginId: this.userProfile?.loginId,
      password: this.userProfile?.password,
      confirmPassword: this.userProfile?.password,
      typeId: this.userProfile?.typeId,
    });


  }
  close() {
    // this.userProfileViewCloseEvent.emit();
    this.modalViewComponent.closeModal();
  }
}
