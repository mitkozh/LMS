import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuComponent } from './sublevel-menu.component';

describe('SublevelMenuComponent', () => {
  let component: SublevelMenuComponent;
  let fixture: ComponentFixture<SublevelMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SublevelMenuComponent]
    });
    fixture = TestBed.createComponent(SublevelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
