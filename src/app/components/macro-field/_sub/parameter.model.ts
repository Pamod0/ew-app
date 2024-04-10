import { BaseModel } from "src/app/shared/models";
import { IMacroFields } from "../macro-field.model";

export interface IMacroFieldParameter extends BaseModel {

  macroFieldId?: number;
  macroField?: IMacroFields;
  parameter?: string;

}
