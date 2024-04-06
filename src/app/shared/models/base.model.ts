export interface IBaseModel {
    id?: number;
    rowVersion?: string;
    createdUserId?: number;
    createdDateTime?: string;
    updatedUserId?: number;
    updatedDateTime?: string;
    // recordStatus?: number;
    recordStatusId?: number;
    recordStatus?: any ;
    recordStatusDisplayName?: string;
    isDeleted?: boolean;
    isNew?: boolean;
    // remarks?: string;
}

export class BaseModel implements IBaseModel {
    constructor() {}

    id?: number;
    rowVersion?: any;
    createdUserId?: number;
    createdDateTime?: string;
    updatedUserId?: number;
    updatedDateTime?: string;
    // recordStatus?: number;
    recordStatusId?: number;
    recordStatus?: any ;
    recordStatusDisplayName?: string;
    isDeleted?: boolean;
    isNew?: boolean;
    // remarks?: string;
}
