/* #region angular imports */
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
import { Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
/* #endregion */

/* #region 3rd party imports */
import { Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { finalize, delay, map, tap } from 'rxjs/operators';
import _ from 'lodash';
import ticksToDate from 'ticks-to-date';
import moment from 'moment';
/* #endregion */

/* #region app imports */
import {
  UIValidationService,
  UIMessageService,
} from '../../../../../../shared/services';
import { EnumToDropdown } from '../../../../../../shared/utils';
import {
  RecordStatus,
  SeverityLevel,
  PatientInsuranceType,
  PatientRelationships,
  PatientMet,
  PatientAppliesToOfficeVisit,
} from '../../../../../../shared/enums';
import { IPatientInsurance } from '../patient-insurance.model';

import { PatientService } from '../../../patient.service';
import { PatientInsuranceService } from '../patient-insurance.service';

import {
  ILocation,
  ILocationDropdown,
  LocationService,
} from '../../../../../clinic-management/locations';

/* #endregion */

@Component({
  selector: 'aeliusmd-view-patient-insurance',
  templateUrl: './view-patient-insurance.component.html',
  styleUrls: [
    './view-patient-insurance.component.css',
    './view-patient-insurance.component.scss',
  ],
})
export class ViewPatientInsuranceComponent implements OnInit {
  /* #region declarations */
  _recordStatus = EnumToDropdown.transform(RecordStatus);
  _pageTitle: string = 'Patient Insurance';
  _pageSubTitle: string = '/ View';
  _routePath: string = 'patient-management/patients';
  disabled: boolean = true;
  _form: FormGroup;
  _routeParametersSubscription: any;
  _id: number = 0;
  _tableColumns: any[];

  _optionsRelationships: any[];
  _optionsIsDeductibleMet: any[];
  _optionsIsCopayAppliesToOfficeVisit: any[];

  _insuranceDropdownList: any[] = [];

  _selectedOption: any = null;
  _selectedOption1: any = null;
  _selectedOption2: any = null;

  _filteredGuarantorList: any[];
  _filteredInsuranceList: any[];

  _value1: any = null;
  _value2: any = null;
  _value3: any = null;
  _value4: any = null;

  _patient: any;
  _insurance: any;

  _options: any[];
  _selectedGender: any = null;
  _optionsInsuranceType: any[];
  _stateGender: any[];
  _maritalStatus: any[];
  _preferredCommunication: any[];

  _recordTitle: string = '';
  _createPatient: any;

  _patientInsuranceType = PatientInsuranceType;
  _locationDropdownList: ILocationDropdown[] = [];

  _patientInsurance = {} as IPatientInsurance;

  @Input() selectedInsurance: any;
  @Input() patientInsuranceList: any;
  @Output() patientInsuranceViewEvent = new EventEmitter<object>();

  _patientInsuranceTypeDropDown =
    EnumToDropdown.transform(PatientInsuranceType);

  _relationshipsDropDown = EnumToDropdown.transform(PatientRelationships);

  _metDropDown = EnumToDropdown.transform(PatientMet);

  _appliesToOfficeVisitDropDown = EnumToDropdown.transform(
    PatientAppliesToOfficeVisit
  );

  /* #endregion */

  /* #region constructor */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private patientService: PatientService,
    private locationService: LocationService,
    private location: Location,
    private uiMessageService: UIMessageService,
    private patientInsuranceService: PatientInsuranceService
  ) {}
  /* #endregion */

  /* #region lifecycle events */

  ngOnInit() {
    this._form = this.formBuilder.group({
      patientInsuranceType: [{ value: '1', disabled: true }],
      selectedInsuranceType: [{ value: null, disabled: true }],
      schoolName: [{ value: null, disabled: true }],
      relation: [{ value: null, disabled: true }],
      selectedRelationship: [{ value: null, disabled: true }],
      guarantor: [{ value: null, disabled: true }],
      insurance: [{ value: null, disabled: true }],
      planName: [{ value: null, disabled: true }],
      memberNumber: [{ value: null, disabled: true }],
      groupNumber: [{ value: null, disabled: true }],
      effectiveDate: [{ value: null, disabled: true }],
      expiryDate: [{ value: null, disabled: true }],
      deductible: [{ value: null, disabled: true }],
      isDeductibleMet: [{ value: null, disabled: true }],
      selectedMet: [{ value: null, disabled: true }],
      coPay: [{ value: null, disabled: true }],
      isCopayAppliesToOfficeVisit: [{ value: null, disabled: true }],
      selectedAppliesToOfficeVisit: [{ value: null, disabled: true }],
      coverage: [{ value: null, disabled: true }],
    });

    /*  this._routeParametersSubscription = this.route.params.subscribe(
            (params) => {
                this._id = +params["id"];
                this.get(Number(this._id));

            }
        );
 */
    this._optionsIsDeductibleMet = [
      { label: 'Y', value: true },
      { label: 'N', value: false },
    ];

    this._optionsIsCopayAppliesToOfficeVisit = [
      { label: 'Y', value: true },
      { label: 'N', value: false },
    ];

    this._optionsInsuranceType = [
      { label: 'P', value: 1 },
      { label: 'S', value: 2 },
      { label: 'T', value: 3 },
    ];

    this._optionsRelationships = [
      { label: 'P', value: 1 },
      { label: 'S', value: 2 },
      { label: 'C', value: 3 },
      { label: 'O', value: 4 },
    ];

    this.getInsuranceDropdownList();
  }

  ngOnChanges(changes) {
    if (changes.selectedInsurance) {
      if (this.selectedInsurance != null)
        this.onRetrieved(this.selectedInsurance);
    }
  }

  /* #endregion */

  /* #region events */

  /* #endregion */

  /* #region methods */

  /*  reset() {
        if (this._form) {
            this._form.reset();
        }
    } */

  close() {
    //this.router.navigate([`dashboard`]);
    this.location.back();
  }

  /*  cancel() {
        this.router.navigate([`${this._routePath}/list`]);
    } */

  get patientInsurance() {
    return this._patientInsurance;
  }
  set patientInsurance(value: any) {
    this._patientInsurance = value;
  }

  getInsuranceDropdownList() {
    this.spinner.show();

    this.patientInsuranceService
      .getDropdownList()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._insuranceDropdownList = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  searchGuarantor(event) {
    // this.spinner.show();

    // need to add page and page size
    this.patientService
      .getSearchList(event.query)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._filteredGuarantorList = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onGuarantorSelected(event) {
    this.patientService
      .getById(event.id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._patient = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }
  searchInsurance(event) {
    // this.spinner.show();

    this.patientService
      .getSearchList(event.query)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._filteredInsuranceList = response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onInsuranceSelected(event) {
    this.patientService
      .getById(event.id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._insurance = response;
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

    this._patientInsurance = JSON.parse(JSON.stringify(data || null));

    this._form.patchValue({
      id: this._patientInsurance.id,

      patientInsuranceType: this._patientInsurance.patientInsuranceType,
      schoolName: this._patientInsurance.schoolName,
      relation: this._patientInsurance.relation,
      guarantor: this._patientInsurance.guarantor,
      insurance: this._patientInsurance.insurance,
      planName: this._patientInsurance.planName,
      memberNumber: this._patientInsurance.memberNumber,
      groupNumber: this._patientInsurance.groupNumber,
      effectiveDate: new Date(this._patientInsurance.effectiveDate),
      expiryDate: new Date(this._patientInsurance.expiryDate),
      deductible: this._patientInsurance.deductible,
      isDeductibleMet: this._patientInsurance.isDeductibleMet,
      coPay: this._patientInsurance.coPay,
      isCopayAppliesToOfficeVisit:
        this._patientInsurance.isCopayAppliesToOfficeVisit,
      coverage: this._patientInsurance.coverage,
    });
  }

  edit() {
    if (!this._form.valid) {
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit',
      accept: () => {
        this.onEdit();
      },
      reject: () => {
        //this.reEnableButton.emit(false);
      },
    });
  }

  onEdit() {
    let addObject = Object.assign({}, this._patientInsurance, this._form.value);

    // addObject.id = 0;
    // addObject.rowVersion = '';
    // addObject.isDeleted = null;
    // addObject.isNew = true;

    /*  let hasInsurance = false;

        if(!hasInsurance){
            this.patientInsuranceEditedEvent.emit(addObject);
        }
        else{
            this.uiMessageService.warning( "The Insurance is already added");
        } */

    this.patientInsuranceViewEvent.emit(addObject);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      //////console.log(field);
      let control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }

      // if(!control.valid){
      //     let control = this._form.get(field);
      //     this.uiMessageService.error(field + ' is not valid.');
      // }
    });
  }

  /* #endregion */
}
