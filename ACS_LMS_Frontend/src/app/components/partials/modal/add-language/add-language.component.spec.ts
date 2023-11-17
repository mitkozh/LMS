import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanguageComponent } from './add-language.component';

describe('AddLanguageComponent', () => {
  let component: AddLanguageComponent;
  let fixture: ComponentFixture<AddLanguageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLanguageComponent]
    });
    fixture = TestBed.createComponent(AddLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
