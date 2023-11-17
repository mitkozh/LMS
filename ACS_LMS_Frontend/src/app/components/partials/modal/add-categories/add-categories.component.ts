import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GenericService } from 'app/core/generic.service';
import { Category } from 'app/shared/category';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { CategoryWithBooks } from 'app/shared/category-with-books';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss'],
  providers: [
    {
      provide: 'categoryService',
      useFactory: (http: HttpClient) =>
        new GenericService<Category, CategoryAddDto, CategoryWithBooks>(http, {
          resourceEndpoint: 'categories',
        }),
      deps: [HttpClient],
    },
  ],
})
export class AddCategoriesComponent {
  constructor(
    private fb: FormBuilder,
    @Inject('categoryService')
    private categoryService: GenericService<
      Category,
      CategoryAddDto,
      CategoryWithBooks
    >
  ) {}

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  private mapFormToCategoryAddDto(formValue: any): CategoryAddDto {
    return {
      name: formValue.name || '',
      description: formValue.description || '',
    };
  }

  onSubmit() {
    if (this.form.valid) {
      const categoryData: CategoryAddDto = this.mapFormToCategoryAddDto(
        this.form.value
      );
      this.categoryService.add(categoryData).subscribe(res=>console.log(res));
    } else {
    }
  }
}
