import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Subscription, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { ModalViewLayoutComponent } from "src/app/containers";
import { UIMessageService } from "../../../shared/services";
import { IEmailTemplate, RecordStatusList } from "../email-templates.model";
import { EmailTemplateService } from "../email-template.service";
import { QuillModule } from "ngx-quill";
import { ActivatedRoute } from "@angular/router";

export enum FormControls {
  Non,
  RecordStatus,
  MacroFields
}

@Component({
  selector: 'aeliusmd-edit-email-template',
  templateUrl: './edit-email-template.component.html',
  styleUrls: [
    './edit-email-template.component.css',
    './edit-email-template.component.scss',
  ],
})
export class EditEmailTemplateComponent implements OnInit {
  _form: UntypedFormGroup;
  
  _pageTitle: string = 'EDIT EMAIL TEMPLATE';
  _pageSubTitle: string = '';

  _emailTemplate: IEmailTemplate;
  _recordStatus = RecordStatusList;
  _formSubmitAttempt: boolean = false;  
  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;

  @Input() id: number;
  @Output() modifierCreatedEvent = new EventEmitter<object>();
  @Output() modifierCreateCloseEvent = new EventEmitter<object>();

  @ViewChild('modifierCode', { static: false })
  _modifierCodeElementRef: ElementRef;

  text2: string;
  editorInstance: any;

  @ViewChild('editor') textEditor;

  _templateVisitTypes: any[] = [];

  routeSub: any;
  _keyword: any;

  message: string;
  subscription: Subscription;

  _isMacroFiledVisible: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private emailTemplateService: EmailTemplateService,
    private modalViewComponent: ModalViewLayoutComponent,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this._formSubmitAttempt = false;

    this._form = this.formBuilder.group({
      
      recordStatusId:  [{ value: null, disabled: false }, [Validators.required]],
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
      this._modifierCodeElementRef.nativeElement.focus();
    }, 100);

    this.routeSub = this.route.params.subscribe((params) => {
      console.log('params', params);
      if (params != undefined) {
        this.id = params['id'];
        this._keyword = params['keyword'];
      }
    });

    this.subscription = this.emailTemplateService.currentList.subscribe();

    if (this.id != undefined) this.get(this.id);
  }

  get emailTemplate() {
    return this._emailTemplate;
  }
  set emailTemplate(value: any) {
    this._emailTemplate = value;
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
          this.uiMessageService.success('Record successfully Updated');
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

  get(id: number): void {
    this.resetForm();
    this.emailTemplateService
      .getById(id)
      .pipe(
        finalize(() => {
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
  //  this._form.reset();
  }

  onRetrieved(data: any) {
    if (this._form) {
    //  this._form.reset();
    }

    let template = JSON.parse(JSON.stringify(data || null));
    this.emailTemplate = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      recordStatusId: this.emailTemplate?.recordStatusId,
      name: this.emailTemplate?.name,
      body: this.emailTemplate?.body,
    });
  }
  
  onCloseMacroFiled(){
    this._isMacroFiledVisible = false
  }
}