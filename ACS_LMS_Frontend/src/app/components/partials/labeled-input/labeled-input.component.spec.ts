import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeledInputComponent } from './labeled-input.component';

describe('LabeledInputComponent', () => {
  let component: LabeledInputComponent;
  let fixture: ComponentFixture<LabeledInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabeledInputComponent]
    });
    fixture = TestBed.createComponent(LabeledInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
