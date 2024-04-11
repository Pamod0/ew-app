/* #region angular imports */
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
/* #endregion */

/* #region 3rd party imports */
import { Message, MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import _ from "lodash";
import ticksToDate from "ticks-to-date";
import * as moment from "moment";
import { IMacroFields, RecordStatusList } from "../../macro-field.model";
import { RecordStatus } from "src/app/shared/enums";
import { EnumToDropdown } from "src/app/shared/utils";
import { UIMessageService } from "src/app/shared/services";
/* #endregion */

/* #region app imports */






export enum FormControls {
  Non,
  Parameters
}

/* #endregion */

@Component({
  selector: "aeliusmd-edit-parameters",
  templateUrl: "./edit-parameters.component.html",
  styleUrls: [
    "./edit-parameters.component.css",
    "./edit-parameters.component.scss",
  ],
})
export class EditMacroFieldParameterComponent implements OnInit, OnChanges {
  /* #region declarations */
  // _msgs: Message[] = [];
  _recordStatus = RecordStatus;
  _recordStatusDropdown = EnumToDropdown.transform(RecordStatus);
  _pageTitle: string = "Appointment Resource Shift";
  _pageSubTitle: string = "/ Edit";
  _routePath: string = "appointment/appointment-resource-shifts";
  _form: UntypedFormGroup;
  _routeParametersSubscription: any;
  _id: number = 0;
  _recordTitle: string = "";

  _spinner: string = 'create_appointment_resource_spinner';

  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;
  _formSubmitAttempt: boolean = false;

  _appointmentResource: any;
  _macroFieldParameters = {} as IMacroFields;
  _weekDay: any[] = [];
  _weekDayDropdown: any[] = [];
  _weekDayDropdownList: any[] = [];
  // _appointmentSetting: IAppointmentSetting;

  @Input() selectedLocationId: any;
  @Input() parameterList: any;
  @Output() macroFieldParameterEditedEventHandler = new EventEmitter<object>();


  _workingDaySplitList: any[] = []

  @ViewChild('parameter', { static: true })
  _parameter: ElementRef;

  @ViewChild('appointmentResourceStartTime', { static: true })
  _appointmentResourceStartTime: ElementRef;

  @ViewChild('appointmentResourceCloseTime', { static: true })
  _appointmentResourceCloseTime: ElementRef;

  /* #endregion */

  /* #region constructor */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private uiMessageService: UIMessageService,
    // private appointmentSettingService: AppointmentSettingService
  ) { }
  /* #endregion */

  /* #region lifecycle events */

  ngOnInit() {

    this._formSubmitAttempt = false;
    this._form = this.formBuilder.group({
      // id: [{ value: null, disabled: true }],
      recordStatusId: [{ value: null, disabled: false },],
      parameter: [{ value: null, disabled: false }],
    });




    setTimeout(() => {
      this._parameter.nativeElement.focus();
    }, 100);


  }

  ngOnChanges(changes) {

  }

  /* #endregion */

  /* #region events */

  /* #endregion */

  /* #region methods */


  reset() {
    if (this._form) {
      this._form.reset();
    }
  }

  get macroFieldParameters() {
    return this._macroFieldParameters;
  }
  set macroFieldParameters(value: any) {
    this._macroFieldParameters = value;
  }

  add() {

    this._formSubmitAttempt = true;
    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error("Form is not valid.");
      return;
    }

    this.onAdd();
  }

  onAdd() {

    let addObject = Object.assign(
      {},
      this._macroFieldParameters,
      this._form.value
    );

    addObject.id = 0;
    addObject.rowVersion = "";
    addObject.isDeleted = null;
    addObject.isNew = true;
    addObject.recordStatusId = 1;


    let hasParameter = false;

    this.parameterList.forEach(element => {
      if (element.parameter == addObject.parameter) {

        hasParameter = true;

      }
    });

    if (!hasParameter) {
      this.macroFieldParameterEditedEventHandler.emit(addObject);
      console.log('ggggg', addObject);
    }
    else {
      this.uiMessageService.error("The parameter is already added");
    }
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    this._formSubmitAttempt = true;
    Object.keys(formGroup.controls).forEach((field) => {
      //////console.log(field);
      let control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }

    });
  }


  onListSelect(event: any) {
    switch (this._focusedList) {
      case this._listTypeEnum.Parameters: {
        this._form.patchValue({
          workingDayId: event.option?.value,
          parameter: event.option,
          parameterDisplayName: event.option?.label
        });
        setTimeout(() => {
          this._appointmentResourceStartTime.nativeElement.focus();
        }, 100);
        break
      }
    }
  }

  onWorkDayFocus() {
    this._focusedList = this._listTypeEnum.Parameters;
  }

  onWorkDayChange() {
    this._form.patchValue({
      workingDayId: null,
      workingDay: null,
      workingDaysDisplayName: null,
    });

  }

  close() {
    if (this._form.dirty == true) {
      this.confirmationService.confirm({
        key: 'addAppointmentResourceShiftConfirmDialog',
        message:
          'WARNING: You have unsaved changes. do you want to save these changes?',
        accept: () => {
          this.add();
        },
        reject: () => {
          this.macroFieldParameterEditedEventHandler.emit();
        },
      });
    } else {
      this.macroFieldParameterEditedEventHandler.emit();
    }
  }









  /* #endregion */
}
