import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBookComponent } from './delete-book.component';

describe('DeleteBookComponent', () => {
  let component: DeleteBookComponent;
  let fixture: ComponentFixture<DeleteBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteBookComponent]
    });
    fixture = TestBed.createComponent(DeleteBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
