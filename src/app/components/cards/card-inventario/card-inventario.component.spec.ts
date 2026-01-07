import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInventarioComponent } from './card-inventario.component';

describe('CardInventarioComponent', () => {
  let component: CardInventarioComponent;
  let fixture: ComponentFixture<CardInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
