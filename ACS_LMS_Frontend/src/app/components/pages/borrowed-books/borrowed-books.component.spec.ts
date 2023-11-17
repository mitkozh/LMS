import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedBooksComponent } from './borrowed-books.component';

describe('BorrowedBooksComponent', () => {
  let component: BorrowedBooksComponent;
  let fixture: ComponentFixture<BorrowedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowedBooksComponent]
    });
    fixture = TestBed.createComponent(BorrowedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
