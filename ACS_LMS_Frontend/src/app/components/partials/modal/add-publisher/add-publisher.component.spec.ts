import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublisherComponent } from './add-publisher.component';

describe('AddPublisherComponent', () => {
  let component: AddPublisherComponent;
  let fixture: ComponentFixture<AddPublisherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPublisherComponent]
    });
    fixture = TestBed.createComponent(AddPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
