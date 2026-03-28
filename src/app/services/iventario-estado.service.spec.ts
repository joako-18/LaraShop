import { TestBed } from '@angular/core/testing';

import { IventarioEstadoService } from './iventario-estado.service';

describe('IventarioEstadoService', () => {
  let service: IventarioEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IventarioEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
