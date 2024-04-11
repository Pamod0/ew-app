import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { finalize, map, catchError } from 'rxjs/operators';
import _ from 'lodash';
import { UserGroupService } from '../user-group.service';
import {  
  UIMessageService,
} from '../../../shared/services';
import { IUserGroup } from '../user-group.model';
import { MultiSelectPolicyComponent } from '../../policies/multi-select-policy/multi-select-policy.component';
import { ModalViewLayoutComponent } from 'src/app/containers';
///import { ModalViewLayoutComponent } from 'src/app/containers';


export enum FormControls {
  Non,
  RecordStatus,
  Id,
  Code,
  Description,
  Policies,
}

@Component({
  selector: 'aeliusmd-create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: [
    './create-user-group.component.css',
    './create-user-group.component.scss',
  ],
})
export class CreateUserGroupComponent implements OnInit {
  _pageTitle: string = 'CREATE USER GROUP';
  _pageSubTitle: string = '';
  _routePath: string = 'administration/user-groups';

  _form: UntypedFormGroup;
  _userGroup: IUserGroup;
  _spinner: string = 'userGroupCreateSpinner';

  _focusedDropdown: any;
  _dropdownTypeEnum = FormControls;

  _formSubmitAttempt: boolean = false;
  _isPoliciesVisible: boolean = false;

  _policies: any[] = [];
  _tableColumns: any[] = [];

  _policyIds: number[] = [];
  _policyNames: string = '';
  _selectedPolicies: any[] = [];

  @Output() userGroupCreatedEvent = new EventEmitter<object>();
  @Output() userGroupCreateCloseEvent = new EventEmitter<object>();

  @ViewChild('userGroupCode', { static: false })
  _userGroupCodeElementRef: ElementRef;

  @ViewChild('userGroupDescription', { static: false })
  _userGroupDescriptionElementRef: ElementRef;

  @ViewChild('policiesMultiSelectComponent', { static: false })
  _policyMultiSelectComponentElementRef: MultiSelectPolicyComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,    
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private userGroupService: UserGroupService,    
    private uiMessageService: UIMessageService,
    private modalViewComponent: ModalViewLayoutComponent,
  ) {}
  ngOnInit() {

    this._formSubmitAttempt = false;

    this._form = this.formBuilder.group({
      code: [{ value: null, disabled: false }, [Validators.required,
        Validators.maxLength(3)]],
      description: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      policyIds:[{ value: null, disabled: false }, [Validators.required]],
    });

    setTimeout(() => {
      this._userGroupCodeElementRef.nativeElement.focus();
    }, 100);
  }

  get UserGroup() {
    return this._userGroup;
  }
  set UserGroup(value: any) {
    this._userGroup = value;
  }

  save() {

    this._formSubmitAttempt = true;
    
    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }

    this.spinner.show(this._spinner);

    this.onSave()
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this.uiMessageService.success('Record successfully created');
          // this.userGroupCreatedEvent.emit(response);
          this._policies =[]
          this._policyNames =""
          this._policyIds = []
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

  onSave(): Observable<IUserGroup> {
    let saveObject = Object.assign(
      {},
      this._userGroup,
      this._form.getRawValue()
    );
    saveObject.policyIds = this._policyIds;
    console.log(saveObject)
    return this.userGroupService.save(saveObject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        this.spinner.hide(this._spinner);
        return throwError(error);
      })
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
    if (this._form.dirty == true) {
      this.confirmationService.confirm({
        key: 'createUserGroupConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
          // this.userGroupCreatedEvent.emit();
          this.modalViewComponent.closeModal();
        },
      });
    } else {
      // this.userGroupCreateCloseEvent.emit();
      this.modalViewComponent.closeModal();
    }
  }

  onUserGroupDescriptionFocus() {
    this._focusedDropdown = this._dropdownTypeEnum.Description;
  }

  onUserGroupCodeFocus() {
    this._focusedDropdown = this._dropdownTypeEnum.Code;
  }

  policySelectEventHandler(event) {
    this._policies.push(event);
    this.updateLanguageIds();
    this._form.controls["policyIds"].clearValidators();
    this._form.controls['policyIds'].updateValueAndValidity()
  }

  policyUnSelectEventHandler(event) {
    _.remove(this._policies, event);
    this.updateLanguageIds();
    if(this._policies.length==0){
      this._form.controls["policyIds"].setValidators([Validators.required]);
      this._form.controls['policyIds'].updateValueAndValidity()
    }
  }

  updateLanguageIds() {
    this._policyIds = [];
    for (let c = 0; c < this._policies.length; c++) {
      this._policyNames += this._policies[c].name + ',' + '\n';
      this._policyIds.push(Number(this._policies[c].id));
    }
  }

  onPolicyAddClick($event) {
    this._isPoliciesVisible = true
    this._focusedDropdown = this._dropdownTypeEnum.Policies;
    setTimeout(() => {
      this._policyMultiSelectComponentElementRef?.ngOnInit();
    }, 100);
  }

  onClosePolicies(){
    this._isPoliciesVisible = false
  }
}
