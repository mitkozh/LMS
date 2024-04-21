import { ValidationMessages } from 'app/shared/validation-messages';

export const rentOutValidationMessages: ValidationMessages = {
  startDate: [
    { type: 'required', message: 'Start time is required' },
    { type: 'pastDate', message: 'Date must be in the future' },
  ],
  holdEndDate: [
    { type: 'required', message: 'Hold end time is required' },
    {
      type: 'endDateBeforeStartDate',
      message: 'End date must be after start date',
    },
    { type: 'pastDate', message: 'Date must be in the future' },
  ],
  book: [{ type: 'required', message: 'Book is required' }],
  user: [
    { type: 'required', message: 'User is required' },
    { type: 'userNotExists', message: 'User does not exist in the system' },
  ],
};
