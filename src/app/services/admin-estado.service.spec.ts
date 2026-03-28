import { TestBed } from '@angular/core/testing';

import { AdminEstadoService } from './admin-estado.service';

describe('AdminEstadoService', () => {
  let service: AdminEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
