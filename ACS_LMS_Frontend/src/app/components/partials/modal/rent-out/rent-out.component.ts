import { rentOutValidationMessages } from './rent-out-validation-messages';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BookService } from 'app/core/book.service';
import { ReservationDto } from 'app/shared/reservation-dto';
import { ValidationMessages } from 'app/shared/validation-messages';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { userExistsValidator } from '../../../../validators/user-exists-validator';
import { UserService } from 'app/core/user.service';
import { futureDateValidator } from 'app/validators/future-date-validator';
import { endDateAfterStartDateValidator } from 'app/validators/end-date-after-start-date-validator';
import { AddRentOutDto } from './add-rent-out-dto';
import { CheckoutService } from 'app/core/checkout.service';
import { CheckoutDto } from 'app/shared/checkout-dto';
import { BookShortDto } from 'app/shared/book-short-dto';

@Component({
  selector: 'app-rent-out',
  templateUrl: './rent-out.component.html',
  styleUrls: ['./rent-out.component.scss'],
})
export class RentOutComponent implements OnInit {
  bookId: number | undefined;
  user: string | undefined;
  bookCopyId: string | undefined;
  reservationId: number | undefined;
  onSubmitEntity$!: EventEmitter<CheckoutDto>;

  bookCopies: Number[] = [];
  filteredBookCopies: number[] = [];

  isBookDisabled: boolean = false;
  isBookCopyIdDisabled: boolean = false;
  isUserDisabled: boolean = false;

  rentOutForm = this.fb.group({
    user: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [userExistsValidator(this.userService)],
        updateOn: 'blur',
      },
    ],
    book: [null, Validators.required],
    bookCopyId: [''],
    startDate: ['', [Validators.required, futureDateValidator()]],
    holdEndDate: [
      '',
      [
        Validators.required,
        futureDateValidator(),
        endDateAfterStartDateValidator('startDate'),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    public rentOutConfig: DynamicDialogConfig,
    private userService: UserService,
    private checkoutService: CheckoutService
  ) {}
  noBooksResultMessage: string = '';
  rentOutValidationMessages: ValidationMessages = rentOutValidationMessages;
  private _booksSearchResults$ = new BehaviorSubject<any>([]);
  public booksSearchResults = this._booksSearchResults$.asObservable();
  private _booksLoading = new BehaviorSubject<boolean>(false);
  public booksLoading = this._booksLoading.asObservable();

  ngOnInit() {
    this.rentOutForm.get('startDate')?.valueChanges.subscribe(() => {
      if (this.rentOutForm.get('holdEndDate')?.value) {
        let control = this.getFormControlByName('holdEndDate');
        control?.updateValueAndValidity();
        control?.markAllAsTouched();
      }
    });
    this.bookId = this.rentOutConfig.data.bookId;
    this.bookCopyId = this.rentOutConfig.data.bookCopyId;
    this.user = this.rentOutConfig.data.user;
    this.reservationId = this.rentOutConfig.data.reservationId;

    if (this.bookId) {
      this.bookService.getByIdAndRecieveDto(this.bookId).subscribe((book) => {
        this.rentOutForm.patchValue({ book: book as any });
        this.isBookDisabled = true;
        this.bookService
          .getFreeBookCopiesById(book.id)
          .subscribe((bookCopies) => {
            this.bookCopies = bookCopies;
          });
      });
      this.rentOutForm.get('book')?.valueChanges.subscribe((book: any) => {
        if (book) {
          this.bookService
            .getFreeBookCopiesById(book.id)
            .subscribe((bookCopies) => {
              this.bookCopies = bookCopies;
            });
          console.log(this.bookCopies);
        }
      });

      if (this.bookCopyId) {
        this.rentOutForm.patchValue({ bookCopyId: this.bookCopyId });
        this.isBookCopyIdDisabled = true;
        console.log(this.isBookCopyIdDisabled);
      }

      if (this.user) {
        this.rentOutForm.patchValue({ user: this.user });
        this.isUserDisabled = true;
      }
    }
  }

  onBooksTextChange(changedText: string): void {
    if (changedText && changedText.length < 2) {
      this._booksSearchResults$.next([]);
      this._booksLoading.next(false);
      this.isBookCopyIdDisabled = true;
      return;
    }

    this._booksLoading.next(true);
    if (typeof changedText === 'string') {
      of(changedText)
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((changedText) =>
            this.bookService.getResultsDtoByName(changedText)
          )
        )
        .subscribe(
          (bookResults) => {
            if (!bookResults || bookResults.length === 0) {
              this.noBooksResultMessage =
                'No books found with the specified name.';
              this._booksSearchResults$.next([]);
              this.isBookCopyIdDisabled = true;
            } else {
              this.noBooksResultMessage = '';
              this._booksSearchResults$.next(bookResults || []);
              this.isBookCopyIdDisabled = false;
            }
            this._booksLoading.next(false);
          },
          (error) => {
            console.error(error);
            this._booksLoading.next(false);
            this._booksSearchResults$.next([]);
            this.isBookCopyIdDisabled = true;
          }
        );
    }
  }

  filterBookCopies(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.bookCopies.length; i++) {
      let bookCopy = this.bookCopies[i];
      if (typeof query === 'string') {
        if (
          bookCopy.toString().toLowerCase().indexOf(query.toLowerCase()) === 0
        ) {
          filtered.push(bookCopy);
        }
      } else if (typeof query === 'number') {
        if (bookCopy === query) {
          filtered.push(bookCopy);
        }
      }
    }
    this.filteredBookCopies = filtered;
  }

  getFormControlByName(name: string): FormControl | null {
    return this.rentOutForm?.get(name) as FormControl | null;
  }
  // booksCancelPendingRequests() {
  //   this.authorRequestsSubscription.forEach((sub) => sub.unsubscribe());
  // }

  onSubmit() {
    if (this.rentOutForm.valid) {
      const addRentoutData: AddRentOutDto = this.mapFormToAddRentOutDto(
        this.rentOutForm.getRawValue()
      );
      this.checkoutService
        .addAndRecieveDto(addRentoutData)
        .subscribe((checkout: CheckoutDto) => {
          this.onSubmitEntity$.emit(checkout);
          console.log(this.onSubmitEntity$);
        });
    } else {
      this.updateValueAndValiditityOfAllControls();
    }
  }

  mapFormToAddRentOutDto(formValue: any): AddRentOutDto {
    console.log(formValue);
    const addRentoutData: AddRentOutDto = {
      user: formValue.user,
      bookId: formValue.book.id,
      bookCopyId: formValue.bookCopyId,
      startTime: formValue.startDate,
      holdEndTime: formValue.holdEndDate,
      reservationId: this.reservationId,
    };
    return addRentoutData;
  }

  updateValueAndValiditityOfAllControls() {
    Object.keys(this.rentOutForm.controls).forEach((field) => {
      let control = this.getFormControlByName(field);
      control?.updateValueAndValidity();
      control?.markAllAsTouched();
    });
  }
}
