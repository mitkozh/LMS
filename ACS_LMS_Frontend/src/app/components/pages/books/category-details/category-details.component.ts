import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'app/core/category.service';
import { GenericService } from 'app/core/generic.service';
import { Category } from 'app/shared/category';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { CategoryWithBooks } from 'app/shared/category-with-books';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss'],
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
export class CategoryDetailsComponent {
  books: CategoryWithBooks | undefined;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      const lastSegment = segments[segments.length - 1];
      const categoryName = this.extractCategoryNameFromLink(
        lastSegment.toString()
      );

      this.isLoading = true;
      this.categoryService
        .getByNameDto(categoryName)
        .pipe(
          catchError(() => {
            this.router.navigate(['/not-found']);
            return [];
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((books: CategoryWithBooks) => {
          this.books = books;
        });
    });
  }

  private extractCategoryNameFromLink(category: string): string {
    return decodeURIComponent(category);
  }
}
