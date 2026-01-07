import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProveedorComponent } from './card-proveedor.component';

describe('CardProveedorComponent', () => {
  let component: CardProveedorComponent;
  let fixture: ComponentFixture<CardProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
