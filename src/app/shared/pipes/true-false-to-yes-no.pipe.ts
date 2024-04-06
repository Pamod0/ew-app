import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "trueFalseToYesNo"
})
export class TrueFalseToYesNoPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? "Yes" : "No";
  }
}