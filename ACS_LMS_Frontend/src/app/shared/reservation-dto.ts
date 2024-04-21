export interface ReservationDto {
    id: number;
    userEmail: string;
    bookCopyId: number;
    reservationDate: Date;
    dueDate: Date;
    bookId: number;  
    bookName: string;
  }
  