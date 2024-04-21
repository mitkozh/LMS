import { ValidationMessages } from 'app/shared/validation-messages';

export const authorValidationMessages: ValidationMessages = {
  name: [
    { type: 'required', message: 'Name is required' },
    { type: 'maxlength', message: 'Name must not exceed 100 characters' },
  ],
  description: [
    { type: 'maxlength', message: 'Description must not exceed 100 characters' },
  ],
};