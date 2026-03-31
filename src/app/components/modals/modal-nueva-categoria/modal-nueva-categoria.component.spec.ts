import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevaCategoriaComponent } from './modal-nueva-categoria.component';

describe('ModalNuevaCategoriaComponent', () => {
  let component: ModalNuevaCategoriaComponent;
  let fixture: ComponentFixture<ModalNuevaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevaCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
