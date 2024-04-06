import {
  ValidatorFn,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
// import ticksToDate from 'ticks-to-date';
import moment from 'moment';

export class UIValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config: { [unit: string]: string } = {
      required: 'Required',
      invalidCreditCard: 'Invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidURL: 'Invalid URL',
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Minimum length must be at least ${validatorValue.requiredLength} characters`,
      maxlength: `Maximum length cannot exceed ${validatorValue.requiredLength} characters`,
      range: 'Value between 1 (lowest) and 5 (highest).',
      pattern: 'Missed match the pattern',
      invalidTimeSlot: 'Invalid Time Duration',
      invalidTimeRange: 'Invalid Time Range',
      invalidWorkigDay: 'Invalid Workig Day',
      invalidEndTime: 'Invalid End Time',
      invalidNumber: 'Cannot Contain Letters',
      invalidDate: 'Invalid Date',
      invalidPercentage: 'value can not greater than 100%',
      invalidPhoneNumber: 'Invalid phone number',
      invalidAlphaNumeric: 'Can Only Contain Letters and Numbers',
      invalidAlphaNumericAndDash: 'Can Only Contain Letters , Numbers and -',
      mustMatch: 'Password Confirm not Match',
    };

    return config[validatorName];
  }

  static rangeValidator(control: any, min: number, max: number) {
    if (
      control.value &&
      (isNaN(control.value) || control.value < min || control.value > max)
    ) {
      return null;
    } else {
      return { range: true };
    }
  }

  static timeSlotValidator(settingsTime: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return { invalidTimeSlot: true };
      }
      if (control.value % settingsTime != 0) {
        return { invalidTimeSlot: true };
      }
      return null;
    };
  }

  static timeRangeValidator(start: any, end: any): ValidatorFn {
    //let _start = new Date(start);
    // ////console.log("start " +start.ticks);
    // ////console.log("end " +end.ticks);

    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return { invalidTimeRange: true };
      }

      let valueTime = moment(control.value).format('HH:mm');
      let valueTimeTicks =
        (Number(valueTime.split(':')[0]) * 60 * 60 * 1000 +
          Number(valueTime.split(':')[1]) * 60 * 1000) *
        10000;

      //////console.log("input " +valueTimeTicks)

      if (start.ticks > valueTimeTicks || valueTimeTicks > end.ticks) {
        return { invalidTimeRange: true };
      }
      return null;
    };
  }

  static workigDayValidator(workingDays: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value == null) {
        return { invalidWorkigDay: true };
      }

      let array = workingDays.split(',');

      ////console.log(control.value)

      if (!array.includes(control.value.toString())) {
        return { invalidWorkigDay: true };
      }

      return null;
    };
  }

  static endTimeValidator(startTime: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return { invalidEndTime: true };
      }

      let valueTime = moment(control.value).format('HH:mm');
      let valueTimeTicks =
        (Number(valueTime.split(':')[0]) * 60 * 60 * 1000 +
          Number(valueTime.split(':')[1]) * 60 * 1000) *
        10000;

      const startTimeControler = control.root.get(startTime);

      let svalueTime = moment(startTimeControler.value).format('HH:mm');
      let svalueTimeTicks =
        (Number(svalueTime.split(':')[0]) * 60 * 60 * 1000 +
          Number(svalueTime.split(':')[1]) * 60 * 1000) *
        10000;

      if (valueTimeTicks <= svalueTimeTicks) {
        return { invalidEndTime: true };
      }

      return null;
    };

    // return (formGroup: FormGroup) => {
    //     let _startTime = formGroup.controls["startTime"];
    //     let _endTime = formGroup.controls["endTime"];

    //     if(!_startTime || !_endTime){
    //         return  { "invalidEndTime": true };
    //     }

    //     if(!_startTime.value){
    //         return  { "invalidEndTime": true };
    //     }

    //     let _startTimevalueTime = moment(_startTime.value).format("HH:mm");
    //     let _startTimevalueTimeTicks =
    //         (Number(_startTimevalueTime.split(":")[0]) * 60 * 60 * 1000 +
    //             Number(_startTimevalueTime.split(":")[1]) * 60 * 1000) *
    //         10000;

    //     let _endTimevalueTime = moment(_endTime.value).format("HH:mm");
    //     let _endTimevalueTimeTicks =
    //         (Number(_endTimevalueTime.split(":")[0]) * 60 * 60 * 1000 +
    //             Number(_endTimevalueTime.split(":")[1]) * 60 * 1000) *
    //         10000;

    //     if(_startTimevalueTimeTicks >= _endTimevalueTimeTicks){
    //         return  { "invalidEndTime": true };
    //     }

    //     return null;
    // }
  }

  static creditCardValidator(control: any) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static emailValidator(control: any) {
    if (!control.value) {
      return null;
    }

    // RFC 2822 compliant regex
    if (
      control.value.match(
        //  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static urlValidator(control: any) {
    if (!control.value) {
      return null;
    }

    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
      )
    ) {
      return null;
    } else {
      return { invalidURL: true };
    }
  }

  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  // Number only validation
  static numericValidator(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/))
      return { invalidNumber: true };

    return null;
  }

  static invalidDateValidator(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    let today = new Date();

    if (val > today) {
      return { invalidDate: true };
    }

    return null;
  }

  static percentageValidator(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (parseInt(val) > 100 || parseInt(val) < 0)
      return { invalidPercentage: true };

    return null;
  }

  static phoneNumberValidator(control: any) {
    if (!control.value) {
      return null;
    }

    // RFC 2822 compliant regex
    if (
      control.value.match(
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
      )
    ) {
      return null;
    } else {
      return { invalidPhoneNumber: true };
    }
  }

  static alphaNumericValidator(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^([a-zA-Z0-9]+)$/))
      return { invalidAlphaNumeric: true };

    return null;
  }

  static alphaNumericValidatorWithAllowsDash(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^([a-zA-Z0-9-]+)$/))
      return { invalidAlphaNumericWithDash: true };

    return null;
  }

  // static alphaNumericValidatorWithAllowsOnlyForDash(control: any) {
  //   let val = control.value;
  //   if (val === null || val === '') return null;
  //   if (!val.toString().match(/^([a-zA-Z0-9-]+)$/))
  //     return { invalidAlphaNumericAndDash: true };
  //   return null;
  // }

  static mustMatch(controlName: any) {
    if (controlName.value) {
      let password = controlName.value;
      let confirmPassword = controlName._parent.controls.password.value;

      if (password != confirmPassword) {
        return { mustMatch: true };
      } else {
        return null;
      }
    }
    return null;
  }

  static alphaNumericValidatorWithAllowsOnlyForDash(control: any) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^\w+([\s-_]\w+)*$/))
      return { invalidAlphaNumericAndDash: true };

    return null;
  }
}

// /^[a-z\d\-_\s]+$/
