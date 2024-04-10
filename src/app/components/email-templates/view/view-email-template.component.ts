import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { UIMessageService } from '../../../shared/services';
import { IEmailTemplate, RecordStatusList } from "../email-templates.model";
import { EmailTemplateService } from "../email-template.service";
import { ModalViewLayoutComponent } from 'src/app/containers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aeliusmd-view-email-template',
  templateUrl: './view-email-template.component.html',
  styleUrls: [
    './view-email-template.component.css',
    './view-email-template.component.scss',
  ],
})
export class ViewEmailTemplateComponent implements OnInit {
  _form: UntypedFormGroup;
  _emaiTemplate: IEmailTemplate;

  _recordStatus = RecordStatusList;

  @Input() id: number;
  @Output() viewModifierModalCloseEvent = new EventEmitter<object>();
  routeSub: any;

  _pageTitle: string = 'VIEW EMAIL TEMPLATE';
  _pageSubTitle: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private modalViewComponent: ModalViewLayoutComponent,
    private emailTemplateService: EmailTemplateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._form = this.formBuilder.group({
      recordStatusId: [{ value: null, disabled: true }],
      name: [{ value: null, disabled: true }],
      body: [{ value: null, disabled: true }],
    });

    this.routeSub = this.route.params.subscribe((params) => {
      //console.log('params', params);
      if (params != undefined) {
        //console.log(params['id']);
        this.id = params['id'];
      }
    });

    // this._form.disable();

    if (this.id != undefined) this.get(this.id);
  }

  get emaiTemplate() {
    return this._emaiTemplate;
  }
  set emaiTemplate(value: any) {
    this._emaiTemplate = value;
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
   // this._form.reset();
  }

  onRetrieved(data: any) {
    if (this._form) {
    //  this._form.reset();
    }

    this.emaiTemplate = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      recordStatusId: this.emaiTemplate.recordStatusId,
      name: this.emaiTemplate.name,
      body: this.emaiTemplate.body,
    });
  }

  close() {
    //this.viewModifierModalCloseEvent.emit();
    this.modalViewComponent.closeModal();
  }
}
