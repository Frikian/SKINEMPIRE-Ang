import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Index } from './index';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Usuaris } from './serveis/usuaris';
import { CarritoServei } from './serveis/carrito-servei';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Index, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('SKINEMPIRE-Ang');

  constructor(
    private usuarisService: Usuaris,
    private carritoServei: CarritoServei,
    private http: HttpClient,
    private cgf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:4020/api/productes').subscribe(productes => {
      const mapped = productes.map(p => ({
        id_producte: p.id_producte,
        nombre: p.nom_producte,
        precio: this.getPreu(p.id_producte),
        precioOriginal: 1650,
        estado: this.getEstat(p.id_producte),
        rareza: this.getRareza(p.id_producte),
        rarezaClass: this.getRarezaClass(this.getRareza(p.id_producte)),
        oferta: this.getOferta(p.id_producte),
      }));

      this.carritoServei.cargarProductes(mapped);

      const nom = sessionStorage.getItem('currentUserNom');
      if (nom) {
        this.http.get<any[]>(`http://localhost:4020/api/carrito/${nom}`).subscribe(items => {
          for (const item of items) {
            const index = this.carritoServei.productos.findIndex(p => p.id_producte === item.id_producte);
            if (index !== -1) this.carritoServei.cantidadProductos[index] = item.cuantitat;
          }
          this.cgf.detectChanges();
        });
      }
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

  getRarezaClass(rareza: string): string {
    const clases: { [key: string]: string } = {
      'C': 'comun', 'P.C': 'pococomun', 'R': 'raro', 'M': 'mitico', 'L': 'legendario', 'A': 'ancestral'
    };
    return clases[rareza] || '';
  }
}
