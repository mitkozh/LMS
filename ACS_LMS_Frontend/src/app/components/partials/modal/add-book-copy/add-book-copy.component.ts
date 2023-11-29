import {
  Component,
  EventEmitter,
  Inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { BookFullDto } from 'app/shared/book-full-dto';
import { BookShortDto } from 'app/shared/book-short-dto';
import { SearchInputComponent } from '../../search-input/search-input.component';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ValidationMessages } from 'app/shared/validation-messages';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { bookValidationMessages } from './book-copy-validation-messages';
import { BookService } from 'app/core/book.service';
import { ImageService } from 'app/core/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GenericService } from 'app/core/generic.service';
import { Language } from 'app/shared/language';
import { Publisher } from 'app/shared/publisher';
import { AddPublisherDto } from '../add-publisher/add-publisher-dto';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { Category } from 'app/shared/category';
import { AddLanguageComponent } from '../add-language/add-language.component';
import { AddPublisherComponent } from '../add-publisher/add-publisher.component';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BookCopyAddDto } from './book-copy-add-dto';
import { PublisherService } from 'app/core/publisher.service';
import { AcquisitionDocumentEnum } from 'app/shared/acquasition-document-enum';
import { BookBindingEnum } from 'app/shared/book-binding-enum';
import { LanguageService } from 'app/core/language.service';

@Component({
  selector: 'app-add-book-copy',
  templateUrl: './add-book-copy.component.html',
  styleUrls: ['./add-book-copy.component.scss'],
})
export class AddBookCopyComponent implements OnInit {
  onSubmitEntity$!: EventEmitter<BookFullDto>;
  @ViewChild(SearchInputComponent)
  private publisherSearchInputComponent: SearchInputComponent | undefined;
  ref1: DynamicDialogRef | undefined;
  ref3: DynamicDialogRef | undefined;
  ref4: DynamicDialogRef | undefined;
  private _publisherSearchResults$ = new BehaviorSubject<any>('');
  public publisherSearchResults = this._publisherSearchResults$.asObservable();
  private _publisherLoading$ = new BehaviorSubject<boolean>(false);
  public publisherLoading$ = this._publisherLoading$.asObservable();
  private _booksSearchResults$ = new BehaviorSubject<any>([]);
  public booksSearchResults = this._booksSearchResults$.asObservable();
  private _booksLoading = new BehaviorSubject<boolean>(false);
  public booksLoading = this._booksLoading.asObservable();
  noBooksResultMessage: string = '';
  coverPhotoName: string | undefined;
  coverPhoto: any | undefined;
  bookValidationMessages: ValidationMessages = bookValidationMessages;
  form: FormGroup;

  constructor(
    private bookService: BookService,
    private publisherService: PublisherService,
    private languageService: LanguageService,

    public dialogService: DialogService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public config: DynamicDialogConfig
  ) {
    this.form = this.fb.group({
      book: [null, { validators: [Validators.required], updateOn: 'blur' }],
      callNumber: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'blur',
        },
      ],
      inventoryNumber: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'blur',
        },
      ],
      price: [null, { updateOn: 'blur' }],
      schoolInventoryNumber: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'blur',
        },
      ],
      language: [null, { validators: [Validators.required], updateOn: 'blur' }],
      publisher: [
        null,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      binding: [null, { validators: [Validators.required], updateOn: 'blur' }],
      size: [
        null,
        { validators: [Validators.maxLength(50)], updateOn: 'blur' },
      ],
      publicationDate: [null, { updateOn: 'blur' }],
      edition: [null, { validators: [Validators.required], updateOn: 'blur' }],
      isbn: [
        null,
        {
          validators: [
            Validators.required,
            Validators.pattern('\\d{10}|\\d{13}'),
          ],
          updateOn: 'blur',
        },
      ],
      notes: [
        null,
        { validators: [Validators.maxLength(255)], updateOn: 'blur' },
      ],
      acquisitionDocumentEnum: [
        null,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
    });
  }
  ngOnInit(): void {
    this.onSubmitEntity$ = this.config.data.onSubmitEntity$;
    console.log(this.onSubmitEntity$);
    this.languageService
      .getList()
      .subscribe((languages: Language[] | undefined) => {
        this.languages = languages;
      });

    this.form
      .get('book')
      ?.valueChanges.pipe(
        switchMap((selectedBook: BookShortDto | null) => {
          if (selectedBook) {
            return this.bookService.getBookFullByTitle(selectedBook.title);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((bookFull: BookFullDto | null) => {
        if (bookFull) {
          this.updateFormFields(bookFull);
        }
      });
  }

  bookId: number | undefined;
  authorRequestsSubscription: Subscription[] = [];
  publisherRequestSubscription: Subscription[] = [];
  languages: Language[] | undefined;
  publishers: Publisher[] | undefined;
  books: BookShortDto[] | undefined;
  acquisitionDocuments: AcquisitionDocumentEnum[] = [
    AcquisitionDocumentEnum.Donation,
    AcquisitionDocumentEnum.Protocol,
  ];
  bindings: BookBindingEnum[] = [BookBindingEnum.hc, BookBindingEnum.pb];
  filteredLanguages: string[] = [];
  filteredAcquisitions: string[] = [];
  filteredBindings: string[] = [];
  onSubmitPublisherEntity$ = new EventEmitter<Publisher>();
  onSubmitLanguageEntity$ = new EventEmitter<Language>();
  noPublisherResultMessage: string = '';
  noLanguageResultMessage: string = '';

  private mapFormToBookCopyAddDto(formValue: any): BookCopyAddDto {
    return {
      bookId: this.getEntitiesById(formValue.book) || null,
      callNumber: formValue.callNumber?.trim() || '',
      inventoryNumber: formValue.inventoryNumber?.trim() || '',
      price: formValue.price || null,
      schoolInventoryNumber: formValue.schoolInventoryNumber?.trim() || null,
      language: formValue.language,
      publisher: this.getEntitiesById(formValue.publisher) || null,
      binding: formValue.binding,
      size: formValue.size || null,
      publicationDate: formValue.publicationDate || null,
      edition: formValue.edition?.trim() || '',
      isbn: formValue.isbn?.trim() || '',
      notes: formValue.notes?.trim() || null,
      acquisitionDocumentEnum: formValue.acquisitionDocumentEnum || null,
    };
  }

  private updateFormFields(selectedBook: BookFullDto): void {
    this.getPublisherById(selectedBook.publisherId);
    this.form.patchValue({
      callNumber: selectedBook.callNumber,
      inventoryNumber: selectedBook.inventoryNumber,
      price: selectedBook.price,
      schoolInventoryNumber: selectedBook.schoolInventoryNumber,
      language: selectedBook.language,
      binding: selectedBook.binding,
      size: selectedBook.size,
      publicationDate: selectedBook.publicationDate,
      edition: selectedBook.edition,
      isbn: selectedBook.isbn,
      notes: selectedBook.notes,
      acquisitionDocumentEnum: selectedBook.acquisitionDocument,
    });
  }

  private getPublisherById(id: number) {
    this.publisherService
      .getByIdAndRecieveDto(id)
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((recievedPublisher) =>
        this.form.patchValue({ publisher: recievedPublisher })
      );
  }

  private getEntitiesById(entities: any[] | any) {
    if (Array.isArray(entities)) {
      return entities.map((el) => el.id);
    }
    return entities.id;
  }

  onPublisherTextChange(changedText: string): void {
    this.publisherCancelPendingRequests();
    if (changedText && changedText.length < 2) {
      this._publisherSearchResults$.next([]);
      this._publisherLoading$.next(false);
      return;
    }

    console.log(this.form.value.authors);

    this._publisherLoading$.next(true);

    if (typeof changedText === 'string') {
      this.publisherService
        .getResultsDtoByName(changedText)
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(
          (publisherResult) => {
            if (!publisherResult) {
              this.noPublisherResultMessage =
                'No publishers found with the specified name.';
              this._publisherSearchResults$.next([]);
            } else {
              this.noPublisherResultMessage = '';
              this._publisherSearchResults$.next(publisherResult);
            }
            console.log(this.noPublisherResultMessage);
            this._publisherLoading$.next(false);
          },
          (error) => {
            console.error(error);
            this._publisherSearchResults$.next([]);
            this._publisherLoading$.next(false);
          }
        );
    }
  }

  getProfilePhoto(imageId: number): Observable<SafeUrl> {
    if (imageId) {
      return this.imageService
        .getImage(imageId)
        .pipe(
          map((res) =>
            this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res))
          )
        );
    } else {
      return of(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=='
      );
    }
  }

  onBooksTextChange(changedText: string): void {
    this.booksCancelPendingRequests();

    if (changedText && changedText.length < 2) {
      this._booksSearchResults$.next([]);
      this._booksLoading.next(false);
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
            } else {
              this.noBooksResultMessage = '';
              this._booksSearchResults$.next(bookResults || []);
            }
            this._booksLoading.next(false);
            console.log(this.form.value.authors);
          },
          (error) => {
            console.error(error);
            this._booksLoading.next(false);
            this._booksSearchResults$.next([]);
          }
        );
    }
  }

  booksCancelPendingRequests() {
    this.authorRequestsSubscription.forEach((sub) => sub.unsubscribe());
  }

  filterLanguages(event: AutoCompleteCompleteEvent) {
    let filtered: string[] = [];
    let query = event.query;

    for (let i = 0; i < (this.languages as any[]).length; i++) {
      let language = (this.languages as any[])[i];
      if (
        language.languageCode.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(language.languageCode);
      }
    }
    if (filtered.length > 0) {
      this.noLanguageResultMessage = '';
    } else {
      this.noLanguageResultMessage =
        'No languages found with the same language code';
    }

    this.filteredLanguages = filtered;
  }

  filterBinding(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.toLowerCase();

    for (let i = 0; i < (this.bindings as any[]).length; i++) {
      let binding = (this.bindings as any[])[i];
      if (binding.toLowerCase().indexOf(query) === 0) {
        filtered.push(binding);
      }
    }

    console.log(filtered);

    this.filteredBindings = filtered;
  }

  filterAquistion(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.toLowerCase();

    for (let i = 0; i < (this.acquisitionDocuments as any[]).length; i++) {
      let acquisition = (this.acquisitionDocuments as any[])[i];
      if (acquisition.toLowerCase().indexOf(query) === 0) {
        filtered.push(acquisition);
      }
    }

    console.log(filtered);

    this.filteredAcquisitions = filtered;
  }

  openPublisherAddModal() {
    this.ref3 = this.dialogService.open(AddPublisherComponent, {
      header: 'Add publisher',
      width: 'min(400px, 40%)',
      height: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1002,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitPublisherEntity$,
      },
    });

    this.ref3.onClose.subscribe(() => {
      console.log('close');
    });

    this.closePublisherModalOnSubmitted();
  }
  publisherCancelPendingRequests() {
    this.publisherRequestSubscription.forEach((sub) => sub.unsubscribe());
  }

  closePublisherModalOnSubmitted() {
    this.onSubmitPublisherEntity$.subscribe((publisher) => {
      console.log(this.onSubmitPublisherEntity$);
      if (publisher) {
        this.ref3?.close();
        {
          if (publisher) {
            this.publisherSearchInputComponent?.addManualElement(publisher);
          }
          this.ref3?.close();
        }
      }
    });
  }

  openLanguageAddModal() {
    this.ref4 = this.dialogService.open(AddLanguageComponent, {
      header: 'Add language',
      width: 'min(400px, 40%)',
      height: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1002,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitLanguageEntity$,
      },
    });

    this.ref4.onClose.subscribe(() => {
      console.log('close');
    });

    this.closeLanguagerModalOnSubmitted();
  }

  closeLanguagerModalOnSubmitted() {
    this.onSubmitLanguageEntity$.subscribe((language) => {
      if (language) {
        this.ref4?.close();
        {
          if (language) {
            this.filteredLanguages.push(language.languageCode);
            this.languages?.push(language);
          }
          this.ref4?.close();
        }
      }
    });
  }

  onSubmit() {
    if (this.form?.valid) {
      const bookCopyData: BookCopyAddDto = this.mapFormToBookCopyAddDto(
        this.form.value
      );
      this.bookService
        .addBookCopy(bookCopyData)
        .subscribe((bookFull: BookFullDto) => {
          this.onSubmitEntity$.emit(bookFull);
          console.log(this.onSubmitEntity$);
        });
    } else {
    }
  }

  getFormControlByName(name: string): FormControl | null {
    return this.form?.get(name) as FormControl | null;
  }
}
