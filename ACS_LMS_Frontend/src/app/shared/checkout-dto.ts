export interface CheckoutDto {
    id: number;
    startTime: Date;
    endTime: Date;
    holdEndTime: Date;
    returned: boolean;
    bookCopyId: number;
    borrowerId: number;
}
