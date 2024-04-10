import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CaseService } from '../case.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UIMessageService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NewCases } from '../case.model';
import { DashboardService } from '../../dashboard/dashboard.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-case-crud',
  templateUrl: './case-crud.component.html',
  styleUrls: ['./case-crud.component.scss']
})
export class CaseCrudComponent {
  kaseTypes: any[] = [];
  attorneyList: any[] = [];
  _form: UntypedFormGroup;
  _formSubmitAttempt: boolean = false;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  newcases: NewCases[] = [];
  newcase : NewCases={};
  @Input() viewMode: boolean =false;
  @Input() kaseEdit:boolean;
  @Input() sidebarVisible:boolean;
  selectedFiles: File[] = [];
  selectedFilesInfo: { name: string, size: string, iconUrl: string }[] = [];
  _innerHeight : any ='0px';
  @HostListener ('window : resize',['$event'])
  onResize(event){
    this._innerHeight = window.innerHeight + 'px';
  }
  constructor(
    private caseService: CaseService,
    private formBuilder: UntypedFormBuilder,
    private uiMessageService: UIMessageService,
    private router: Router,
    private messageService: MessageService,
    private elementRef: ElementRef,
    private sidebarService: DashboardService
  ) {}

  ngOnInit() {
    this._innerHeight = window.innerHeight + 'px';
    this.getDropDownData();
    this._form = this.formBuilder.group({
      caseTypeId: [{ value: null, disabled: false }],
      fileNumber:  [{ value: null, disabled: false }, [Validators.required]],
      caseNumber:  [{ value: null, disabled: false }, [Validators.required]],
      applicantFirstName:  [{ value: null, disabled: false }, [Validators.required]],
      applicantLastName:  [{ value: null, disabled: false }, [Validators.required]],
      attorneyResponsibleId:  [{ value: null, disabled: false }],
    });   
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
          this.kaseTypes = response.kaseTypes;
          this.attorneyList = response.kaseAttorneyData;
          //this.onRetrieved(response);
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }
  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  onFileSelected(event): void {
    this.selectedFiles = Array.from(event.target.files);
    this.selectedFilesInfo = [];
    this.selectedFiles.forEach((file: File) => {
        const fileExtension = file.name.split('.').pop();
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const iconUrl = this.getFileIconUrl(fileExtension);
        this.selectedFilesInfo.push({ name: file.name, size: fileSizeInMB + ' MB', iconUrl: iconUrl });
    });
  }
  removeFile(index: number) {
    this.selectedFilesInfo.splice(index, 1); // Remove the file from the array
  }
  
  getFileIconUrl(extension: string): string {
    const iconMap: { [key: string]: string } = {
      'jpg': 'assets/images/jpeg-icon.png',
      'jpeg': 'assets/images/jpeg-icon.png',
      'png': 'assets/images/png-icon.png',
      'pdf': 'assets/images/pdf-icon.png',
    };
    return iconMap[extension.toLowerCase()] || 'assets/images/default-icon.png';
  }

  uploadFile( caseId:any): void {
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    this.caseService.uploadFile(formData,caseId).subscribe(
      (response) => {
        console.log('File uploaded successfully');
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy'; // Visual feedback for user
    const target = event.target as HTMLElement;
    target.classList.add('drag-over'); // Add CSS class for styling
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over'); // Remove CSS class for styling

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.selectedFile = files[0]; // Get the first dropped file
    } else {
      this.selectedFile = null;
    }
  }
  saveCase() {
    this._formSubmitAttempt = true;

    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }
    
    this.onSave()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {
          if (this._form) {
            if (!this.kaseEdit) {
              this.uiMessageService.success('Record successfully created');
              this._form.reset();
              // this.newKaseList.getKases();
              if(this.selectedFiles.length>0){
                this.uploadFile(response.id)
              }
          
              this.router.navigate(['/dashboard/case-overview', response.id]);
            }
            else {
              this.uiMessageService.success('Record successfully updated');
              // this.newKaseList.getKases();
            }
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    this._formSubmitAttempt = true;

    Object.keys(formGroup.controls).forEach((field) => {
      let control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  onSave(): Observable<NewCases> {
    if (this.kaseEdit && this.newcase.id) {
      let saveObject = Object.assign({}, this._form.getRawValue(), { id: this.newcase.id });
      return this.caseService.save(saveObject).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    } else {
      let saveObject = Object.assign({}, this._form.getRawValue());

      return this.caseService.save(saveObject).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  }
  onFocusDropDown(event) {
    this.getDropDownData();    
  }
  closeSidebar(event: Event): void {
    event.stopPropagation();
    this.sidebarService.toggleSidebar();
  }
  reset(){
    this._form.reset();
  }
}
