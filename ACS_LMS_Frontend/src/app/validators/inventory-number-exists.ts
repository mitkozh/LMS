import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { BookService } from 'app/core/book.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export function inventoryNumberExists(service: BookService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const inventoryNumber = control.value;

    if (control.pristine) {
      return of(null);
    }
    if (!inventoryNumber) {
      return of(null);
    }
    return of(inventoryNumber).pipe(
      debounceTime(500),
      switchMap((inventoryNumber: string) => {
        return service.checkForInventoryNumber(inventoryNumber).pipe(
          map((exists) => {
            return exists ? { inventoryNumberExists: true } : null;
          }),
          catchError((error) => {
            return of(null);
          })
        );
      })
    );
  };
}
