import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProductVentaComponent } from './card-product-venta.component';

describe('CardProductVentaComponent', () => {
  let component: CardProductVentaComponent;
  let fixture: ComponentFixture<CardProductVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProductVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProductVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
