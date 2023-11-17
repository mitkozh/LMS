import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherEditionsComponent } from './other-editions.component';

describe('OtherEditionsComponent', () => {
  let component: OtherEditionsComponent;
  let fixture: ComponentFixture<OtherEditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherEditionsComponent]
    });
    fixture = TestBed.createComponent(OtherEditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
