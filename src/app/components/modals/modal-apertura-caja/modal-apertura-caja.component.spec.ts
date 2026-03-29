import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAperturaCajaComponent } from './modal-apertura-caja.component';

describe('ModalAperturaCajaComponent', () => {
  let component: ModalAperturaCajaComponent;
  let fixture: ComponentFixture<ModalAperturaCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAperturaCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAperturaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
