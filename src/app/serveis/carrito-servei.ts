import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoServei {
  cantidadProductos: number[] = [0, 0, 0, 0, 0, 0];

  productos = [
    {
      id: 1,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'C',
      rarezaClass: 'comun'
    },
    {
      id: 2,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'P.C',
      rarezaClass: 'pococomun'
    },
    {
      id: 3,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'R',
      rarezaClass: 'raro'
    },
    {
      id: 4,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'M',
      rarezaClass: 'mitico'
    },
    {
      id: 5,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'L',
      rarezaClass: 'legendario'
    },
    {
      id: 6,
      nombre: 'AWP | Dragon Lore',
      precio: 1650.50,
      estado: 'Factory New',
      rareza: 'A',
      rarezaClass: 'ancestral'
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
}
