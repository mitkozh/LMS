import { Injectable } from '@angular/core';
import { mergeMap, map } from 'rxjs/operators';
import { BookService } from 'app/core/book.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BookActions from '../actions/book.actions';

@Injectable()
export class BookEffects {
  loadBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBook),
      mergeMap(({ title }) =>
        this.bookService.getBookFullByTitle(title).pipe(
          map((book) => BookActions.setBook({ book })),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private bookService: BookService) {}
}