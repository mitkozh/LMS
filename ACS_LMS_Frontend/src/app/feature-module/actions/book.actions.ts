
import { createAction, props } from '@ngrx/store';
import { BookFullDto } from 'app/shared/book-full-dto';

export const loadBook = createAction('[Book] Load Book', props<{ title: string }>());

export const setBook = createAction('[Book] Set Book', props<{ book: BookFullDto }>());
