import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { UIMessageService, UIValidationService } from 'src/app/shared/services';
import { IUserGroupDropdown, UserGroupService } from '../../user-groups';
import {
  IUserProfile,
  UserTypeList,
  BillingDefaultList,
  YesNo,
  RecordStatusList,
  TelemedUserTypeList,
} from '../user-profile.model';
import _ from 'lodash';
import { UserProfileService } from '../user-profile.service';
import { ModalViewLayoutComponent } from 'src/app/containers';
import { ActivatedRoute } from '@angular/router';
('../user-profile.service');

@Component({
  selector: 'aeliusmd-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements OnInit {
  _pageTitle: string = 'Edit User Profile';
  _pageSubTitle: string = '';
  _routePath: string = 'userManagement/userProfile';
  _routeSubscribe: any;

  _form: FormGroup;
  // _spinner: string = 'editUserProfileSpinner';
  _userProfile: IUserProfile;
  _formSubmitAttempt: boolean = false;
  _focusedDropdown: any;
  _userTypeList = UserTypeList;

  _userGroupDropdownList: IUserGroupDropdown[] = [];
  _recordStatus = RecordStatusList;

  @Input() id: number;
  @Output() userProfileEditedEvent = new EventEmitter<object>();
  @Output() userProfileEditCloseEvent = new EventEmitter<object>();

  @ViewChild('recordStatusId', { static: false })
  _recordStatusIdElementRef: ElementRef;

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

      email: [
        { value: null, disabled: false },
        [UIValidationService.emailValidator, Validators.maxLength(100)],
      ],
      phone: [{ value: null, disabled: false }, Validators.maxLength(20)],
      extension: [
        { value: null, disabled: false },
        [UIValidationService.numericValidator, Validators.maxLength(4)],
      ],
      fax: [{ value: null, disabled: false }, Validators.maxLength(20)],

      userGroupId: [{ value: null, disabled: false }, [Validators.required]],

      loginId: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(20)],
      ],
      password: [
        { value: null, disabled: false },
        [Validators.required, Validators.maxLength(50)],
      ],
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
          console.log(this._userGroupDropdownList);
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
    // this.spinner.show(this._spinner);

    this.userProfileService
      .getById(id)
      .pipe(
        finalize(() => {
          // this.spinner.hide(this._spinner);
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
    // this._form.reset();
  }

  onRetrieved(data: any) {
    if (this._form) {
      //this._form.reset();
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

  save() {
    this._formSubmitAttempt = true;

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
          // this.userProfileEditedEvent.emit(response);
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
        key: 'editUserProfileConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
          // this.userProfileEditedEvent.emit();
          this.modalViewComponent.closeModal();
        },
      });
    } else {
      // this.userProfileEditCloseEvent.emit();
      this.modalViewComponent.closeModal();
    }
  }
}
