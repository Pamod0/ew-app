import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { LazyLoadEvent, Message, TreeNode } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
// import { SearchZipCodeComponent } from "../../";
import { UIMessageService } from "src/app/shared/services";
import { IPolicy, PermissionList, RecordStatusList } from "../policy.model";
import { PolicyService } from "../policy.service";
import { ModulesService } from "../../modules/module.service";
import _ from 'lodash';
import { NodeService } from "../nodeService";
import { ModalViewLayoutComponent } from "src/app/containers";

export enum FormControls {
  Non,
  LabName,
  Initial,
  Address1,
  Address2,
  Zip,
  State,
  City,
  PhoneNo,
  Fax,
  Ext,
  Email,
  EScript,
  RecordStatus,
  SpecialPermission,
  ReportingSystem,
  Appointment,
  PracticeManagement,
  PatientManagement,
  Administration,
  Modules
}
@Component({
  selector: "aeliusmd-create-policy",
  templateUrl: "./create-policy.component.html",
  styleUrls: [
    "./create-policy.component.css",
    "./create-policy.component.scss",
  ],
})

export class CreatePolicyComponent implements OnInit {

  _form: UntypedFormGroup;
  _spinner: string = 'modifierViewSpinner';

  _policy: IPolicy;
  _recordStatusList = RecordStatusList;
  _formSubmitAttempt: boolean = false;
  _modules: any[];
  _selectedModule: any = null;
  _tableColumns: any[];
  _permissions: any[] = [];
  _screen: any[] = [];
  _permissionModule: any[] = [];
  nodes3: any[];
  child: any[] = [];
  parent: any[] = [];
  parent2: any[] = [];
  _moduleId = ""
  _screensSize: any;
  _treeLoader: boolean = false

  files2: TreeNode[];
  files3: TreeNode[];
  selectedNodes2: TreeNode;
  selectedFile: TreeNode;
  selectedFiles2: TreeNode;
  _activeTabIndex: number = 0;


  nodeList: any[] = [];

  _permissionList = PermissionList;

  _node = {

  }

  _listTypeEnum = FormControls;
  _focusedList: any = this._listTypeEnum.Non;
  _list: any[] = [];

  _flagVisitTypeChanged: boolean = false;

  checked1: boolean = false;

  checked2: boolean = true;
  selectedItems = [];

  @ViewChild('moduleScreenPermission', { static: false })
  _moduleScreenPermissionElementRef: ElementRef;

  @ViewChild('id_lab_name_input', { static: false })
  _labNameElementRef: ElementRef;

  // @ViewChild('id_Search_Zip_Component', { static: false })
  // _el_Search_Zip_Component: SearchZipCodeComponent;

  @ViewChild('id_zip_code_input', { static: false })
  _el_zip_code_input: ElementRef;

  @Input() id: number;
  @Output() policyCreateEvent = new EventEmitter<object>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private policyService: PolicyService,
    private moduleService: ModulesService,
    private nodeService: NodeService,
    private modalViewComponent: ModalViewLayoutComponent,
  ) { }

  ngOnInit() {


    this.getModuleList();
    this._policy = this.policyService.initializeObject();
    this._formSubmitAttempt = false;
    this._form = this.formBuilder.group({

      name: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(30)]],
      policyId: [{ value: null, disabled: false }],
      description: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(120)]],
      permissionId: [{ value: null, disabled: false }],

    });
    //this.getModules();
    // setTimeout(() => {
    //   this._labNameElementRef.nativeElement.focus();
    // }, 100);


  }

  getModuleList() {
    this.nodeService
      .getSelectList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {
          this.files2 = <TreeNode[]>response;
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  get policy() {
    return this._policy
  }
  set policy(value: any) {
    this._policy = value;
  }

  loadDate(event: LazyLoadEvent) {

  }

  addPermission(rowData: any) {
    this._moduleId = rowData.id;
    // this._screensSize = rowData.screens.length;
    this.parent = [];
    this.parent2 = [];


    this.files2 = <TreeNode[]>this.parent;
  }

  addPermissionFocus() {
    this._focusedList = this._listTypeEnum.Modules;
  }




  onTabIndexChange(event: any) {

    console.log('tab change');
  }

  nodeSelect(event) {
    //this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.data.name});
    this.addItemsToArray(event);
  }

  nodeUnselect(event) {
    //this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.data.name});
    this.removeItemsFromArray(event);
  }



  addItemsToArray(event: any) {
    //console.log(event);
    if (!event.node) return;


    if (event.node.type == "permissions") {

      if (event.node.parent) {
        this.selectedItems.push(event.node.parent);
      }
    }
    else {
      if (event.node.children) {
        
        for (let child of event.node.children) {
          //this.selectedItems.push(child);
          this.addedChildItems(child);
        }
      }
    }
    this.selectedItems.push(event.node);

    console.log('selectedItems after added:', this.selectedItems);
  }

  addedChildItems(node: any){

    this.selectedItems.push(node);
    if (node.children) {
      for (let child of node.children) {
        this.addedChildItems(child);
      }
    }
  }


  removeItemsFromArray(event: any) {
    console.log(event);
    if (!event.node) return;

    this.selectedItems.splice(this.selectedItems.indexOf(event.node), 1);

    if (event.node.children) {
      for (let child of event.node.children) {
        //this.selectedItems.splice(this.selectedItems.indexOf(child), 1);
        this.removeChildItems(child);
      }
    }

    
    console.log('selectedItems after remove:', this.selectedItems);
  }

  removeChildItems(node: any){

    this.selectedItems.splice(this.selectedItems.indexOf(node), 1);
    if (node.children) {
      for (let child of node.children) {
        this.removeChildItems(child);
      }
    }
  }


  resetForm() {
    this._form.reset();
  }

  save() {
    this._formSubmitAttempt = true;


    if (!this._form.valid) {
      this._formSubmitAttempt = false;
      this.validateAllFormFields(this._form);
      this.uiMessageService.error('Form is not valid.');
      return;
    }
    this.spinner.show(this._spinner);



    this.onSave()
      .pipe(
        finalize(() => {
          this.spinner.hide(this._spinner);
        })
      )
      .subscribe(
        (response) => {
          this.uiMessageService.success('Record successfully created');
          this.policyService.updateList();
          this.modalViewComponent.closeModal();
          if (this._form) {
            this._form.reset();
          }
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onSave(): Observable<IPolicy> {
    let saveObject = Object.assign({}, this._list, this._form.getRawValue());

    //saveObject.policyId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    let _tree = []
    this.selectedItems.forEach(element => {
      element.parent = null;
      element.children = null;

      _tree.push(element);
    });

    saveObject.treeList = _tree;
    //saveObject.

    console.log(saveObject);

    return this.policyService.save(saveObject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        this.spinner.hide(this._spinner);
        return throwError(error);
      })
    );
  }

  getModules() {
    this.moduleService
      .getAll()
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response) => {
          this._modules = response;
          console.log('modules', this._modules)
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      )
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




  onListSelect(event) {
    switch (this._focusedList) {
      case this._listTypeEnum.EScript: {
        this._form.patchValue({

        });
        setTimeout(() => {
          //this._labNameElementRef.nativeElement.focus();
        }, 100);
        break;
      }
      default: {
        //statements;
        break;
      }

    }

  }

  permissionTypeChange() {
    this._flagVisitTypeChanged = true;
  }



  close() {
    this.modalViewComponent.closeModal();
  }
}
