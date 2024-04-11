import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
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
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, throwError } from 'rxjs';
import { finalize, delay, map, tap, catchError } from 'rxjs/operators';
import _ from 'lodash';
import { UserGroupService } from '../user-group.service';
import {
  CurrentUserService,
  UIMessageService,
} from '../../../shared/services';
import { IUserGroup, RecordStatusList } from '../user-group.model';
import { MultiSelectPolicyComponent } from '../../policies/multi-select-policy/multi-select-policy.component';
import { ModalViewLayoutComponent } from 'src/app/containers';

export enum FormControls {
  Non,
  RecordStatus,
  Id,
  Code,
  Description,
  Policies,
}

@Component({
  selector: 'aeliusmd-edit-user-group',
  templateUrl: './edit-user-group.component.html',
  styleUrls: [
    './edit-user-group.component.css',
    './edit-user-group.component.scss',
  ],
})
export class EditUserGroupComponent implements OnInit {
  _pageTitle: string = 'EDIT USER GROUP';
  _pageSubTitle: string = '';
  _routePath: string = 'administration/user-groups';
  _routeSubscribe: any;
  _form: UntypedFormGroup;
  _userGroup: IUserGroup;
  // _spinner: string = 'editUserGroupSpinner';

  _recordStatus = RecordStatusList;
  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;

  _policies: any[] = [];
  _tableColumns: any[] = [];

  _policyIds: number[] = [];
  _policyNames: string = '';
  _selectedPolicies: any[] = [];
  _isPoliciesVisible: boolean = false;

  @Input() id: number;
  @Output() userGroupEditedEvent = new EventEmitter<object>();
  @Output() userGroupEditCloseEvent = new EventEmitter<object>();
  @Output() userGroupSearchEvent = new EventEmitter<object>();

  @ViewChild('recordStatus', { static: false })
  _recordStatusElementRef: ElementRef;

  @ViewChild('userGroupCode', { static: false })
  _userGroupCodeElementRef: ElementRef;

  @ViewChild('userGroupDescription', { static: false })
  _userGroupDescriptionElementRef: ElementRef;

  @ViewChild('policiesMultiSelectComponent', { static: false })
  _policyMultiSelectComponentElementRef: MultiSelectPolicyComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,    
    private messageService: MessageService,
    private confirmationService: ConfirmationService,    
    private userGroupService: UserGroupService,    
    private uiMessageService: UIMessageService,
    private modalViewComponent: ModalViewLayoutComponent,    
  ) {}

  ngOnInit() {
    this._userGroup = this.userGroupService.initializeObject();
    this._form = this.formBuilder.group({
      recordStatusId: [{ value: null, disabled: false },[Validators.required]],
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

    // if (this.id != undefined) this.get(this.id);

    this._routeSubscribe = this.route.params.subscribe((params) => {      
      if (params != undefined) {        
        this.id = params['id'];
      }
    });

    if (this.id != undefined) this.get(this.id);

    // setTimeout(() => {
    //   this._userGroupCodeElementRef.nativeElement.focus();
    // }, 100);

  }

  get(id: number): void {
   // this.resetForm();
    // this.spinner.show(this._spinner);

    this.userGroupService
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
    //this._form.reset();
    // this._form.patchValue({
    //   recordStatusId: null,
    //   id: null,
    //   code: null,
    //   description: null,
    // });
  }

  onRetrieved(data: any) {
    if (this._form) {
      this.resetForm();
      this._policyIds = [];
      this._policies = [];
      this._listTypeEnum.Non;
    }

    this._userGroup = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      recordStatusId: this._userGroup?.recordStatusId,
      id: this._userGroup?.id,
      code: this._userGroup?.code,
      description: this._userGroup?.description,
    });

    this._policyIds = this._userGroup.policyIds;
    this.UserGroup.userGroupPolicies.forEach((policy) => {
      this._policies.push({
        id: String(policy.policyId),
        name: policy.policy.name,
      });
    });
    this.updatePolicyIds();    
    this._form.controls["policyIds"].clearValidators();
    this._form.controls['policyIds'].updateValueAndValidity()
  }

  get UserGroup() {
    return this._userGroup;
  }
  set UserGroup(value: any) {
    this._userGroup = value;
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
          this.uiMessageService.success('Record successfully updated');
          // this.userGroupEditedEvent.emit(response);
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
        // this.spinner.hide(this._spinner);
        return throwError(error);
      })
    );
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
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
    console.log("hhhhh",this._form.get("recordStatusId"));
    if(this._form.get("recordStatusId").value == this){

    }

    console.log();
    if (this._form.dirty == true) {
      this.confirmationService.confirm({
        key: 'editUserGroupConfirmDialog',
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

  

  onRecordStatusFocus() {
    this._focusedList = this._listTypeEnum.RecordStatus;
  }

  onUserGroupDescriptionFocus() {
    this._focusedList = this._listTypeEnum.Description;
  }

  onUserGroupCodeFocus() {
    this._focusedList = this._listTypeEnum.Code;
  }

  policySelectEventHandler(event) {
    this._policies.push(event);
    this.updatePolicyIds();
    console.log('Add User Edit : ' + JSON.stringify(this._policies));
    console.log('Add User Edit : ' + JSON.stringify(event));
    // var index = this._policies.findIndex((x) => x.id == event.id);
    // if (index === -1) {
    //   this._policies.push(event);
    // }
    this._form.controls["policyIds"].clearValidators();
    this._form.controls['policyIds'].updateValueAndValidity()
  }

  policyUnSelectEventHandler(event) {
    _.remove(this._policies, event);
    this.updatePolicyIds();
    console.log('Remove User Edit : ' + JSON.stringify(this._policies));
    console.log('Remove User Edit : ' + JSON.stringify(event));
     if(this._policies.length==0){
      this._form.controls["policyIds"].setValidators([Validators.required]);
      this._form.controls['policyIds'].updateValueAndValidity()
    }
  }

  updatePolicyIds() {
    this._policyIds = [];
    for (let c = 0; c < this._policies.length; c++) {
      this._policyNames += this._policies[c].name + ',' + '\n';
      this._policyIds.push(Number(this._policies[c].id));
    }
  }

  onPolicyAddClick($event) {
    this._isPoliciesVisible = true
    this._focusedList = this._listTypeEnum.Policies;
    setTimeout(() => {
      this._policyMultiSelectComponentElementRef?.ngOnInit();
    }, 100);
  }
  
  onClosePolicies(){
    this._isPoliciesVisible = false
  }
}
