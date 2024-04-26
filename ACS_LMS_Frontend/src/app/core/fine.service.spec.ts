import { TestBed } from '@angular/core/testing';

import { FineService } from './fine.service';

describe('FineService', () => {
  let service: FineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
