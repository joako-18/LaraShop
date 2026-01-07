import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProductoInventarioImagenComponent } from './card-producto-inventario-imagen.component';

describe('CardProductoInventarioImagenComponent', () => {
  let component: CardProductoInventarioImagenComponent;
  let fixture: ComponentFixture<CardProductoInventarioImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProductoInventarioImagenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProductoInventarioImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
