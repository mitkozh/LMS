import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreByAuthorComponent } from './more-by-author.component';

describe('MoreByAuthorComponent', () => {
  let component: MoreByAuthorComponent;
  let fixture: ComponentFixture<MoreByAuthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoreByAuthorComponent]
    });
    fixture = TestBed.createComponent(MoreByAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
