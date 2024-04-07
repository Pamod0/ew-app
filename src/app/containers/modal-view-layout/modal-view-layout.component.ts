import { Component, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: "modal-view",
  host: {
  },
  templateUrl: './modal-view-layout.component.html',
  styleUrls: ['./modal-view-layout.component.scss'],
})
export class ModalViewLayoutComponent {

  private elementRef: ElementRef;
  private router: Router;

  // I initialize the modal-view component.
  constructor(
    elementRef: ElementRef,
    router: Router
  ) {

    this.elementRef = elementRef;
    this.router = router;

  }

  // ---
  // PUBLIC METHODS.
  // ---

  // I close the modal window view.
  public closeModal(): void {

    let s = this.router.url.substring(0, this.router.url.indexOf('('));

    this.router.navigate([
      s,
      {
        outlets: { modal: null }
      }
    ]);


  }


  // I handle a click on the modal-view.
  public handleClick(event: MouseEvent): void {

    // If the user clicked directly on the modal backdrop, let's treat that as a
    // desire to close the modal window - empty the auxiliary route.
    if (event.target === this.elementRef.nativeElement) {

      this.closeModal();

    }

  }
}
