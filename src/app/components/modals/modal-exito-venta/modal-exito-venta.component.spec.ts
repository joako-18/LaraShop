import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExitoVentaComponent } from './modal-exito-venta.component';

describe('ModalExitoVentaComponent', () => {
  let component: ModalExitoVentaComponent;
  let fixture: ComponentFixture<ModalExitoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExitoVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExitoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
