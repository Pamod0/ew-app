import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { UIMessageService, UIValidationService } from 'src/app/shared/services';
import {
  BillingDefaultList,
  UserTypeList,
  IUserProfile,YesNo, TelemedUserTypeList
} from '../user-profile.model';
import { UserProfileService } from '../user-profile.service';
import _ from 'lodash';
import { catchError, finalize, map } from 'rxjs/operators';
import { IUserGroupDropdown, UserGroupService } from '../../user-groups';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ArrayReverse, EnumToDropdown } from 'src/app/shared/utils';
import { ModalViewLayoutComponent } from 'src/app/containers';

export enum FormControls {
  Non,
  FirstName,
  LastName,
  Initials,
  Title,
  Email,
  Phone,
  Extension,
  Fax,
  UserGroup,
  LoginId,
  Password,
  PasswordVerify,
  Type,
}

@Component({
  selector: 'aeliusmd-create-user-profile',
  templateUrl: './create-user-profile.component.html',
  styleUrls: ['./create-user-profile.component.css'],
})
export class CreateUserProfileComponent implements OnInit {
  _pageTitle: string = 'CREATE USER PROFILE';
  _pageSubTitle: string = '';
  _routePath: string = 'userManagement/userProfile';
  _routeParametersSubscription: any;

  _form: FormGroup;
  // _spinner: string = 'createUserProfileSpinner';
  _userProfile: IUserProfile;
  _formSubmitAttempt: boolean = false;
  _focusedDropdown: any;
  _dropdownTypeEnum = FormControls;

  _userTypeList = UserTypeList

  _billingDefaultList = BillingDefaultList;
  _userGroupDropdownList: IUserGroupDropdown[] = [];

  @Output() userProfileCreatedEvent = new EventEmitter<object>();
  @Output() userProfileCreateCloseEvent = new EventEmitter<object>();

  @ViewChild('firstName', { static: false })
  _firstNameElementRef: ElementRef;

  constructor(
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private uiMessageService: UIMessageService,
    private userProfileService: UserProfileService,
    private userGroupService: UserGroupService,
    private modalViewComponent: ModalViewLayoutComponent,
  ) {}

  ngOnInit(): void {

    this._form = this.formBuilder.group({
      firstName: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(50)],
      ],
      initials: [{ value: null, disabled: false }, Validators.maxLength(10)],
      title: [{ value: null, disabled: false }, Validators.maxLength(100)],
     
      email: [{ value: null, disabled: false } ,[UIValidationService.emailValidator, Validators.maxLength(100)]],
      phone: [{ value: null, disabled: false }, Validators.maxLength(20)],
      extension: [{ value: null, disabled: false },[UIValidationService.numericValidator, Validators.maxLength(10)]],
      fax: [{ value: null, disabled: false }, Validators.maxLength(20)],

      userGroupId: [{ value: null, disabled: false }, [Validators.required]],

      loginId: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(100)]],
      password: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(100)]],
      confirmPassword: [{ value: null, disabled: false }, [Validators.required, UIValidationService.mustMatch]],
      typeId: [{ value: null, disabled: false }],

    });
    

    this.getUserGroupDropdownList();
    
    setTimeout(() => {
      this._firstNameElementRef.nativeElement.focus();
    }, 100);
    
  }

  getUserGroupDropdownList() {
    // this.spinner.show(this._spinner);
    this.userGroupService
      .getDropdownList()
      .pipe(
        finalize(() => {
          // this.spinner.hide(this._spinner);
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

  onRetrieved(data: any) {
    this._userProfile = JSON.parse(JSON.stringify(data || null));
    this._form.patchValue({
      id: this._userProfile.id,
    });
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

  save() {
    if (!this._form.valid) {
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }

    // this.spinner.show(this._spinner);

    this.onSave()
      .pipe(
        finalize(() => {
          // this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this.uiMessageService.success('Record successfully Updated');
         // this.userProfileCreatedEvent.emit(response);
          this.modalViewComponent.closeModal();
          if (this._form) {
            this._form.reset();
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  get userProfile() {
    return this._userProfile;
  }
  set userProfile(value: any) {
    this._userProfile = value;
  }

  onSave(): Observable<IUserProfile> {
    // this.spinner.show(this._spinner);
    let saveObject = Object.assign({}, this._userProfile, this._form.value);

    console.log(saveObject);

    return this.userProfileService.save(saveObject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        // this.spinner.hide(this._spinner);
        return throwError(error);
      })
    );
  }

  close() {
    if (this._form.dirty == true) {
      this.confirmationService.confirm({
        key: 'createUserProfileConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
        //  this.userProfileCreatedEvent.emit();
          this.modalViewComponent.closeModal();
        },
      });
    } else {
      //this.userProfileCreateCloseEvent.emit();
          this.modalViewComponent.closeModal();
    }
  }
}
