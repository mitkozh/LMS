export interface CheckoutWithFineDto {
  id: number;
  bookName: string;
  bookCopyId: number;
  userEmail: string;
  fineAmount: number;
  startTime: Date;
  holdEndTime: Date;
  late: boolean;
}
