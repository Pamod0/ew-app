import { BaseDropdownModel, BaseModel } from "src/app/shared/models";
import { IMacroFieldParameter } from "./_sub/parameter.model";

export interface IMacroFields extends BaseModel {

  name?: string;
  description?: string;
  query?: string;
  ParameterList? : IMacroFieldParameter[];
}

export interface IMacroFieldsDropdown extends BaseDropdownModel { }

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },
  { label: 'In Active', value: 2, toolTip: 'In Active' },
];
