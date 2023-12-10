import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericService } from 'app/core/generic.service';
import { Category } from 'app/shared/category';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { CategoryWithBooks } from 'app/shared/category-with-books';
import { ValidationMessages } from 'app/shared/validation-messages';
import { categoryValidationMessages } from './categories-validation-messages';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

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
export class AddCategoriesComponent implements OnInit{
  onSubmitEntity$!: EventEmitter<Category>;


  constructor(
    public categoryConfig: DynamicDialogConfig,
    private fb: FormBuilder,
    @Inject('categoryService')
    private categoryService: GenericService<
      Category,
      CategoryAddDto,
      CategoryWithBooks
    >
  ) {}
  ngOnInit(): void {
    this.onSubmitEntity$ = this.categoryConfig.data.onSubmitEntity$;
  }

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  categoryValidationMessages: ValidationMessages = categoryValidationMessages;


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
      this.categoryService.add(categoryData).subscribe((res:Category)=>{
        this.onSubmitEntity$.emit(res);
      });
    } else {
    }
  }
  getFormControlByName(name: string): FormControl | null {
    return this.form?.get(name) as FormControl | null;
  }
}
