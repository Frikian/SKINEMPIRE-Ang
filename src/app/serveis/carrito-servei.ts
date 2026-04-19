import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoServei {
  cantidadProductos: number[] = [0, 0, 0, 0, 0];

  productos = [
    {
      id: 1,
      nombre: 'AWP | Dragon Lore',
      precio: 1650,
      precioOriginal: 1650,
      estado: 'Factory New',
      rareza: 'C',
      rarezaClass: 'comun',
      oferta: false
    },
    {
      id: 2,
      nombre: 'AWP | Dragon Lore',
      precio: 1155,          // 30% descuento
      precioOriginal: 1650,
      estado: 'Minimal Wear',
      rareza: 'P.C',
      rarezaClass: 'pococomun',
      oferta: true
    },
    {
      id: 3,
      nombre: 'AWP | Dragon Lore',
      precio: 1650,
      precioOriginal: 1650,
      estado: 'Field-Tested',
      rareza: 'R',
      rarezaClass: 'raro',
      oferta: false
    },
    {
      id: 4,
      nombre: 'AWP | Dragon Lore',
      precio: 990,           // 40% descuento
      precioOriginal: 1650,
      estado: 'Well-Worn',
      rareza: 'M',
      rarezaClass: 'mitico',
      oferta: true
    },
    {
      id: 5,
      nombre: 'AWP | Dragon Lore',
      precio: 1650,
      precioOriginal: 1650,
      estado: 'Battle-Scarred',
      rareza: 'L',
      rarezaClass: 'legendario',
      oferta: false
    }
  ];

  agregarProducto(id: number): void {
    this.cantidadProductos[id - 1]++;
  }

  eliminarUnaUnidad(id: number): void {
    if (this.cantidadProductos[id - 1] > 0) {
      this.cantidadProductos[id - 1]--;
    }
  }

  eliminarProductoCompleto(id: number): void {
    this.cantidadProductos[id - 1] = 0;
  }

  getTotal(): number {
    let total = 0;
    for (let i = 0; i < this.cantidadProductos.length; i++) {
      if (this.cantidadProductos[i] > 0) {
        total += this.productos[i].precio * this.cantidadProductos[i];
      }
    }
    return total;
  }

  getCantidadTotal(): number {
    return this.cantidadProductos.reduce((sum, cantidad) => sum + cantidad, 0);
  }

  // Devuelve los productos que están en el carrito con su cantidad
  getProductosParaCompra() {
    return this.productos
      .filter((_, i) => this.cantidadProductos[i] > 0)
      .map(p => ({
        id_producte: p.id,
        cuantitat: this.cantidadProductos[p.id - 1],
        preu_unitari: p.precio,
        oferta: p.oferta ? 1 : 0
      }));
  }

  vaciarCarrito(): void {
    this.cantidadProductos = this.cantidadProductos.map(() => 0);
  }
}
