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

import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import {
  UIValidationService,
  UIMessageService,
} from '../../../shared/services';
import { INewUsers, RecordStatusList } from '../new-user.model';
import { NewUserService } from '../new-user.service';
import { ModalViewLayoutComponent } from 'src/app/containers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aeliusmd-view-new-user',
  templateUrl: './view-new-user.component.html',
  styleUrls: [
    './view-new-user.component.css',
    './view-new-user.component.scss',
  ],
})
export class ViewNewUserComponent implements OnInit {
  _pageTitle: string = 'VIEW NEW USER';
  _pageSubTitle: string = '';
  _routePath: string = 'administration/newUsers';
  _routeSubscribe
  _form: UntypedFormGroup;
  _newUser: INewUsers;
  subscription: Subscription;

  _recordStatusList = RecordStatusList;
 
  _tableColumns: any[] = [];
 
  @Input() id: number;
  @Output() viewEventTypeModalCloseEvent = new EventEmitter<object>();
  newUsers

  constructor(
    private formBuilder: UntypedFormBuilder,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private newUserService: NewUserService,
    private modalViewComponent: ModalViewLayoutComponent,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      recordStatusId: [{ value: null, disabled: true }],
      client: [{ value: null, disabled: true }],
      company: [{ value: null, disabled: true }],
      firstName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      usersType: [{ value: null, disabled: true }],
      userGroup: [{ value: null, disabled: true }],
      //loginId: [{ value: null, disabled: false }],
      password: [{ value: null, disabled: true }],
      confirmPassword: [{ value: null, disabled: true }],
          
      id: [{ value: null, disabled: true }],
    });

    this._form.disable();

    this._routeSubscribe = this.route.params.subscribe((params) => {      
      if (params != undefined) {        
        this.id = params['id'];
      }
    });

    this.subscription = this.newUserService.currentList.subscribe()
   
    if (this.id != undefined) this.get(this.id);

  }

  get newUser() {
    return this._newUser;
  }
  set newUser(value: any) {
    this._newUser = value;
  }

  get(id: number): void {
    this.newUserService
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
    
    }

    this._newUser = JSON.parse(JSON.stringify(data || null));

    console.log(this._newUser);

    this._form.patchValue({
      
      id: this._newUser?.id,
      
      companyId: this._newUser?.companyId,
      firstName: this._newUser?.firstName,
      lastName: this._newUser?.lastName,
      clientId: this.newUser?.clientId,
      typeId: this.newUser?.typeId,
      email: this.newUser?.email,
      phone: this.newUser?.phone,
      password: this.newUser?.password,
      confirmPassword: this.newUser?.confirmPassword,
     // insurance: this._client?.insurance,
      
      recordStatusId: this._recordStatusList.find(
        (t) => t.value === this._newUser.recordStatusId
      ),
    });

  }

  close() {
       this.modalViewComponent.closeModal();
  }
}
