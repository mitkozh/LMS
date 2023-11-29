import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { BookService } from 'app/core/book.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export function callNumberExistsValidator(
  service: BookService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const callNumber = control.value;

    if (control.pristine) {
      return of(null);
    }
    if (!callNumber) {
      return of(null);
    }
    return of(callNumber).pipe(
      debounceTime(500),
      switchMap((callNumber: string) => {
        return service.checkForCallNumber(callNumber).pipe(
          map((exists) => {
            return exists ? { callNumberExists: true } : null;
          }),
          catchError((error) => {
            return of(null);
          })
        );
      })
    );
  };
}
