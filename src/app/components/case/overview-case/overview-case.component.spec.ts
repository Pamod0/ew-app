import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCaseComponent } from './overview-case.component';

describe('OverviewCaseComponent', () => {
  let component: OverviewCaseComponent;
  let fixture: ComponentFixture<OverviewCaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewCaseComponent]
    });
    fixture = TestBed.createComponent(OverviewCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
