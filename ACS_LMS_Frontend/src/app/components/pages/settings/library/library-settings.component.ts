import { EnvironmentService } from './../../../../core/environment.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnvironmentDto } from 'app/shared/environment-dto';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'library-settings',
  templateUrl: './library-settings.component.html',
  styleUrls: ['./library-settings.component.scss'],
})
export class LibrarySettingsComponent {
  currentCurrency: string = 'BGN';
  initialEnv: EnvironmentDto | undefined;
  constructor(
    private fb: FormBuilder,
    private environmentService: EnvironmentService
  ) {}

  environmentForm: FormGroup = this.fb.group({
    fineRatePerDay: [],
    currencyCode: [],
    backupsOptions: [],
    maxCheckoutDurationDays: [],
    maxBooksPerUser: [],
  });

  ngOnInit() {
    this.environmentService.getEnvironment().subscribe((environment) => {
      this.initialEnv = { ...environment };

      delete this.initialEnv.id;
      this.environmentForm.patchValue(environment);
      this.currentCurrency = this.environmentForm.get('currencyCode')?.value;

      this.environmentForm
        .get('currencyCode')
        ?.valueChanges.subscribe((currencyCode) => {
          console.log(currencyCode);
          this.currentCurrency = currencyCode;
        });
    });
  }

  onSubmit() {
    if (this.environmentForm.valid) {
      this.environmentService
        .updateEnvironment(this.environmentForm.value)
        .subscribe(
          (response) => {
            window.location.reload();
          },
          (error) => {
            console.error('There was an error with the update!', error);
          }
        );
    }
  }

  checkIfInitialEnvIsTheSameAsCurrent(): boolean {
    return (
      JSON.stringify(this.initialEnv) ===
      JSON.stringify(this.environmentForm.value)
    );
  }

  backupsOptions: SelectItem[] = [
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ];

  currencyCodes: SelectItem[] = [
    { label: 'EUR', value: 'EUR' },
    { label: 'USD', value: 'USD' },
    { label: 'BGN', value: 'BGN' },
  ];
}
