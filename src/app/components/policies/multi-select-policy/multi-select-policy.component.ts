import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { UIMessageService } from 'src/app/shared/services';
import { IPolicy } from '../policy.model';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-multi-select-policy',
  templateUrl: './multi-select-policy.component.html',
  styleUrls: ['./multi-select-policy.component.css'],
})
export class MultiSelectPolicyComponent implements OnInit {
  _pageTitle: string = 'Polices ';
  _pageSubTitle: string = '';

  _list: any[] = [];
  _totalRecords: number = 0;
  _page: number = 0;
  _rows: number = 10;

  _spinner: string = 'policyMultiSelect_spinner';

  @Output() onRecordSelect = new EventEmitter<object>();
  @Output() onRecordUnSelect = new EventEmitter<object>();
  @Output() onClose = new EventEmitter();
  @Input() _selectedPolices?: IPolicy[] = [];

  @ViewChild('multiSelectTable')
  multiSelectTable: Table;

  constructor(
    private spinner: NgxSpinnerService,
    private uiMessageService: UIMessageService,
    private policyService: PolicyService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('ngOnInit : ' + JSON.stringify(this._selectedPolices));
      this.getSpecialtyList();
    }, 100);
  }

  getSpecialtyList() {
    this.spinner.show();

    this.policyService
      .getSelectList()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response) => {
          this._list = [];
          for (let item of response) {
            this._list.push(item);
          }
          // console.log('List : ' + this._list);
          // console.log(
          //   'Selected Polices : ' + JSON.stringify(this._selectedPolices)
          // );
        },
        (error) => {
          this.uiMessageService.error(error);
        }
      );
  }

  onRowSelect(event) {
    console.log('Multi select Add: ' + JSON.stringify(event.data));
    console.log('Multi select Add: ' + JSON.stringify(this._selectedPolices));
    this.onRecordSelect.emit(event.data);
  }

  onRowUnselect(event) {
    console.log('Multi select Remove : ' + JSON.stringify(event.data));
    console.log(
      'Multi select Remove : ' + JSON.stringify(this._selectedPolices)
    );
    this.onRecordUnSelect.emit(event.data);
  }

  onAllAddClick() {
    if (this._list.length != 0) {
      for (let item of this._list) {
        this.onRowUnselect(item);
      }

      for (let item of this._list) {
        this.onRecordSelect.emit(item);
      }
      this._selectedPolices = this._list;
    }
  }

  onAllRemoveClick() {
    this._selectedPolices = [];
    for (let item of this._list) {
      this.onRowUnselect(item);
    }
  }

  close() {
    this.onClose.emit();
  }

}
