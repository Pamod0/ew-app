import { Time } from '@angular/common';
import { BaseModel, BaseDropdownModel } from '../../shared/models';

export interface IUserGroup extends BaseModel {
  code?: string;
  description?: string;
  policyIds?: number[];
}

export interface IUserGroupDropdown extends BaseDropdownModel {}

export enum RecordStatus {
  Active = 1,
  Inactive = 2,
}

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },
  { label: 'In Active', value: 2, toolTip: 'In Active' },
];
