import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoDescuentoComponent } from './modal-nuevo-descuento.component';

describe('ModalNuevoDescuentoComponent', () => {
  let component: ModalNuevoDescuentoComponent;
  let fixture: ComponentFixture<ModalNuevoDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevoDescuentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevoDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
