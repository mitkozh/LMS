import { ImageService } from './../../../../core/image.service';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { GenericService } from 'app/core/generic.service';
import { Author } from 'app/shared/author';
import { AuthorShortDto } from 'app/shared/author-dto';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  FileSelectEvent,
  FileUploadEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ValidationMessages } from 'app/shared/validation-messages';
import { AddAuthorDto } from '../add-author/add-author-dto';
import { authorValidationMessages } from '../add-author/author-validation-messeges';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.scss'],
  providers: [
    {
      provide: 'authorService',
      useFactory: (http: HttpClient) =>
        new GenericService<Author, AddAuthorDto, AuthorShortDto>(http, {
          resourceEndpoint: 'authors',
        }),
      deps: [HttpClient],
    },
  ],
})
export class EditAuthorComponent implements OnInit {
  authorName: String | undefined;
  authorId!: number;
  imageId: number | undefined;
  profilePic: SafeUrl | undefined;
  onSubmitEntity$!: EventEmitter<AuthorShortDto>;

  constructor(
    private fb: FormBuilder,
    @Inject('authorService')
    private authorService: GenericService<Author, AddAuthorDto, AuthorShortDto>,
    private imageService: ImageService,
    public authorConfig: DynamicDialogConfig,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.authorId = this.authorConfig.data.id;
    this.onSubmitEntity$ = this.authorConfig.data.onSubmitEntity$;
    this.authorName = this.authorConfig.data.authorName;
    if (this.authorName && this.authorId) {
      console.log(this.authorName + String(this.authorId));
      this.authorService
        .getByIdAndRecieveDto(this.authorId)
        .subscribe((book) => this.updateFormFields(book));
    }
  }

  private updateFormFields(author: AuthorShortDto): void {
    this.imageId = author.imageId;
    this.imageService.getImage(this.imageId).subscribe((profilePic) => {
      this.profilePic = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(profilePic)
      );
    });
    this.form.patchValue({
      name: author.name,
      description: author.description,
    });
  }

  authorValidationMessages: ValidationMessages = authorValidationMessages;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  private mapFormToAuthorAddDto(formValue: any): AddAuthorDto {
    return {
      id: this.authorId,
      name: formValue.name || '',
      description: formValue.description || '',
      imageId: this.imageId,
    };
  }

  handleAuthorPhotoNameChange(newImageId: number) {
    this.imageId = newImageId;
  }
  onSubmitAuthor() {
    if (this.form.valid) {
      const authorData: AddAuthorDto = this.mapFormToAuthorAddDto(
        this.form.value
      );
      this.authorService.updateAndThenRecieveDto(this.authorId, authorData).subscribe((res) => {
        if (res) {
          this.onSubmitEntity$.emit(res);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        let control = this.getFormControlByName(field);
        control?.updateValueAndValidity();
        control?.markAllAsTouched();
      });
    }
  }

  getFormControlByName(name: string): FormControl | null {
    return this.form?.get(name) as FormControl | null;
  }
}
