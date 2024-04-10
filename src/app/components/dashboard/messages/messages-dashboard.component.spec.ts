import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesDashboardComponent } from './messages-dashboard.component';

describe('MessagesDashboardComponent', () => {
  let component: MessagesDashboardComponent;
  let fixture: ComponentFixture<MessagesDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesDashboardComponent]
    });
    fixture = TestBed.createComponent(MessagesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
