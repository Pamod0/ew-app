
import { Time } from '@angular/common';
import { BaseDropdownModel, BaseModel } from "src/app/shared/models";

export interface INewUsers extends BaseModel {
 
  companyId?: number;
  clientId?:number;
  firstName?: string;
  lastName?: string;
  typeId?: number;
  userGroupId?: number;
  email?: string;
  phone?: string;
  confirmPassword?: string;
  password?: string;
  
  //insurance?: string;
}
export interface IAuditorDropdown extends BaseDropdownModel {}

export enum RecordStatus {
  Active = 1,
  Inactive = 2,
}

export let DistrictList = [
  // { label: 'Active', value: 1, toolTip: 'Active' },
  //{ label: 'Select the City', value: null},
  { label: 'Gampaha', value: 1},
  { label: 'Colombo', value: 2 },
  { label: 'Kalutara', value: 3 },
  { label: 'Badulla', value: 4 },
  { label: 'Galle', value: 5 },
  { label: 'Matara', value: 6 },
  { label: 'Kegalle', value: 7 },
  { label: 'Kurunegala', value: 8 },
  { label: 'Anuradhapura', value: 9 },
  { label: 'Kandy', value: 10 },
  { label: 'Batticoloa', value: 11 },
  { label: 'NuwaraEliya', value: 12 },
  { label: 'Ratnapura', value: 13 },
  { label: 'Jaffna', value: 14 },
  { label: 'Kilinochchi', value: 15 },
  { label: 'Hambantota', value: 16 },
  { label: 'Moneragala', value: 17 },
  { label: 'Polonnaruwa', value: 18 }, 
  { label: 'Mullativu', value: 19 },
  { label: 'Puttalam', value: 20 },
  { label: 'Ampara', value: 21 },
  { label: 'Trincomalee', value: 22 },
  { label: 'Vavunia', value: 23 },
  { label: 'Matale', value: 24 },
  { label: 'Mannar', value: 25 },

];

export let CompanyList = [
  // { label: 'Active', value: 1, toolTip: 'Active' },
  //{ label: 'Select the City', value: null},
  { label: 'Ministry of Lands', value: 1},
  

];

export let ClientList = [
  { label: 'Ministry of Lands', value: 1},
  

];

export let UsersTypeList = [

  { label: 'User Type 1', value: 1},
  { label: 'User Type 2', value: 2},
  

];

// SuperAdmin = 0,
// ClientAdmin = 1,
// ClientUser = 2,
// PrintingService = 3,
// MediaAdmin = 4,
// MediaUser = 5,
// SupplierAdmin = 6,
// SupplierUser = 7,
// SystemUser =8,
// CardPrintAdmin = 9,
// CardPrintUser = 10,
// GateUser = 11


export let ClientUserList = [
  { label: 'Super Admin', value: 0},
  { label: 'Client Admin', value: 1},
  { label: 'Client User', value: 2},
  { label: 'Printing Service', value: 3},
  { label: 'Media Admin', value: 4},
  { label: 'Media User', value: 5},
  { label: 'Supplier Admin', value: 6},
  { label: 'Supplier User', value: 7},
  { label: 'System User', value: 8},
  { label: 'Card Print Admin', value: 9},
  { label: 'Card Print User', value: 10},
  { label: 'Gate User', value: 11},   
];

export let SupplierUserList = [

  { label: 'Supplier User', value: 7}
];

export let UserGroupList = [

  { label: 'User Group 1', value: 1},
  { label: 'User Group 2', value: 2},
  

];

export let RecordStatusList = [
  { label: 'Active', value: 1, toolTip: 'Active' },];