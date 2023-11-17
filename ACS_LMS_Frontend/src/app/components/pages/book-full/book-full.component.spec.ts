import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFullComponent } from './book-full.component';

describe('BookFullComponent', () => {
  let component: BookFullComponent;
  let fixture: ComponentFixture<BookFullComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookFullComponent]
    });
    fixture = TestBed.createComponent(BookFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
