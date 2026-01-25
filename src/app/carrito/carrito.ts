import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoServei } from '../serveis/carrito-servei';

@Component({
  selector: 'app-carrito',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {

  constructor(public Scarrito: CarritoServei) {}

  getProductosEnCarrito() {
    return this.Scarrito.productos.filter((producto, index) =>
      this.Scarrito.cantidadProductos[index] > 0
    );
  }

  getCantidad(id: number): number {
    return this.Scarrito.cantidadProductos[id - 1];
  }

  restarUnidad(id: number): void {
    this.Scarrito.eliminarUnaUnidad(id);
  }

  sumarUnidad(id: number): void {
    this.Scarrito.agregarProducto(id);
  }

  eliminarProducto(id: number): void {
    this.Scarrito.eliminarProductoCompleto(id);
  }

  getSubtotal(): number {
    return this.Scarrito.getTotal();
  }

  getTarifa(): number {
    return this.getSubtotal() * 0.05;
  }

  getTotalFinal(): number {
    return this.getSubtotal() + this.getTarifa();
  }

  getProductosActivos(): number {
    return this.Scarrito.getCantidadTotal();
  }
}
