import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardMediumComponent } from './book-card-medium.component';

describe('BookCardMediumComponent', () => {
  let component: BookCardMediumComponent;
  let fixture: ComponentFixture<BookCardMediumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookCardMediumComponent]
    });
    fixture = TestBed.createComponent(BookCardMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
