import { BaseModel, BaseDropdownModel } from '../../shared/models';

export interface IPolicy extends BaseModel {
  code?: string;
  description?: string;
  name?: string;
  modules?:[];
  policyId?: string;
  treeList?:[];
}

export interface IPolicyDropdown extends BaseDropdownModel {}

export enum RecordStatus {
  Active = 1,
  Inactive = 2,
}

export let PermissionList = [
  { label: 'View Only', value: 1  },
  { label: 'Add Only', value: 2 },
  { label: 'Edit Only', value: 3 },
  { label: 'Delete Only', value: 4 },
  { label: 'Get Only', value: 5  },
  { label: 'Get by Id Only', value: 6  },
];

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },
  { label: 'In Active', value: 2, toolTip: 'In Active' },
];
