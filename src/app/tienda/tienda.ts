import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoServei } from '../serveis/carrito-servei';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css'],
})
export class Tienda implements OnInit {
  skins: any[] = [];
  skinsFiltradas: any[] = [];

  busqueda: string = '';
  rarezaSeleccionada: string = '';
  estadoSeleccionado: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  rarezas = ['C', 'P.C', 'R', 'M', 'L', 'A'];
  estados = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

  constructor(private Scarrito: CarritoServei, private http: HttpClient, private cgf: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:4020/api/productes').subscribe(productes => {
      this.skins = productes.map(p => ({
        id: p.id_producte,
        id_producte: p.id_producte,
        nombre: p.nom_producte,
        precio: this.getPreu(p.id_producte),
        precioOriginal: 1650,
        estado: this.getEstat(p.id_producte),
        rareza: this.getRareza(p.id_producte),
        oferta: this.getOferta(p.id_producte),
        descripcion: 'Skin amb disseny exclusiu.'
      }));
      this.skinsFiltradas = [...this.skins];
      this.Scarrito.cargarProductes(this.skins.map(s => ({
        id_producte: s.id_producte,
        nombre: s.nombre,
        precio: s.precio,
        precioOriginal: s.precioOriginal,
        estado: s.estado,
        rareza: s.rareza,
        rarezaClass: this.getRarezaClass(s.rareza),
        oferta: s.oferta,
      })));
      this.cgf.detectChanges();
    });
  }

  getPreu(id: number): number {
    const preus: { [key: number]: number } = { 1: 1650, 2: 1155, 3: 1650, 4: 990, 5: 1650 };
    return preus[id] ?? 1650;
  }

  getEstat(id: number): string {
    const estats: { [key: number]: string } = { 1: 'Factory New', 2: 'Minimal Wear', 3: 'Field-Tested', 4: 'Well-Worn', 5: 'Battle-Scarred' };
    return estats[id] ?? 'Factory New';
  }

  getRareza(id: number): string {
    const rarezas: { [key: number]: string } = { 1: 'C', 2: 'P.C', 3: 'R', 4: 'M', 5: 'L' };
    return rarezas[id] ?? 'C';
  }

  getOferta(id: number): boolean {
    return id === 2 || id === 4;
  }

  afegirCarrito(id: number) {
    this.Scarrito.agregarProducto(id);
  }

  aplicarFiltros() {
    this.skinsFiltradas = this.skins.filter(skin => {
      const cumpleBusqueda = !this.busqueda || skin.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      const cumpleRareza = !this.rarezaSeleccionada || skin.rareza === this.rarezaSeleccionada;
      const cumpleEstado = !this.estadoSeleccionado || skin.estado === this.estadoSeleccionado;
      const cumplePrecioMin = this.precioMin === null || skin.precio >= this.precioMin;
      const cumplePrecioMax = this.precioMax === null || skin.precio <= this.precioMax;
      return cumpleBusqueda && cumpleRareza && cumpleEstado && cumplePrecioMin && cumplePrecioMax;
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
      'C': 'comun', 'P.C': 'pococomun', 'R': 'raro', 'M': 'mitico', 'L': 'legendario', 'A': 'ancestral'
    };
    return clases[rareza] || '';
  }
}
