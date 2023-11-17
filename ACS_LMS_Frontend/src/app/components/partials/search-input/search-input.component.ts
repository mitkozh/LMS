import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { auto } from '@popperjs/core';
import { NgOnDestroyService } from 'app/core/ng-on-destroy.service';
import { AutoComplete } from 'primeng/autocomplete';
import {
  distinctUntilChanged,
  debounceTime,
  takeUntil,
  Observable,
} from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
})
export class SearchInputComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  @Input()
  public inputControl = new FormControl();

  @ViewChild(AutoComplete, { static: false })
  autoComplete!: AutoComplete;

  @Input()
  public label?: string;
  @Input()
  public required = false;
  @Input()
  public disabled = false;
  @Input()
  public value: any[] = [];

  @Input()
  public multiple: boolean = true;
  @Input()
  public loading: Observable<boolean> = new Observable<boolean>();
  @Input()
  public optionTemplate!: TemplateRef<any>;
  @Input()
  public searchResults: Observable<any> = new Observable<any>();
  @Input()
  public dataKey: string = 'id';
  @Input()
  public field: string | undefined = 'name';
  @Input()
  public forceSelection = true;

  @Output()
  public search = new EventEmitter<string>();

  constructor(private destroy: NgOnDestroyService) {}

  ngOnDestroy(): void {
    this.destroy.ngOnDestroy();
  }

  public onChange = (_: any) => {};
  public onTouched = () => {};

  ngOnInit() {
    this.emitSearchOnTyping();
  }

  writeValue(value: any[]): void {
    this.value = value;
    this.inputControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(fn);
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

  private emitSearchOnTyping(): void {
    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroy.onDestroy$),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((value: string | undefined) => this.search.emit(value));
  }
}
