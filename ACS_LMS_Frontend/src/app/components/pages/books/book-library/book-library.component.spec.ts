import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLibraryComponent } from './book-library.component';

describe('BookLibraryComponent', () => {
  let component: BookLibraryComponent;
  let fixture: ComponentFixture<BookLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookLibraryComponent]
    });
    fixture = TestBed.createComponent(BookLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
