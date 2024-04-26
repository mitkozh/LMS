import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySettingsComponent } from './library-settings.component';

describe('SettingsComponent', () => {
  let component: LibrarySettingsComponent;
  let fixture: ComponentFixture<LibrarySettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrarySettingsComponent]
    });
    fixture = TestBed.createComponent(LibrarySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
