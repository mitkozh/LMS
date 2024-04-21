import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentOutComponent } from './rent-out.component';

describe('RentOutComponent', () => {
  let component: RentOutComponent;
  let fixture: ComponentFixture<RentOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentOutComponent]
    });
    fixture = TestBed.createComponent(RentOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
