import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoProveedorComponent } from './modal-nuevo-proveedor.component';

describe('ModalNuevoProveedorComponent', () => {
  let component: ModalNuevoProveedorComponent;
  let fixture: ComponentFixture<ModalNuevoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevoProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
