import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { Message, MessageService } from 'primeng/api';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import _ from 'lodash';
import ticksToDate from 'ticks-to-date';
import * as moment from 'moment';



import { data } from 'jquery';
import { UIMessageService } from 'src/app/shared/services';
import { MacroFieldService } from '../../macro-field.service';

@Component({
  selector: 'aeliusmd-macro-filed-selector',
  templateUrl: './filed-selector.component.html',
  styleUrls: [
    './filed-selector.component.css',
    './filed-selector.component.scss',
  ],
})

export class MacroFiledSelectorComponent implements OnInit {

  _pageTitle: string = 'Macro Fields ';
  _pageSubTitle: string = '/ List';

  _list: any[] = [];
  _totalRecords: number = 0;
  _page: number = 0;
  _rows: number = 10;

  _selectedItem: any;


  @Output() onRecordSelect = new EventEmitter<object>();
  @Output() onRecordUnSelect = new EventEmitter<object>();
  @Output() onClose = new EventEmitter();


  @ViewChild('id_p_table')
  _el_p_table: Table;

  constructor(
    private spinner: NgxSpinnerService,
    private uiMessageService: UIMessageService,
    private mcroFieldService: MacroFieldService,
  ) { }

  ngOnInit() {

    this.getAllLeftMenuList();
  }

  getAllLeftMenuList() {
    this.spinner.show();

    this.mcroFieldService
      .getAll()
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response) => {
          
          this._list = [];

          for (let item of response) {
            this._list.push(item);
          }
        },
        (error) => {
          this.uiMessageService.error(error);

        }
      );

  }

  onRowSelect(event) {
    //console.log(event.data);
    this.onRecordSelect.emit(event.data);
  }

  onRowUnselect(event) {
    //console.log(event.data);
    //this.onRecordUnSelect.emit(event.data);
  }

  onAllAddClick() {

    // if (this._list.length != 0) {
    //   for (let item of this._list) {
    //     this.onRowUnselect(item);
    //   }

    //   for (let item of this._list) {
    //     this.onRecordSelect.emit(item);
    //   }
    //   this._selectedRightMenus = this._list;
    // }
  }

  onAllRemoveClick() {

    // this._selectedRightMenus = [];

    // for (let item of this._list) {
    //   this.onRowUnselect(item);
    // }
  }

  close(){
    this.onClose.emit();

  }
}



