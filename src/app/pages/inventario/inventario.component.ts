import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CardInventarioComponent } from "../../components/cards/card-inventario/card-inventario.component";

@Component({
  selector: 'app-inventario',
  imports: [NavbarComponent, CardInventarioComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {

}
