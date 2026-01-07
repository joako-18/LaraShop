import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCorteCajaComponent } from './modal-corte-caja.component';

describe('ModalCorteCajaComponent', () => {
  let component: ModalCorteCajaComponent;
  let fixture: ComponentFixture<ModalCorteCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCorteCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCorteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
