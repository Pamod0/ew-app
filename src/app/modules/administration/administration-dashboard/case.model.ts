import { BaseModel } from "../../../shared/models/base.model";

export interface NewCases  extends BaseModel { 
    sequensId?:string;
    case_no?: string;
    type?:string;
    adj?:string;
    status?:string;
    date?:string;
    dob?:string;
    language?:string;
    occupation?:string;
    atty?:string;
    satty?:string;
    worker?:string;
  
    caseTypeId?:number;
    fileNumber?:string;
    kaseNumber?:string;
    venueId?:string;
    adjNumber?:string;
    caseStatusId?:number;
    kaseRatingId?:number;
    injuryTypeId?:number;
    representTypeId?:number;
    subIn?:boolean;
    subInDate?:string;
    subOutDate?:string;
    kaseAttorneyId?:number;
    kaseSupervisorAttorneyId?:number;
    kaseCoordinatorId?:number;
    kaseLanguageId?:number;
    InterPreter?:boolean;
    isDeleted?:boolean;
    kaseDate?:string;
    kaseSubStatusId?:number;
    kaseSubStatusId2?:number;
    kaseType?:string;
    kaseLanguage?:string;
    kaseStatus?:string;
    medical?:string;
    td?:number;
    voucher?:number;
    edd?:number;
    thirdParty?:boolean;
    a132?:boolean;
    seriousandWillfull?:boolean;
    ada?:boolean;
    ss?:boolean;
    specialInstructions?:string;
    recommendedBy?:string;
    providerId?:number;
    prescriptionDate?:string;
    reportDate?:string;
    fillingFeePaidDate?:string;
    retainerDate?:string;
    lienFiledDate?:string;
    reviewedDate?:string;
    ssn?:string;
    note?:string;
    kaseSuitId?:number;
    kaseJurisdictionId?:number;
    createdDateTime?:string;
    providerName?:string;

    applicantFirstName?:string;
    applicantLastName?:string;
    attorneyResponsibleId?:number;
  }
  
  export interface NewCaseStatuses {
    id?: string;
    statusNm?: string;
  }