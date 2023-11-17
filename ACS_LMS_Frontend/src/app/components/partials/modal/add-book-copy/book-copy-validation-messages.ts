import { ValidationMessages } from 'app/shared/validation-messages';

export const bookValidationMessages: ValidationMessages = {
  book: [{ type: 'required', message: 'Original book is required' }],
  volume: [
    { type: 'required', message: 'Volume is required' },
    { type: 'min', message: 'Volume must be a positive integer' },
  ],
  callNumber: [
    { type: 'required', message: 'Call number is required' },
    { type: 'maxlength', message: 'Call number must not exceed 50 characters' },
  ],
  inventoryNumber: [
    { type: 'required', message: 'Inventory number is required' },
    {
      type: 'maxlength',
      message: 'Inventory number must not exceed 50 characters',
    },
  ],
  schoolInventoryNumber: [
    { type: 'required', message: 'School inventory number is required' },
    {
      type: 'maxlength',
      message: 'School inventory number must not exceed 50 characters',
    },
  ],
  language: [{ type: 'required', message: 'Language is required' }],
  publisher: [{ type: 'required', message: 'Publisher is required' }],
  binding: [{ type: 'required', message: 'Binding is required' }],
  size: [{ type: 'maxlength', message: 'Size must not exceed 50 characters' }],
  publicationDate: [],
  edition: [{ type: 'required', message: 'Edition is required' }],
  isbn: [
    { type: 'required', message: 'ISBN is required' },
    { type: 'pattern', message: 'ISBN must be a 10 or 13-digit number' },
  ],
  notes: [
    { type: 'maxlength', message: 'Notes must not exceed 255 characters' },
  ],
  acquisitionDocumentEnum: [
    { type: 'required', message: 'Acquisition document is required' },
  ],
};
