import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaseComponent } from './case-list.component';

describe('ListComponent', () => {
  let component: ListCaseComponent;
  let fixture: ComponentFixture<ListCaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCaseComponent]
    });
    fixture = TestBed.createComponent(ListCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
