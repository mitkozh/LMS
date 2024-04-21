import { FormControl } from '@angular/forms';

export function endDateAfterStartDateValidator(startControlName: string) {
  return (control: FormControl) => {
    const startDateControl = control.parent?.get(startControlName);
    if (!startDateControl || !startDateControl.value) return null;

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);

    if (endDate <= startDate) {
      return { endDateBeforeStartDate: true };
    }

    return null;
  };
}
