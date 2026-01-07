import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDescuentoComponent } from './card-descuento.component';

describe('CardDescuentoComponent', () => {
  let component: CardDescuentoComponent;
  let fixture: ComponentFixture<CardDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDescuentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
