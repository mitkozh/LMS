import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GenericService } from 'app/core/generic.service';
import { Publisher } from 'app/shared/publisher';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AddPublisherDto } from './add-publisher-dto';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.scss'],
  providers: [
    {
      provide: 'publisherService',
      useFactory: (http: HttpClient) =>
        new GenericService<Publisher, AddPublisherDto, Publisher>(http, {
          resourceEndpoint: 'publishers',
        }),
      deps: [HttpClient],
    },
  ],
})
export class AddPublisherComponent {
  onSubmitEntity$!: EventEmitter<Publisher>;

  constructor(
    private fb: FormBuilder,
    @Inject('publisherService')
    private publisherService: GenericService<
      Publisher,
      AddPublisherDto,
      Publisher
    >,
    public config: DynamicDialogConfig
  ) {}
  ngOnInit(): void {
    this.onSubmitEntity$ = this.config.data.onSubmitEntity$;
  }

  form = this.fb.group({
    name: ['', Validators.required],
  });

  private mapFormToPublisherDto(formValue: any): AddPublisherDto {
    return {
      name: formValue.name || '',
    };
  }

  onSubmitPublisher() {
    if (this.form.valid) {
      const publisherData: AddPublisherDto = this.mapFormToPublisherDto(
        this.form.value
      );
      this.publisherService.addAndRecieveDto(publisherData).subscribe((res) => {
        if (res) {
          this.onSubmitEntity$.emit(res);
        }
      });
    } else {
    }
  }
}
