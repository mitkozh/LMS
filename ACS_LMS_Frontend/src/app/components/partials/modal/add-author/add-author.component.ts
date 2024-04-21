import { ImageService } from './../../../../core/image.service';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { GenericService } from 'app/core/generic.service';
import { Author } from 'app/shared/author';
import { AuthorShortDto } from 'app/shared/author-dto';
import { AddAuthorDto } from './add-author-dto';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  FileSelectEvent,
  FileUploadEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ValidationMessages } from 'app/shared/validation-messages';
import { authorValidationMessages } from './author-validation-messeges';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss'],
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
export class AddAuthorComponent implements OnInit {
  imageId: number | undefined;
  profilePic: SafeUrl | undefined;
  onSubmitEntity$!: EventEmitter<AuthorShortDto>;

  constructor(
    private fb: FormBuilder,
    @Inject('authorService')
    private authorService: GenericService<Author, AddAuthorDto, AuthorShortDto>,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    public config: DynamicDialogConfig
  ) {}
  ngOnInit(): void {
    this.onSubmitEntity$ = this.config.data.onSubmitEntity$;
  }

  authorValidationMessages: ValidationMessages = authorValidationMessages;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  private mapFormToAuthorAddDto(formValue: any): AddAuthorDto {
    return {
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
      this.authorService.addAndRecieveDto(authorData).subscribe((res) => {
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
