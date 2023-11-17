import { Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class NgOnDestroyService implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get onDestroy$() {
    return this.destroy$.asObservable();
  }
}