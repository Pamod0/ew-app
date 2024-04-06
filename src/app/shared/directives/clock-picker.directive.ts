import { Directive, ElementRef } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Directive({
  selector: '[ClockPicker]',
})
export class ClockPickerDirective {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {

    let _twelvehour = true;

    $(this.el.nativeElement).clockpicker({
      placement: 'bottom',
      align: 'right',
      donetext: 'Ok',
      autoclose: true,
      twelvehour: _twelvehour,
      leadingZeroHours: false,
      upperCaseAmPm: true,
      leadingSpaceAmPm: true,
      afterDone: function () {
       this.twelvehour = false
      },
      init: function() { 
        this.twelvehour = false
    },
      beforeShow: function() {
        _twelvehour = false
    }
    });
  }
}
