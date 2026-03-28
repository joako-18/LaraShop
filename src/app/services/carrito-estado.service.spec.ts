import { TestBed } from '@angular/core/testing';

import { CarritoEstadoService } from './carrito-estado.service';

describe('CarritoEstadoService', () => {
  let service: CarritoEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
