import { BaseDropdownModel, BaseModel } from '../../shared/models';

export interface IUserProfile extends BaseModel {
  firstName?: string;
  lastName?: string;
  initials?: string;
  title?: string;
  email?: string;
  phone?: string;
  extension?: string;
  fax?: string;
  userGroupId?: number;
  loginId?: string;
  password?: string;
  confirmPassword?: string;
  typeId?: number;
}

export enum RecordStatus {
  Active = 1,
  Inactive = 2,
}

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },
  { label: 'In Active', value: 2, toolTip: 'In Active' },
];

export enum YesNo {
  No = 0,
  Yes = 1
}

export let UserTypeList = [
  { label: 'Clinic', value: 1, toolTip: 'Clinic' },
  { label: 'Provider', value: 2, toolTip: 'Provider' },
];

export let BillingDefaultList = [
  { label: 'Injury', value: 1, toolTip: 'Injury' },
  { label: 'Client', value: 2, toolTip: 'Client' },
  { label: 'Private', value: 3, toolTip: 'Private' },
];

export let TelemedUserTypeList = [
  { label: 'Patient', value: 1, toolTip: 'Patient' },
  { label: 'Client', value: 2, toolTip: 'Client' },
  { label: 'Staff', value: 3, toolTip: 'Staff' },
  { label: 'Provider', value: 4, toolTip: 'Provider' },
];
