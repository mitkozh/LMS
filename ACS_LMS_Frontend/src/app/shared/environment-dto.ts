export interface EnvironmentDto {
  id?: number;
  fineRatePerDay: number;
  currencyCode: CurrencyCode;
  backupsOptions: BackupsOptions;
  maxCheckoutDurationDays: number;
  maxBooksPerUser: number;
}

export enum CurrencyCode {
  EUR = 'EUR',
  USD = 'USD',
  BGN = 'BGN',
}

export enum BackupsOptions {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  MANUAL = 'MANUAL',
}
