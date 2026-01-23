import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CarritoServei}  from '../serveis/carrito-servei';

@Component({
  selector: 'app-tienda',
  imports: [
    RouterLink
  ],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda {

  productes: number[]

 constructor(private Scarrito :CarritoServei) {
    this.productes = [0,0,0,0,0,0];
 }
  protected afegirCarrito(id:number) {
      this.productes[id-1]++;
  }
}
