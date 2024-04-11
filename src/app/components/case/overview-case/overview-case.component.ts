import { Component, HostListener } from '@angular/core';
import { CaseService } from '../case.service';
import { finalize } from 'rxjs';
import { UIMessageService } from 'src/app/shared/services';
import { NewCases } from '../case.model';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overview-case',
  templateUrl: './overview-case.component.html',
  styleUrls: ['./overview-case.component.scss']
})
export class OverviewCaseComponent {
  id:number
  progressValue: number = 56;
  breadcrumbItems: any[];
  value: string | undefined;
  cases: any[];
  currentDateTime: Date;
  caseStatuses: any[] = [];
  newCases: NewCases[] = [];
  newCase : NewCases={};
  formattedKaseDate:any;
  _innerHeight : any ='0px';
  progressBarValues: number []=[];
  maxProgressDays: number = 30;
  progValue:number =Math.floor((this.maxProgressDays)/4);
  attorneyList: any[] = [];
  totalComplition: number;
  totalCompletionTime: number;
  @HostListener ('window : resize',['$event'])
  onResize(event){
    this._innerHeight = window.innerHeight + 'px';
  }

  constructor(private caseService: CaseService,
    private uiMessageService: UIMessageService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,) {
    this.breadcrumbItems = [
      { label: ' Home', icon: 'pi pi-home' },
      { label: ' All Case', icon: 'briefcase' }
    ];

    this.cases = [
      { 
        type: 'Type 1', 
        description: 'Description 1', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-06', 
      },
      { 
        type: 'Type 2', 
        description: 'Description 2', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-07', 
      },
      { 
        type: 'Type 3', 
        description: 'Description 3', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-08', 
      },
      { 
        type: 'Type 4', 
        description: 'Description 4', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-09', 
      },
      { 
        type: 'Type 5', 
        description: 'Description 5', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-10', 
      },
      { 
        type: 'Type 6', 
        description: 'Description 6', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-11', 
      },
      { 
        type: 'Type 7', 
        description: 'Description 7', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-12', 
      },
      { 
        type: 'Type 8', 
        description: 'Description 8', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-13', 
      },
      { 
        type: 'Type 9', 
        description: 'Description 9', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-14', 
      },
      { 
        type: 'Type 10', 
        description: 'Description 10', 
        user: { avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', name: 'Malith Weeramuni' }, 
        date: '2024-04-15', 
      }
    ];
  }
  ngOnInit() {
    this.currentDateTime = new Date();
    this._innerHeight = window.innerHeight + 'px';
    this.getDropDownData();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('ID:', this.id);
    });
    this.getCaseById();
    // this._applicantForm.patchValue(this.newkase);
    // this._employeeForm.patchValue(this.newkase);
    // this._injuryForm.patchValue(this.newkase);
    
  }
  calculateProgress(): number | void {
    if (this.newCase && this.newCase.createdDateTime) {
      const caseCreationDate = new Date(this.newCase.createdDateTime);
      const currentDate = new Date();
      const totalMilliseconds = currentDate.getTime() - caseCreationDate.getTime();
      const totalDays = totalMilliseconds / (1000 * 3600 * 24); // Convert milliseconds to days
      this.totalComplition = Math.floor((totalDays/this.maxProgressDays)*100);
      this.totalCompletionTime = totalDays*24*60;
  
      // Calculate progress percentage for each progress bar
      this.progressBarValues[0] = Math.floor((totalDays / (this.progValue))*100) ;; // Example: 7 days
      if (this.progressBarValues[0] > 100) {
        this.progressBarValues[0] = 100;
      } else if (this.progressBarValues[0] < 100) {
        return this.progressBarValues[0];
      }
  
      this.progressBarValues[1] = Math.floor((totalDays /( this.progValue*2))*100) ;; // Example: 14 days
      if (this.progressBarValues[1] > 100) {
        this.progressBarValues[1] = 100;
      } else if (this.progressBarValues[1] < 100) {
        return this.progressBarValues[1];
      }
  
      this.progressBarValues[2] = Math.floor((totalDays / (this.progValue*3))*100) ; // Example: 21 days
      if (this.progressBarValues[2] > 100) {
        this.progressBarValues[2] = 100;
      } else if (this.progressBarValues[2] < 100) {
       return;
      }
  
      this.progressBarValues[3] = Math.floor((totalDays / (this.progValue*4))*100) ; // Example: 30 days
      if (this.progressBarValues[3] > 100) {
        this.progressBarValues[3] = 100;
      } else if (this.progressBarValues[3] < 100) {
        return this.progressBarValues[3];
      }
    }
  }
  formatTotalCompletionTime(): string {
    const hours = Math.floor(this.totalCompletionTime / 60);
    const minutes = Math.floor(this.totalCompletionTime % 60);
    return `${hours} hr ${minutes} min`;
  }  
  
  getCaseById(): void {
    this.caseService
      .getCaseById(this.id)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {

          console.log("getCaseById",response)
          
          this.newCase=response[0];
           this.formattedKaseDate = this.transformDate(this.newCase.createdDateTime);
           this.calculateProgress();
        (error) => {
          this.uiMessageService.error(error);
        }
      }
      );
  }

  getDropDownData(): void {

    this.caseService
      .getDropDownData()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {
          // this.gender_list = response.kaseGender;
          // this.salutation_list = response.kaseSalutation;
          this.caseStatuses = response.kaseStatus;
          // this.maritial_list = response.kaseMaritial;
          // this.pay_interval_list = response.kaseInterval;
          // this.paid_type_list = response.kasePaidType;
          // this.legal_list = response.kaseLegal;
          // this.yes_no_list = response.kaseFacilityWantOrNo;
          // this.language_list = response.kaseLanguage;
          // this.insurance_list = response.kaseInsurance;
          // this.inj_status_list = response.kaseInjuryStatus;
          // this.inj_venue_list = response.kaseInjuryVenue;
          // this.inj_statue_limitaion_list = response.kaseInjuryStatueLimitation;
          // // this.injury_list = response.kaseInjuryBodyParts;
          // this.note_type_list = response.kaseInjuryNoteType;
          // this.note_status_list = response.kaseInjuryNoteStatus;

          // this.injury_list = response.kaseInjuryBodyParts.map(item => {
          //   return { bodypartsId: item.value, bodypartValue: item.label };
          // });
          this.attorneyList = response.kaseAttorneyData;
          this.getAttorneyResLabel();
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  transformDate(apiDate: string): string {
    const formattedDate = this.datePipe.transform(apiDate, 'dd/MM/yyyy');
    return formattedDate || ''; // Return an empty string or handle null case
  }

  getCaseStatusLabel(): string | undefined {
    if (this.caseStatuses && this.newCase) {
      const status = this.caseStatuses.find(status => status.value === this.newCase.caseStatusId);
      return status ? status.label : undefined;
    }
    return undefined;
  }

  getButtonClass(): string {
    if (this.caseStatuses && this.newCase) {
      const status = this.caseStatuses.find(status => status.value === this.newCase.caseStatusId);
      if (status) {
        if (status.value === 2) {
          return 'btn-open';
        } else if (status.value === 3) {
          return 'btn-close';
        }
      }
    }
    return 'btn-primary';
  }
  getAttorneyResLabel(): string | undefined {
    if (this.attorneyList && this.newCase) {
      const attorney = this.attorneyList.find(attorney => attorney.value === this.newCase.attorneyResponsibleId);
      return attorney ? attorney.label : undefined;
    }
    return undefined;
  }
}
