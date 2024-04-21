export interface AddRentOutDto {
    startTime: Date;
    holdEndTime: Date;
    bookId: number;
    bookCopyId?: number;
    user: string;
    reservationId?: number; 
  }