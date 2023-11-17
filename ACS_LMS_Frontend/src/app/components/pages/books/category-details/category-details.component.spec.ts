import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDetailsComponent } from './category-details.component';


describe('CategoryDetailsComponent', () => {
  let component: CategoryDetailsComponent;
  let fixture: ComponentFixture<CategoryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryDetailsComponent]
    });
    fixture = TestBed.createComponent(CategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
