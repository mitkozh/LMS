// app/feature-module/actions/book.actions.ts

import { createAction, props } from '@ngrx/store';
import { BookFullDto } from 'app/shared/book-full-dto';

// Load Book Action
export const loadBook = createAction('[Book] Load Book', props<{ title: string }>());

// Set Book Action
export const setBook = createAction('[Book] Set Book', props<{ book: BookFullDto }>());
