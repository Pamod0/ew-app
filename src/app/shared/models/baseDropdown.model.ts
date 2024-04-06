
export interface IBaseDropdownModel {
  displayText?: string;
  value?: string;
  label?: string;
}

export class BaseDropdownModel implements IBaseDropdownModel {

  constructor() {
    
  }

  displayText?: string;
  value?: string;
  label?: string;
}