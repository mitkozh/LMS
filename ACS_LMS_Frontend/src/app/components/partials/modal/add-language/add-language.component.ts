import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GenericService } from 'app/core/generic.service';
import { Language } from 'app/shared/language';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.scss'],
  providers: [
    {
      provide: 'languageService',
      useFactory: (http: HttpClient) =>
        new GenericService<Language, Language, Language>(http, {
          resourceEndpoint: 'languages',
        }),
      deps: [HttpClient],
    },
  ],
})
export class AddLanguageComponent {
  onSubmitEntity$!: EventEmitter<Language>;

  constructor(
    private fb: FormBuilder,
    @Inject('languageService')
    private publisherService: GenericService<Language, Language, Language>,
    public config: DynamicDialogConfig
  ) {}
  ngOnInit(): void {
    this.onSubmitEntity$ = this.config.data.onSubmitEntity$;
  }

  form = this.fb.group({
    languageCode: ['', Validators.required],
  });

  private mapFormToLanguageDto(formValue: any): Language {
    return {
      languageCode: formValue.languageCode || '',
    };
  }

  onSubmitLanguage() {
    if (this.form.valid) {
      const languageData: Language = this.mapFormToLanguageDto(
        this.form.value
      );
      this.publisherService.addAndRecieveDto(languageData).subscribe((res) => {
        if (res) {
          this.onSubmitEntity$.emit(res);
        }
      });
    } else {
    }
  }
}
