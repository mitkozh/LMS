import { Component, Inject, Input, OnInit } from '@angular/core';
import { BookCategory } from './book-category';
import { GenericService } from 'app/core/generic.service';
import { Category } from 'app/shared/category';
import { HttpClient } from '@angular/common/http';
import { CategoryWithBooks } from 'app/shared/category-with-books';
import { UserRole } from 'app/shared/user-role';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCategoriesComponent } from 'app/components/partials/modal/add-categories/add-categories.component';
import { CategoryAddDto } from 'app/shared/category-add-dto';

@Component({
  selector: 'app-book-categories',
  templateUrl: './book-categories.component.html',
  styleUrls: ['./book-categories.component.scss'],
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
export class BookCategoriesComponent implements OnInit {
  ref: DynamicDialogRef | undefined;

  constructor(
    @Inject('categoryService')
    private categoryService: GenericService<
      Category,
      CategoryAddDto,
      CategoryWithBooks
    >,
    public dialogService: DialogService
  ) {}

  roles: typeof UserRole = UserRole;

  ngOnInit(): void {
    this.categoryService
      .getListDto()
      .subscribe(
        (categories: CategoryWithBooks[]) => (this.bookCategories = categories)
      );
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  bookCategories: CategoryWithBooks[] = [];

  generateCategoryLink(category: string): string {
    return `/categories/${encodeURIComponent(category)}`;
  }

  openBookAddModal() {
    this.ref = this.dialogService.open(AddCategoriesComponent, {
      header: 'Add category',
      width: '80%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closeOnEscape: false,
    });

    this.ref.onClose.subscribe(() => {
      console.log('close');
    });
  }
}
