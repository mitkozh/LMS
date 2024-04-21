import { FormControl } from '@angular/forms';

export function futureDateValidator() {
  return (control: FormControl) => {
    const selectedDate = control.value;
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate).getTime();
    const currentDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ).getTime();

    if (selectedDateTime < currentDateTime) {
      return { pastDate: true };
    }

    return null;
  };
}
