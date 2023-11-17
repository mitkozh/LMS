import { ImageService } from './../../../../core/image.service';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { GenericService } from 'app/core/generic.service';
import { Author } from 'app/shared/author';
import { AuthorShortDto } from 'app/shared/author-dto';
import { AddAuthorDto } from './add-author-dto';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FileSelectEvent,
  FileUploadEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

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
  profilePicName: string | undefined;
  profilePic: any | undefined;
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

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  private mapFormToAuthorAddDto(formValue: any): AddAuthorDto {
    return {
      name: formValue.name || '',
      description: formValue.description || '',
      profilePicName: this.profilePicName,
    };
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
    }
  }

  onFileUpload(fileEvent: FileUploadHandlerEvent) {
    if (fileEvent.files.length === 1) {
      let responseType: any;
      let file: File = fileEvent.files[0];
      this.imageService.uploadImage(file).subscribe((res) => {
        this.profilePicName = res.name;
        responseType = res.type;
        this.imageService
          .getImage(this.profilePicName as string)
          .subscribe((profilePic) => {
            this.profilePic = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(profilePic)
            );
          });
      });
    } else {
    }
  }
}
