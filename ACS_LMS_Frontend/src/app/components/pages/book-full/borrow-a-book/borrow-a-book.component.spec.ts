import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowABookComponent } from './borrow-a-book.component';

describe('BorrowABookComponent', () => {
  let component: BorrowABookComponent;
  let fixture: ComponentFixture<BorrowABookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowABookComponent]
    });
    fixture = TestBed.createComponent(BorrowABookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
