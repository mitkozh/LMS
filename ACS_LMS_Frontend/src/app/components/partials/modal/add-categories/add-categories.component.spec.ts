import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoriesComponent } from './add-categories.component';

describe('AddCategoriesComponent', () => {
  let component: AddCategoriesComponent;
  let fixture: ComponentFixture<AddCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCategoriesComponent]
    });
    fixture = TestBed.createComponent(AddCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
