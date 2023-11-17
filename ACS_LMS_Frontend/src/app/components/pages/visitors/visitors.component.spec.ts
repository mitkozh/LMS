import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsComponent } from './visitors.component';

describe('VisitorsComponent', () => {
  let component: VisitorsComponent;
  let fixture: ComponentFixture<VisitorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorsComponent]
    });
    fixture = TestBed.createComponent(VisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
