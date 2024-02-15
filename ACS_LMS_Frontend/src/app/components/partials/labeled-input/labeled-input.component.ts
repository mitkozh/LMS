import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from 'app/core/image.service';
import { NgOnDestroyService } from 'app/core/ng-on-destroy.service';
import { AutoComplete } from 'primeng/autocomplete';
import { FileUpload } from 'primeng/fileupload';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  noop,
  takeUntil,
} from 'rxjs';
import { callNumberExistsValidator } from '../modal/book-add/call-number-exists-validator';

@Component({
  selector: 'app-labeled-input',
  templateUrl: './labeled-input.component.html',
  styleUrls: ['./labeled-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabeledInputComponent),
      multi: true,
    },
  ],
})
export class LabeledInputComponent implements ControlValueAccessor {

  hasSelectedFile: boolean| undefined;
  @Input()
  public inputControl: FormControl = new FormControl();

  @ViewChild(AutoComplete, { static: false })
  autoComplete!: AutoComplete;

  @Input()
  public label?: string;
  @Input()
  public required = true;
  @Input()
  public disabled = false;
  @Input()
  public value: any = [];

  @Input()
  public multiple: boolean = true;
  @Input()
  public loading: Observable<boolean> = new Observable<boolean>();
  @Input()
  public optionTemplate!: TemplateRef<any>;
  @Input() fieldName!: string;
  @Input() inputType:
    | 'input'
    | 'autocomplete'
    | 'app-search-input'
    | 'textarea'
    | 'file-upload'
    | 'calendar' = 'input';
  @Input() suggestions: any = [];
  @Input() fieldId: string | undefined;
  @Input() suggestionsDynamic: Observable<any> = new Observable<any>();
  @Input() field: string| undefined;
  @Input() validationMessages: any[] | undefined;
  @Input() forceSelection = true;
  @Input() type = 'text';
  @Input() dataKey = 'id';
  @Input() dropdown = false;
  @Output() completeMethod = new EventEmitter<any>();
  @Output()
  public coverPhotoNameChange = new EventEmitter<number>();

  @Input()
  photo: any | undefined;

  constructor(
    private destroy: NgOnDestroyService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnDestroy(): void {
    this.destroy.ngOnDestroy();
  }

  public onChange = (_: any) => {};
  public onTouched = () => {};

  ngOnInit() {}

  writeValue(value: any[]): void {
    this.value = value;
    this.inputControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        fn(value);
        this.completeMethod.emit(value);
      });
  }
  onInputChange(value: any): void {
    this.onChange(value);
    this.completeMethod.emit(value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.inputControl.valueChanges.subscribe(() => fn());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  addManualElement(el: any) {
    if (!this.value.some((e: { id: any }) => e.id === el.id)) {
      this.value.push(el);
    }
    this.writeValue(this.value);
  }

  shouldShowError(): boolean {
    const control = this.inputControl;
    // if (this.type==='file-upload'){
    //   if (this.photo && this.hasSelectedFile){
    //     return false;
    //   }
    //   return true;
    // }
    return control.invalid && (control.dirty || control.touched);
  }

  onUpload(fileEvent: any): void {
    let imageId: number = 0;
    if (fileEvent.originalEvent instanceof HttpResponse) {
      let serverResponse = fileEvent.originalEvent.body;
      imageId = serverResponse.id;
      this.coverPhotoNameChange.emit(imageId);
    }
    if (imageId) {
      this.imageService.getImage(imageId).subscribe((profilePic) => {
        this.photo = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(profilePic)
        );
      });
    }
  }

  shouldDisplayError(validationType: string): boolean {
    const control = this.inputControl;
    
    return (
      control.hasError(validationType) && (control.dirty || control.touched)
    );
  }
}
