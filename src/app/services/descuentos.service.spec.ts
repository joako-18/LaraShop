import { TestBed } from '@angular/core/testing';

import { DescuentosService } from './descuentos.service';

describe('DescuentosService', () => {
  let service: DescuentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescuentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
