import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNewUserComponent } from './search-new-user.component';

describe('SearchCardTypeComponent', () => {
  let component: SearchNewUserComponent;
  let fixture: ComponentFixture<SearchNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNewUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
