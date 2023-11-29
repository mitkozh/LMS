import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { login, logout, setUserProfile } from './auth.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        switchMap(() => this.keycloakService.login())
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() =>
        from(this.keycloakService.logout()).pipe(
          map(() => logout()),
          catchError((error) => of({ type: '[Auth API] Logout Failed', error }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private keycloakService: KeycloakService
  ) {}
}
