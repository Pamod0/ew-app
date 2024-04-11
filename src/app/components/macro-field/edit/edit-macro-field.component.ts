import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Subscription, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { ModalViewLayoutComponent } from "src/app/containers";
import { UIMessageService } from "../../../shared/services";
import { IMacroFields, RecordStatusList } from "../macro-field.model";
import { MacroFieldService } from "../macro-field.service";
import { AddMacroFieldParameterComponent } from "../_sub/add/add-parameters.component";
import { IMacroFieldParameter } from "../_sub/parameter.model";
import _ from 'lodash';
import { ActivatedRoute } from "@angular/router";

export enum FormControls {
  Non,
  RecordStatus,
  Name,
}
@Component({
  selector: 'aeliusmd-create-macro-field',
  templateUrl: './edit-macro-field.component.html',
  styleUrls: [
    './edit-macro-field.component.css',
    './edit-macro-field.component.scss',
  ],
})

export class EditMacroFieldComponent implements OnInit {

  _form: UntypedFormGroup;
  _spinner: string = 'createMacroFiledSpinner';
  _macroField: IMacroFields;
  _macroFieldParameter: IMacroFieldParameter;

  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;
  _recordStatus = RecordStatusList;

  _formSubmitAttempt: boolean = false;
  _macroFieldParameterAddDialog: boolean = false;
  _macroFieldParameterEditDialog: boolean = false;

  routeSub: any;
  _keyword: any;

  message: string;
  subscription: Subscription;
  _parameterList: any[]=[];

  @Input() id: number;
  @Output() modifierCreatedEvent = new EventEmitter<object>();
  @Output() modifierCreateCloseEvent = new EventEmitter<object>();

  @ViewChild('macroFieldName', { static: false })
  _macroFieldElementRef: ElementRef;

  @ViewChild('id_parameter_add', {static: false})
  _addParameterComponent: AddMacroFieldParameterComponent;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private macroFieldService: MacroFieldService,
    private modalViewComponent: ModalViewLayoutComponent,

  ) { }

  ngOnInit() {

    this._macroField = this.macroFieldService.initializeObject();

    this._formSubmitAttempt = false;

    this._form = this.formBuilder.group({

      recordStatusId: [{ value: null, disabled: false }, [Validators.required]],

      name: [{ value: null, disabled: false },
      [
        Validators.required, Validators.maxLength(50)
      ]
      ],
      description: [{ value: null, disabled: false },
      [
        Validators.required, Validators.maxLength(200)
      ]
      ],

      query: [{ value: null, disabled: false },
      [
        Validators.required,
      ]
      ]

    })

    this.routeSub = this.route.params.subscribe((params) => {
      //console.log('params', params);
      if (params != undefined) {
        //console.log(params['id']);
        this.id = params['id'];
        this._keyword = params['keyword'];
        console.log(this._keyword)
      }
    })

    this.subscription = this.macroFieldService.currentList.subscribe()

    if (this.id != undefined) this.get(this.id);
    // setTimeout(() => {
    //   this._macroFieldElementRef.nativeElement.focus();
    // }, 100);

  }

  get macroField() {
    return this._macroField;
  }

  set macroField(value: any) {
    this._macroField = value;
  }

  save() {
    this._formSubmitAttempt = true;

    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }
    if (!this._form.dirty) {
      this.uiMessageService.information('No Changes found.');
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
          this.modalViewComponent.closeModal();
          this.macroFieldService.updateList();
          if (this._form) {
            this._form.reset();
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSave(): Observable<IMacroFields> {
    let saveObject = Object.assign({}, this._macroField, this._form.getRawValue());

    return this.macroFieldService.save(saveObject).pipe(
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
        key: 'editMacroFieldConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.save();
        },
        reject: () => {
          //this.modifierCreatedEvent.emit();
          this.modalViewComponent.closeModal();
        },
      });
    } else {
      //this.modifierCreateCloseEvent.emit();
      this.modalViewComponent.closeModal();
    }
  }

  get(id: number): void {
    this.resetForm();
    this.spinner.show(this._spinner);

    this.macroFieldService
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
  onRetrieved(data: any) {
    if (this._form) {
      //this._form.reset();
    }

    this.macroField = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      recordStatusId: this.macroField?.recordStatusId,
      name: this.macroField?.name,
      description: this.macroField?.description,
      query: this.macroField?.query,
    });
  }

  resetForm() {
    //this._form.reset();
  }

}
