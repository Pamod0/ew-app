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
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { ModalViewLayoutComponent } from 'src/app/containers';
import { UIMessageService, UIValidationService } from '../../../shared/services';
import { INewUsers } from '../new-user.model';
import { NewUserService } from '../new-user.service';
import _ from 'lodash';
@Component({
  selector: 'picvs-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: [
    './create-new-user.component.css',
    './create-new-user.component.scss',
  ],
})
export class CreateNewUserComponent implements OnInit {
  _form: UntypedFormGroup;

  _formSubmitAttempt: boolean = false;


  @Output() newUserCreatedEvent = new EventEmitter<object>();
  @Output() newUserCreateCloseEvent = new EventEmitter<object>();
  @Input() _fromCase: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private newUsersService: NewUserService,
    private modalViewComponent: ModalViewLayoutComponent
  ) { }

  ngOnInit() {
    this._formSubmitAttempt = false;

    this._form = this.formBuilder.group({
      client: [{ value: null, disabled: false }, [Validators.required]],
      company: [{ value: null, disabled: false }, [Validators.required]],
      firstName: [{ value: null, disabled: false }, [Validators.required]],
      lastName: [{ value: null, disabled: false }, [Validators.required]],
      phone: [{ value: null, disabled: false }, [Validators.required, UIValidationService.phoneNumberValidator]],
      email: [{ value: null, disabled: false },[Validators.required, UIValidationService.emailValidator]],
      usersType: [{ value: null, disabled: false }, [Validators.required]],
      userGroup: [{ value: null, disabled: false }, [Validators.required]],
      //loginId: [{ value: null, disabled: false }, [Validators.required]],
      password: [{ value: null, disabled: false }, [Validators.required]],
      confirmPassword: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  save() {
    this._formSubmitAttempt = true;

    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }

    console.log(this._form.getRawValue());

    this.onSave()
      .pipe(finalize(() => { }))
      .subscribe(
        (response) => {
          this.uiMessageService.success('Record successfully created');

          console.log("response", response);
          if (this._fromCase == true) {
            this.newUserCreatedEvent.emit(response)
            this._fromCase = false
          }
          else {
            this.modalViewComponent.closeModal();
            this.newUsersService.updateList();
          }

          if (this._form) {
            this._form.reset();
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSave(): Observable<INewUsers> {
    let saveObject = this._form.getRawValue();

    return this.newUsersService.save(saveObject).pipe(
      map((response: any) => {

        return response;
      }),
      catchError((error) => {
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
        key: 'createClinetConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
          //this.modifierCreatedEvent.emit(); 
          if (this._fromCase == true) {
            this.newUserCreateCloseEvent.emit()
            this._fromCase = false
          } else {
            this.modalViewComponent.closeModal();
          }
        },
      });
    } else {
      //this.modifierCreateCloseEvent.emit();
      if (this._fromCase == true) {
        this.newUserCreateCloseEvent.emit()
        this._fromCase = false
      } else {
        this.modalViewComponent.closeModal();
      }
    }
  }
}
