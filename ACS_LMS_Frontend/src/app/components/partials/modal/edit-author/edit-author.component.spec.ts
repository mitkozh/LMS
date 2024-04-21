import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuthorComponent } from './edit-author.component';

describe('EditAuthorComponent', () => {
  let component: EditAuthorComponent;
  let fixture: ComponentFixture<EditAuthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAuthorComponent]
    });
    fixture = TestBed.createComponent(EditAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
