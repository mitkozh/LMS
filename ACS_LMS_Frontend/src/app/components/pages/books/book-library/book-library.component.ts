import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BookShortDto } from 'app/shared/book-short-dto';
import { UserRole } from 'app/shared/user-role';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookAddComponent } from 'app/components/partials/modal/book-add/book-add.component';
import { BookService } from 'app/core/book.service';
import { AddBookCopyComponent } from 'app/components/partials/modal/add-book-copy/add-book-copy.component';

@Component({
  selector: 'app-book-library',
  templateUrl: './book-library.component.html',
  styleUrls: ['./book-library.component.scss'],
 
})
export class BookLibraryComponent implements OnInit, OnDestroy {
  
  ref: DynamicDialogRef | undefined;
  onSubmitBookEntity$ = new EventEmitter<BookShortDto>();
  onSubmitBookCopyEntity$ = new EventEmitter<BookShortDto>();

  bestSellers: BookShortDto[] = new Array<BookShortDto>();

  constructor(
    private dialogService: DialogService,
    private bookService: BookService
  ) {}
  ngOnInit(): void {
    this.bookService.getBestsellers().subscribe(books=>{
      this.bestSellers = books
    })
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
  roles: typeof UserRole = UserRole;
  
  openBookAddModal() {
    this.ref = this.dialogService.open(BookAddComponent, {
      header: 'Add book',
      width: 'min(600px, 60%)',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitBookEntity$,
      },
    });

    this.ref.onClose.subscribe(() => {
      console.log('close');
    });

    this.closeBooksAddModalOnSubmitted();
  }

  openBookCopyAddModal(){
    this.ref = this.dialogService.open(AddBookCopyComponent, {
      header: 'Add book copy',
      width: 'min(600px, 60%)',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitBookEntity$,
      },
    });

    this.closeBooksCopyAddModalOnSubmitted();
  }

  closeBooksAddModalOnSubmitted() {
    this.onSubmitBookEntity$.subscribe((book) => {
      if (book) {
        this.ref?.close();
        {
          if (book) {
          }
          this.ref?.close();
        }
      }
    });
  }
  closeBooksCopyAddModalOnSubmitted() {
    this.onSubmitBookCopyEntity$.subscribe((book) => {
      if (book) {
        this.ref?.close();
        {
          this.ref?.close();
        }
      }
    });
  }
}
