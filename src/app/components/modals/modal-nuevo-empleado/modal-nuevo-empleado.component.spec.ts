import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoEmpleadoComponent } from './modal-nuevo-empleado.component';

describe('ModalNuevoEmpleadoComponent', () => {
  let component: ModalNuevoEmpleadoComponent;
  let fixture: ComponentFixture<ModalNuevoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevoEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
