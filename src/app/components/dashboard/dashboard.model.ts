export interface TaskList {
    id?: number;
    caseno?: string;
    type?: string;
    dueDate?: string;
}

export interface CaseList{
    id?: number;
    caseno?: string;
    type?: string;
    applicantName?: string;
}

export interface MessageLists{
    id?: number;
    message?: string;
}