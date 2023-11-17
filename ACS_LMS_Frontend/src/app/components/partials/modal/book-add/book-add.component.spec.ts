import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddComponent } from './book-add.component';

describe('BookAddComponent', () => {
  let component: BookAddComponent;
  let fixture: ComponentFixture<BookAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookAddComponent]
    });
    fixture = TestBed.createComponent(BookAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
