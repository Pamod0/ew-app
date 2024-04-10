import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { ModalViewLayoutComponent } from "src/app/containers";
import { UIMessageService } from "../../../shared/services";
import { IEmailTemplate } from "../email-templates.model";
import { EmailTemplateService } from "../email-template.service";
import { QuillModule } from "ngx-quill";

export enum FormControls {
  Non,
  MacroFields
}

@Component({
  selector: 'aeliusmd-create-email-template',
  templateUrl: './create-email-template.component.html',
  styleUrls: [
    './create-email-template.component.css',
    './create-email-template.component.scss',
  ],
})
export class CreateEmailTemplateComponent implements OnInit {
  _form: UntypedFormGroup;
  _emailTemplate: IEmailTemplate;
  _pageTitle: string = 'CREATE EMAIL TEMPLATE';
  _pageSubTitle: string = '';

  _formSubmitAttempt: boolean = false;  
  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;

  @Output() modifierCreatedEvent = new EventEmitter<object>();
  @Output() modifierCreateCloseEvent = new EventEmitter<object>();

  @ViewChild('name', { static: false })
  _nameElementRef: ElementRef;

  text2: string;
  editorInstance: any;
  _isMacroFiledVisible: boolean = false;

  @ViewChild('editor') textEditor;

  _templateVisitTypes: any[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private emailTemplateService: EmailTemplateService,
    private modalViewComponent: ModalViewLayoutComponent
  ) {}

  ngOnInit() {
    this._formSubmitAttempt = false;

    this._form = this.formBuilder.group({
      name: [
        { value: null, disabled: false },
        [Validators.required],
      ],

      body: [
        { value: null, disabled: false },
        [Validators.required],
      ],
    });

    setTimeout(() => {
      this._nameElementRef.nativeElement.focus();
    }, 100);
  }

  created(editorInstance) {
    this.editorInstance = editorInstance;
  }

  getMacroFields() {
    this._isMacroFiledVisible = true

    if(this._focusedList == this._listTypeEnum.MacroFields){
      this._focusedList = this._listTypeEnum.Non;
      return;
    }
    this._focusedList = this._listTypeEnum.MacroFields;
  }

  macroFiledSelectEventHandler($event) {
    console.log($event);

    let _quill = this.textEditor.getQuill();

    let _inputFiled = '{{' + $event.name + '}}';

    var selection = _quill.getSelection(true);
    _quill.insertText(selection.index, _inputFiled);
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
      .pipe(finalize(() => {}))
      .subscribe(
        (response) => {
          this.uiMessageService.success('Record successfully created');
          this.modalViewComponent.closeModal();
          this.emailTemplateService.updateList();
          if (this._form) {
            this._form.reset();
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSave(): Observable<IEmailTemplate> {
    let saveObject = Object.assign({}, this._emailTemplate, this._form.getRawValue());

    return this.emailTemplateService.save(saveObject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );

    return null;
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
        key: 'createModifierConfirmDialog',
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
  
  onCloseMacroFiled(){
    this._isMacroFiledVisible = false
  }
}