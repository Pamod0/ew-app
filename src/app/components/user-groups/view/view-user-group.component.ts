import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
// import { Location } from '@angular/common';
// import { MessageService } from 'primeng/api';
// import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { IUserGroup, RecordStatusList } from '../user-group.model';
import { UserGroupService } from '../user-group.service';
import { ModalViewLayoutComponent } from 'src/app/containers';

@Component({
  selector: 'aeliusmd-view-user-group',
  templateUrl: './view-user-group.component.html',
  styleUrls: [
    './view-user-group.component.css',
    './view-user-group.component.scss',
  ],
})
export class ViewUserGroupComponent implements OnInit {
  _pageTitle: string = 'VIEW USER GROUP';
  _pageSubTitle: string = '';
  _routePath: string = 'administration/user-groups';
  _routeSubscribe
  _form: UntypedFormGroup;
  _userGroup: IUserGroup;
  // _spinner: string = 'userGroupViewSpinner';

  _recordStatusList = RecordStatusList;
  _policies: any[] = [];
  _tableColumns: any[] = [];
  _policyIds: number[] = [];
  // _policyNames: string = '';

  @Input() id: number;
  @Output() viewUserGroupModalCloseEvent = new EventEmitter<object>();
 

  constructor(
    private formBuilder: UntypedFormBuilder,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private userGroupService: UserGroupService,
    private modalViewComponent: ModalViewLayoutComponent,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      recordStatusId: [{ value: null, disabled: true }],
      id: [{ value: null, disabled: true }],
      code: [{ value: null, disabled: true }],
      description: [{ value: null, disabled: true }],
      policyIds: [{ value: null, disabled: true }],
      policy: [{ value: null, disabled: true }],
    });

    this._form.disable();

    this._routeSubscribe = this.route.params.subscribe((params) => {      
      if (params != undefined) {        
        this.id = params['id'];
      }
    });

    if (this.id != undefined) this.get(this.id);

  }

  get userGroup() {
    return this._userGroup;
  }
  set userGroup(value: any) {
    this._userGroup = value;
  }

  get(id: number): void {
    this.userGroupService
      .getById(id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
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

  onRetrieved(data: any) {
    if (this._form) {
      this._form.reset();
      this._policyIds = [];
      this._policies = [];
    }

    this._userGroup = JSON.parse(JSON.stringify(data || null));

    console.log(this._userGroup);

    this._form.patchValue({
      id: this._userGroup.id,
      code: this._userGroup.code,
      description: this._userGroup.description,
      recordStatusId: this._recordStatusList.find(
        (t) => t.value === this._userGroup.recordStatusId
      ),
    });

    this._policyIds = this._userGroup.policyIds;
    this.userGroup.userGroupPolicies.forEach((policy) => {
      this._policies.push({
        id: policy.policyId,
        name: policy.policy.name,
      });
    });
  }

  close() {
    //this.viewUserGroupModalCloseEvent.emit();
    this.modalViewComponent.closeModal();
  }
}
