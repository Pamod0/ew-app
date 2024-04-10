import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesDashboardComponent } from './cases-dashboard.component';

describe('CasesDashboardComponent', () => {
  let component: CasesDashboardComponent;
  let fixture: ComponentFixture<CasesDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CasesDashboardComponent]
    });
    fixture = TestBed.createComponent(CasesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
