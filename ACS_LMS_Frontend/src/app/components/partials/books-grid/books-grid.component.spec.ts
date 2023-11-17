import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksGridComponent } from './books-grid.component';

describe('BooksGridComponent', () => {
  let component: BooksGridComponent;
  let fixture: ComponentFixture<BooksGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksGridComponent]
    });
    fixture = TestBed.createComponent(BooksGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
