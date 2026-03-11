import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoServei } from '../serveis/carrito-servei';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule
  ],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css'],
})
export class Tienda {

  productes: number[]
  skins = [
    {
      id: 1, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Factory New', rareza: 'C',
      imagen: 'assets/pruebaimg.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 2, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Minimal Wear', rareza: 'P.C',
      imagen: 'assets/pruebaimg.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 3, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Field-Tested', rareza: 'R',
      imagen: 'assets/pruebaimg.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 4, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Well-Worn', rareza: 'M',
      imagen: 'assets/pruebaimg.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 5, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Battle-Scarred', rareza: 'L',
      imagen: 'assets/pruebaimg.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    }
  ];


  skinsFiltradas = [...this.skins];

  constructor(private Scarrito: CarritoServei) {
    this.productes = [0, 0, 0, 0, 0, 0];
  }
  // Filtrillos
  busqueda: string = '';
  rarezaSeleccionada: string = '';
  estadoSeleccionado: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  // Opciones de los filtros
  rarezas = ['C', 'P.C', 'R', 'M', 'L', 'A'];
  estados = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

  protected afegirCarrito(id: number) {
    this.productes[id - 1]++;
    this.Scarrito.agregarProducto(id);
  }
  aplicarFiltros() {
    this.skinsFiltradas = this.skins.filter(skin => {
      const cumpleBusqueda = !this.busqueda ||
        skin.nombre.toLowerCase().includes(this.busqueda.toLowerCase());

      const cumpleRareza = !this.rarezaSeleccionada ||
        skin.rareza === this.rarezaSeleccionada;

      const cumpleEstado = !this.estadoSeleccionado ||
        skin.estado === this.estadoSeleccionado;

      const cumplePrecioMin = this.precioMin === null ||
        skin.precio >= this.precioMin;

      const cumplePrecioMax = this.precioMax === null ||
        skin.precio <= this.precioMax;

      return cumpleBusqueda && cumpleRareza && cumpleEstado &&
        cumplePrecioMin && cumplePrecioMax;
    });
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.rarezaSeleccionada = '';
    this.estadoSeleccionado = '';
    this.precioMin = null;
    this.precioMax = null;
    this.skinsFiltradas = [...this.skins];
  }

  getRarezaClass(rareza: string): string {
    const clases: { [key: string]: string } = {
      'C': 'comun',
      'P.C': 'pococomun',
      'R': 'raro',
      'M': 'mitico',
      'L': 'legendario',
      'A': 'ancestral'
    };
    return clases[rareza] || '';
  }
}
