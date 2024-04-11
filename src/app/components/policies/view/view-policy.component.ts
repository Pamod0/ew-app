import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { LazyLoadEvent, Message, TreeNode } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
// import { SearchZipCodeComponent } from "../../zips";
import { UIMessageService } from "src/app/shared/services";
import { IPolicy, PermissionList, RecordStatusList } from "../policy.model";
import { PolicyService } from "../policy.service";
import { ModulesService } from "../../modules/module.service";
import _ from 'lodash';
import { NodeService } from "../nodeService";
import { ActivatedRoute } from "@angular/router";
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
  selector: "aeliusmd-edit-policy",
  templateUrl: "./view-policy.component.html",
  styleUrls: [
    "./view-policy.component.css",
    "./view-policy.component.scss",
  ],
})

export class ViewPolicyComponent implements OnInit {

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
  selectedFiles2: TreeNode[] = [];
  _activeTabIndex: number = 0;


  // _recordStatusList: any[];


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
  selectedNodesArray = [];

  @ViewChild('moduleScreenPermission', { static: false })
  _moduleScreenPermissionElementRef: ElementRef;

  @ViewChild('id_lab_name_input', { static: false })
  _labNameElementRef: ElementRef;

  // @ViewChild('id_Search_Zip_Component', { static: false })
  // _el_Search_Zip_Component: SearchZipCodeComponent;

  @ViewChild('id_zip_code_input', { static: false })
  _el_zip_code_input: ElementRef;
  routeSub: any;

  @Input() id: number;
  @Output() policyViewCloseEvent = new EventEmitter<object>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private uiMessageService: UIMessageService,
    private spinner: NgxSpinnerService,
    private policyService: PolicyService,
    private moduleService: ModulesService,
    private nodeService: NodeService,
    private modalViewComponent: ModalViewLayoutComponent,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {


    this.getModuleList();
    this._policy = this.policyService.initializeObject();
    this._formSubmitAttempt = false;
    this._form = this.formBuilder.group({

      name: [{ value: null, disabled: true }],
      policyId: [{ value: null, disabled: true }],
      description: [{ value: null, disabled: true }],
      permissionId: [{ value: null, disabled: true }],
      recordStatusId: [{ value: null, disabled: true }],
    });

    this.routeSub = this.route.params.subscribe((params) => {
      //console.log('params', params);
      if (params != undefined) {
        //console.log(params['id']);
        this.id = params['id']
      }
    })



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

          if (this.id != undefined) this.get(this.id);
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



  onTabIndexChange(event: any) {

    console.log('tab change');
  }

  resetForm() {
    this._form.reset();
  }



  get(id: number): void {
    this.policyService
      .getView(id)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response) => {
          this.onRetrieved(response);
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onRetrieved(data: any) {
    if (this._form) {
      this._form.reset();
    }
    this.policy = JSON.parse(JSON.stringify(data || null));

    this.selectedNodesArray = this.policy.selectedItemsIds;

    console.log(this.selectedNodesArray);
    let stringKeys = this.selectedNodesArray.map(String)

    console.log(stringKeys);

    // //selectedFiles2
    //this.selectNodes(this.files2, this.selectedFiles2, stringKeys);

    this.checkNode(this.files2, stringKeys);

    this._form.patchValue({
      recordStatusId: this.policy.recordStatusId,
      name: this.policy.name,
      policyId: this.policy.policyId,
      description: this.policy.description

    });

  }

  selectNodes(tree: TreeNode[], checkedNodes, keys: string[]) {

    tree.map(node => {

      console.log(node.parent);

      if (keys.includes(node.key.toString())) {

        if (node.type == "permissions") {
          checkedNodes.push(node);
        }

        if (node.type == "screens") {
          node.partialSelected = true;
        }
      }

      if (node.children) {
        this.selectNodes(node.children, checkedNodes, keys)
      }
    });
  }

  checkNode(nodes: TreeNode[], str: string[]) {
    nodes.forEach(node => {
      node.selectable = false;
      //check parent
      if (str.includes(node.key.toString())) {

        if (node.type != "screens") {
          this.selectedFiles2.push(node);
        }
        else {
          node.partialSelected = true;
        }

        this.selectedItems.push(node);

      }

      if (node.children != undefined) {
        node.children.forEach(child => {
          //check child if the parent is not selected
          if (str.includes(child.key.toString()) && !str.includes(node.key.toString())) {
            node.partialSelected = true;
            child.parent = node;
          }

          //check the child if the parent is selected
          //push the parent in str to new iteration and mark all the childs
          if (str.includes(node.key.toString())) {
            child.parent = node;
            //str.push(child.key.toString());
          }
        });
      } else {
        return;
      }

      this.checkNode(node.children, str);

      node.children.forEach(child => {
        if (child.partialSelected) {
          node.partialSelected = true;
        }
      });
    });
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
          this.selectedItems.push(child);
        }
      }
    }
    this.selectedItems.push(event.node);
  }

  removeItemsFromArray(event: any) {
    console.log(event);
    if (!event.node) return;

    this.selectedItems.splice(this.selectedItems.indexOf(event.node), 1);

    if (event.node.children) {
      for (let child of event.node.children) {
        this.selectedItems.splice(this.selectedItems.indexOf(child), 1);
      }
    }
    console.log('selectedItems after remove:', this.selectedItems);
  }

  close() {
    this.modalViewComponent.closeModal();
  }
}
