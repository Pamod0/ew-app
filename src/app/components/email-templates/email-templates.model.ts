import { BaseDropdownModel, BaseModel } from "src/app/shared/models";


export interface IEmailTemplate extends BaseModel {

  name?: string;
  body?: string;
}

export interface IEmailTemplaterDropdown extends BaseDropdownModel { }

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },
  { label: 'In Active', value: 2, toolTip: 'In Active' },
];

