import { ValidationMessages } from '../../../../shared/validation-messages';
import { bookValidationMessages } from './book-validation-messages';
import { AuthorShortDto } from '../../../../shared/author-dto';
import { Language } from '../../../../shared/language';
import {
  Component,
  Inject,
  OnInit,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BookAddDto } from './book-add-dto';
import { Publisher } from 'app/shared/publisher';
import { BookBindingEnum } from 'app/shared/book-binding-enum';
import { AcquisitionDocumentEnum } from 'app/shared/acquasition-document-enum';
import { CategoryWithBooks } from 'app/shared/category-with-books';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { ImageService } from 'app/core/image.service';
import {
  Subject,
  Observable,
  switchMap,
  catchError,
  of,
  Subscription,
  map,
  forkJoin,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AddAuthorComponent } from '../add-author/add-author.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { FileUploadEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { AddPublisherComponent } from '../add-publisher/add-publisher.component';
import { AddLanguageComponent } from '../add-language/add-language.component';
import { BookShortDto } from 'app/shared/book-short-dto';
import { AddPublisherDto } from '../add-publisher/add-publisher-dto';
import { BookService } from 'app/core/book.service';
import { LanguageService } from 'app/core/language.service';
import { AuthorService } from 'app/core/author.service';
import { CategoryService } from 'app/core/category.service';
import { PublisherService } from 'app/core/publisher.service';
import { callNumberExistsValidator } from './call-number-exists-validator';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.scss'],
})
export class BookAddComponent implements OnInit {
  onSubmitEntity$!: EventEmitter<BookShortDto>;

  @ViewChild(SearchInputComponent)
  private authorSearchInputComponent: SearchInputComponent | undefined;
  @ViewChild(SearchInputComponent)
  private publisherSearchInputComponent: SearchInputComponent | undefined;
  ref2: DynamicDialogRef | undefined;
  ref3: DynamicDialogRef | undefined;
  ref4: DynamicDialogRef | undefined;
  private _authorSearchResults$ = new BehaviorSubject<any>([]);
  public authorSearchResults = this._authorSearchResults$.asObservable();
  private _authorLoading = new BehaviorSubject<boolean>(false);
  public authorLoading = this._authorLoading.asObservable();
  private _publisherSearchResults$ = new BehaviorSubject<any>('');
  public publisherSearchResults = this._publisherSearchResults$.asObservable();
  private _publisherLoading$ = new BehaviorSubject<boolean>(false);
  public publisherLoading$ = this._publisherLoading$.asObservable();
  imageId: number | undefined;
  bookValidationMessages: ValidationMessages = bookValidationMessages;
  form: FormGroup;
  constructor(
    private bookService: BookService,
    public dialogService: DialogService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private languageService: LanguageService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    public bookConfig: DynamicDialogConfig
  ) {
    this.form = this.fb.group({
      title: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(100)],
          updateOn: 'blur',
        },
      ],
      description: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(3000)],
          updateOn: 'blur',
        },
      ],
      volume: [
        null,
        {
          validators: [Validators.required, Validators.min(1)],
          updateOn: 'blur',
        },
      ],
      authors: [null, { validators: [Validators.required], updateOn: 'blur' }],
      categories: [
        null,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      callNumber: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(50)],
          asyncValidators: [callNumberExistsValidator(bookService)],
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
    this.onSubmitEntity$ = this.bookConfig.data.onSubmitEntity$;
    console.log(this.onSubmitEntity$);
    this.languageService
      .getList()
      .subscribe((languages: Language[] | undefined) => {
        this.languages = languages;
      });
    this.categoryService
      .getListDto()
      .subscribe((categories: CategoryWithBooks[] | undefined) => {
        this.categories = categories;
      });
    this.bookService
      .getListDto()
      .subscribe((books: BookShortDto[] | undefined) => {
        this.books = books;
      });
  }

  authorRequestsSubscription: Subscription[] = [];
  publisherRequestSubscription: Subscription[] = [];
  languages: Language[] | undefined;
  publishers: Publisher[] | undefined;
  categories: CategoryWithBooks[] | undefined;
  authors: AuthorShortDto[] | undefined;
  books: BookShortDto[] | undefined;
  acquisitionDocuments: AcquisitionDocumentEnum[] = [
    AcquisitionDocumentEnum.Donation,
    AcquisitionDocumentEnum.Protocol,
  ];
  bindings: BookBindingEnum[] = [BookBindingEnum.hc, BookBindingEnum.pb];
  filteredLanguages: string[] = [];
  filteredAcquisitions: string[] = [];
  filteredBindings: string[] = [];
  filteredCategories: string[] = [];
  filteredAuthors: string[] = [];
  filteredBooks: string[] = [];
  profilePhoto: any | undefined;
  onSubmitAuthorEntity$ = new EventEmitter<AuthorShortDto>();
  onSubmitPublisherEntity$ = new EventEmitter<Publisher>();
  onSubmitLanguageEntity$ = new EventEmitter<Language>();
  noPublisherResultMessage: string = '';
  noAuthorResulMessage: string = '';
  noLanguageResultMessage: string = '';

  onSubmit() {
    if (this.form?.valid) {
      const bookData: BookAddDto = this.mapFormToBookAddDto(this.form.value);
      this.bookService
        .addAndRecieveDto(bookData)
        .subscribe((book: BookShortDto) => {
          this.onSubmitEntity$.emit(book);
          console.log(this.onSubmitEntity$);
        });
    } else {
    }
  }

  private mapFormToBookAddDto(formValue: any): BookAddDto {
    return {
      title: formValue.title?.trim() || '',
      description: formValue.description?.trim() || '',
      imageId: this.imageId,
      volume: formValue.volume || null,
      authors: this.getEntitiesById(formValue.authors) || [],
      categories: formValue.categories || [],
      callNumber: formValue.callNumber?.trim() || '',
      inventoryNumber: formValue.inventoryNumber?.trim() || '',
      price: formValue.price || null,
      schoolInventoryNumber: formValue.schoolInventoryNumber?.trim() || null,
      language: formValue.language,
      publisher: this.getEntitiesById(formValue.publisher) || '',
      binding: formValue.binding,
      size: formValue.size || null,
      publicationDate: formValue.publicationDate || null,
      edition: formValue.edition?.trim() || '',
      isbn: formValue.isbn?.trim() || '',
      notes: formValue.notes?.trim() || null,
      acquisitionDocumentEnum: formValue.acquisitionDocumentEnum || null,
    };
  }

  private getEntitiesById(entities: any[] | any) {
    if (Array.isArray(entities)) {
      return entities.map((el) => el.id);
    }
    return entities.id;
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

  filterCategories(event: AutoCompleteCompleteEvent) {
    let filtered: string[] = [];
    let query = event.query;

    for (let i = 0; i < (this.categories as any[]).length; i++) {
      let category = (this.categories as any[])[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category.name);
      }
    }

    this.filteredCategories = filtered;
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

  onAuthorTextChange(changedText: string): void {
    this.authorCancelPendingRequests();

    if (changedText && changedText.length < 2) {
      this._authorSearchResults$.next([]);
      this._authorLoading.next(false);
      return;
    }

    this._authorLoading.next(true);

    this.authorService
      .getResultsDtoByName(changedText)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((response) => {
          if (response == null || response.length === 0) {
            return of([]);
          }
          return this.fetchProfilePhotos(response).pipe(
            catchError((error) => {
              console.error(error);
              return of([]);
            })
          );
        })
      )
      .subscribe(
        (authorResults) => {
          if (!authorResults || authorResults.length == 0) {
            this.noAuthorResulMessage =
              'No authors found with the specified name.';
            this._authorSearchResults$.next([]);
          } else {
            this.noAuthorResulMessage = '';
            this._authorSearchResults$.next(authorResults || []);
          }
          this._authorLoading.next(false);
          console.log(this.form.value.authors);
        },
        (error) => {
          console.error(error);
          this._authorLoading.next(false);
          this._authorSearchResults$.next([]);
        }
      );
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

  private fetchProfilePhotos(authors: AuthorShortDto[]): Observable<any[]> {
    const profilePhotoObservables = authors.map((author) =>
      this.getProfilePhoto(author.imageId)
    );

    return forkJoin(profilePhotoObservables).pipe(
      map((profilePhotos) =>
        authors.map((author, index) => ({
          id: author.id,
          name: author.name,
          description: author.description,
          profilePhoto: profilePhotos[index],
        }))
      )
    );
  }

  authorCancelPendingRequests() {
    this.authorRequestsSubscription.forEach((sub) => sub.unsubscribe());
  }

  publisherCancelPendingRequests() {
    this.publisherRequestSubscription.forEach((sub) => sub.unsubscribe());
  }

  openAuthorAddModal() {
    this.ref2 = this.dialogService.open(AddAuthorComponent, {
      header: 'Add author',
      width: 'min(400px, 40%)',
      height: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1002,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitAuthorEntity$,
      },
    });

    this.ref2.onClose.subscribe(() => {
      console.log('close');
    });

    this.closeAuthorModalOnSubmitted();
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

  // onUpload(fileEvent: FileUploadEvent) {
  //   if (fileEvent.originalEvent instanceof HttpResponse) {
  //     let serverResponse = fileEvent.originalEvent.body;
  //     this.coverPhotoName = serverResponse.name;
  //   }
  //   this.imageService
  //     .getImage(this.coverPhotoName as string)
  //     .subscribe((profilePic) => {
  //       this.coverPhoto = this.sanitizer.bypassSecurityTrustUrl(
  //         URL.createObjectURL(profilePic)
  //       );
  //     });
  // }

  handleCoverPhotoNameChange(newImageId: number) {
    this.imageId = newImageId;
  }

  closeAuthorModalOnSubmitted() {
    this.onSubmitAuthorEntity$.subscribe((author) => {
      console.log(this.onSubmitAuthorEntity$);
      if (author) {
        this.ref2?.close();
        const authorDto = this.fetchProfilePhotos(Array(author))
          .pipe(
            catchError((error) => {
              console.error(error);
              return [];
            })
          )
          .subscribe((val) => {
            console.log(val);
            if (val.length !== 0) {
              this.authorSearchInputComponent?.addManualElement(val[0]);
            }
            this.ref2?.close();
          });
      }
    });
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
  getFormControlByName(name: string): FormControl | null {
    return this.form?.get(name) as FormControl | null;
  }
}
