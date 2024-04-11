import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectPolicyComponent } from './multi-select-policy.component';

describe('MultiSelectPolicyComponent', () => {
  let component: MultiSelectPolicyComponent;
  let fixture: ComponentFixture<MultiSelectPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
