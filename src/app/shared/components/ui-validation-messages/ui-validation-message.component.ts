import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UIValidationService } from './../../services';

@Component({
  selector: 'ui-validation-message',
  templateUrl: './ui-validation-message.component.html',
  styleUrls: ['ui-validation-message.component.css']
})
export class UIValidationMessageComponent {
  @Input() control: FormControl;  
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return UIValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}