import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

//import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
// import { ReportService as AppointmentReportService} from "../../../modules/appointment/reports/report.service";
// import { ReportService as PatientReportService} from "../../../modules/patient-management/reports/report.service";
import { finalize } from "rxjs/operators";
import { SeverityLevel } from '../../enums/severity-level.enum';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: [
    './report-viewer.component.css',
     './report-viewer.component.scss'
    ],
})
export class ReportViewerComponent implements OnInit {

  _spinner: string = 'listReportSpinner';

  @Input() id: number; 
  @Output() demographicsReportEvent = new EventEmitter<object>();
  @Output() demographicsReportCloseEvent = new EventEmitter<object>();

  @ViewChild("pdf_viewer", { static: false }) public pdfViewer;

  constructor(
    private spinner: NgxSpinnerService,
    // private appointmentReportService: AppointmentReportService,
    // private patientReportService: PatientReportService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    if(this.id){
      // this.generateReport();
    }
  }

  close() {
    this.demographicsReportCloseEvent.emit();
  }

  // generateReport() {
  //   let patientId = this.id;
  //   this.spinner.show(this._spinner);

  //   this.patientReportService
  //     .getPatientDemographicsReport(
  //       patientId
  //     )
  //     .pipe(
  //       finalize(() => {
  //         this.spinner.hide(this._spinner);
  //       })
  //     )
  //     .subscribe(
  //       (response) => {
  //         this.onRetrieved(response);
  //       },
  //       (error) => {
  //         this.showMessage(SeverityLevel.Error, error);
  //       }
  //     );
  // }

  onRetrieved(data: any) {
    var file = new Blob([data], { type: "application/pdf" });
    this.pdfViewer.pdfSrc = file;
    this.pdfViewer.refresh(); 
  }

  showMessage(severityLevel: any, message: string) {
    let severity = "",
      summary = "";

    switch (severityLevel) {
      case SeverityLevel.Information: {
        severity = "info";
        summary = "Information";
        break;
      }
      case SeverityLevel.Warning: {
        severity = "warn";
        summary = "Warning";
        break;
      }
      case SeverityLevel.Error: {
        severity = "error";
        summary = "Error";
        break;
      }
      case SeverityLevel.Success: {
        severity = "success";
        summary = "Success";
        break;
      }
      default: {
        severity = "info";
        summary = "System Message";
        break;
      }
    }

    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: message,
      life: 40000,
    });
  }

}
