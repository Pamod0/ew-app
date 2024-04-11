import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDashboardComponent } from './list-dashboard.component';

describe('ListDashboardComponent', () => {
  let component: ListDashboardComponent;
  let fixture: ComponentFixture<ListDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDashboardComponent]
    });
    fixture = TestBed.createComponent(ListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
