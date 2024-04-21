import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { BookFullDto } from 'app/shared/book-full-dto';
import { SearchInputComponent } from '../../search-input/search-input.component';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable, Subscription, forkJoin, of } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BookService } from 'app/core/book.service';
import { ImageService } from 'app/core/image.service';
import { LanguageService } from 'app/core/language.service';
import { AuthorService } from 'app/core/author.service';
import { CategoryService } from 'app/core/category.service';
import { PublisherService } from 'app/core/publisher.service';
import { callNumberExistsValidator } from '../../../../validators/call-number-exists-validator';
import { Language } from 'app/shared/language';
import { CategoryWithBooks } from 'app/shared/category-with-books';
import { Publisher } from 'app/shared/publisher';
import { AuthorShortDto } from 'app/shared/author-dto';
import { BookShortDto } from 'app/shared/book-short-dto';
import { AcquisitionDocumentEnum } from 'app/shared/acquasition-document-enum';
import { BookBindingEnum } from 'app/shared/book-binding-enum';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.scss'],
})
export class DeleteBookComponent {
  onSubmitEntity$!: EventEmitter<boolean>;
  title: String | undefined;
  bookCopyId!: number;
  imageId: number | undefined;
  form: FormGroup;
  bookCover: SafeUrl | undefined;
  bookId!: number;
  constructor(
    private confirmationService: ConfirmationService,
    private bookService: BookService,
    public dialogService: DialogService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private languageService: LanguageService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    public bookConfig: DynamicDialogConfig
  ) {
    this.form = this.fb.group({
      title: new FormControl({ value: null, disabled: true }),
      description: new FormControl({ value: null, disabled: true }),
      volume: new FormControl({ value: null, disabled: true }),
      authors: new FormControl({ value: null, disabled: true }),
      categories: new FormControl({ value: null, disabled: true }),
      callNumber: new FormControl({ value: null, disabled: true }),
      inventoryNumber: new FormControl({ value: null, disabled: true }),
      price: new FormControl({ value: null, disabled: true }),
      schoolInventoryNumber: new FormControl({ value: null, disabled: true }),
      language: new FormControl({ value: null, disabled: true }),
      publisher: new FormControl({ value: null, disabled: true }),
      binding: new FormControl({ value: null, disabled: true }),
      size: new FormControl({ value: null, disabled: true }),
      publicationDate: new FormControl({ value: null, disabled: true }),
      edition: new FormControl({ value: null, disabled: true }),
      isbn: new FormControl({ value: null, disabled: true }),
      notes: new FormControl({ value: null, disabled: true }),
      acquisitionDocumentEnum: new FormControl({ value: null, disabled: true }),
    });
  }

  ngOnInit(): void {
    

    this.bookId = this.bookConfig.data.id;
    this.onSubmitEntity$ = this.bookConfig.data.onSubmitEntity$;
    this.title = this.bookConfig.data.title;
    this.bookCopyId = this.bookConfig.data.bookCopyId;
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
    if (this.title && this.bookCopyId) {
      console.log(this.title + String(this.bookCopyId));
      this.bookService
        .getBookFullByTitleAndIdAndBookCopyId(
          this.title,
          this.bookId,
          this.bookCopyId
        )
        .subscribe((book) => this.updateFormFields(book));
    }
  }

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
  profilePhoto: any | undefined;

  onSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this book?',
      accept: () => {
        this.bookService
          .deleteBookByBookIdAndBookCopyId(this.bookId, this.bookCopyId)
          .subscribe(
            (deleted) => {
              if (deleted) {
                this.onSubmitEntity$.emit(deleted);
              }
            },
            (error) => {
              console.error('Error:', error);
            }
          );
      },
    });
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

  handleCoverPhotoNameChange(newImageId: number) {
    this.imageId = newImageId;
  }

  private updateFormFields(selectedBook: BookFullDto): void {
    this.imageId = selectedBook.imageId;
    this.imageService.getImage(this.imageId).subscribe((profilePic) => {
      this.bookCover = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(profilePic)
      );
    });
    this.getPublisherById(selectedBook.publisherId);
    this.fetchProfilePhotos([...selectedBook.authors]).subscribe(
      (authorsSaved) =>
        this.form.patchValue({
          authors: authorsSaved,
        })
    );
    this.form.patchValue({
      title: selectedBook.title,
      description: selectedBook.description,
      volume: selectedBook.volume,
      categories: selectedBook.categories,
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

  getFormControlByName(name: string): FormControl | null {
    return this.form?.get(name) as FormControl | null;
  }
}
