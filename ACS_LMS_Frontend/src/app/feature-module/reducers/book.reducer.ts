
import { createReducer, on } from '@ngrx/store';
import * as BookActions from '../actions/book.actions';
import { BookFullDto } from 'app/shared/book-full-dto';

export interface BookState {
  book: BookFullDto | undefined;
}

export const initialState: BookState = {
  book: undefined,
};

export const bookReducer = createReducer(
  initialState,
  on(BookActions.setBook, (state, { book }) => ({ ...state, book })),
);