import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardMiniComponent } from './book-card-mini.component';

describe('BookCardMiniComponent', () => {
  let component: BookCardMiniComponent;
  let fixture: ComponentFixture<BookCardMiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookCardMiniComponent]
    });
    fixture = TestBed.createComponent(BookCardMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
