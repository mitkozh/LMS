import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from 'app/core/user.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export function userExistsValidator(service: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    if (control.pristine) {
      return of(null);
    }
    if (!email) {
      return of(null);
    }

    return of(email).pipe(
      debounceTime(500),
      switchMap((email: string) => {
        return service.checkUserExist(email).pipe(
          map((exists) => {
            return exists ? null : { userNotExists: true };
          }),
          catchError(() => {
            return of(null);
          })
        );
      })
    );
  };
}
