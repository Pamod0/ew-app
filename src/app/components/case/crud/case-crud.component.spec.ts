import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCrudComponent } from './case-crud.component';

describe('CrudComponent', () => {
  let component: CaseCrudComponent;
  let fixture: ComponentFixture<CaseCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaseCrudComponent]
    });
    fixture = TestBed.createComponent(CaseCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
