import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProductoInventarioComponent } from './card-producto-inventario.component';

describe('CardProductoInventarioComponent', () => {
  let component: CardProductoInventarioComponent;
  let fixture: ComponentFixture<CardProductoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProductoInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProductoInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
