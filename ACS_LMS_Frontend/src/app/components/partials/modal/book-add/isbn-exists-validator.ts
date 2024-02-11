import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
  } from '@angular/forms';
  import { BookService } from 'app/core/book.service';
  import { Observable, of } from 'rxjs';
  import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
  
  export function isbnExistsValidator(
    service: BookService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const isbn = control.value;
  
      if (control.pristine) {
        return of(null);
      }
      if (!isbn) {
        return of(null);
      }
      return of(isbn).pipe(
        debounceTime(500),
        switchMap((isbn: string) => {
          return service.checkForISBN(isbn).pipe(
            map((exists) => {
              return exists ? { isbnExists: true } : null;
            }),
            catchError((error) => {
              return of(null);
            })
          );
        })
      );
    };
  }
  