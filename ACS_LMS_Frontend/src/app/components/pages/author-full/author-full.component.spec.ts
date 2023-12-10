import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorFullComponent } from './author-full.component';

describe('AuthorFullComponent', () => {
  let component: AuthorFullComponent;
  let fixture: ComponentFixture<AuthorFullComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorFullComponent]
    });
    fixture = TestBed.createComponent(AuthorFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
