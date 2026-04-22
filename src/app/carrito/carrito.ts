import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoServei } from '../serveis/carrito-servei';
import { Usuaris } from '../serveis/usuaris';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {

  missatgeCompra: string = '';
  errorCompra: string = '';

  constructor(
    public Scarrito: CarritoServei,
    private usuariServei: Usuaris,
    private http: HttpClient,
    private cgf: ChangeDetectorRef
  ) {}

  getProductosEnCarrito() {
    return this.Scarrito.productos.filter((_, index) =>
      this.Scarrito.cantidadProductos[index] > 0
    );
  }

  getCantidad(id: number): number {
    return this.Scarrito.getCantidadById(id);
  }

  restarUnidad(id: number): void {
    this.Scarrito.eliminarUnaUnidad(id);
    this.cgf.detectChanges();
  }

  sumarUnidad(id: number): void {
    this.Scarrito.agregarProducto(id);
    this.cgf.detectChanges();
  }

  eliminarProducto(id: number): void {
    this.Scarrito.eliminarProductoCompleto(id);
    this.cgf.detectChanges();
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

  processarPagament(): void {
    const nom_usuari = sessionStorage.getItem('currentUserNom');

    if (!nom_usuari) {
      this.errorCompra = 'Has d\'iniciar sessió per comprar.';
      return;
    }

    const productes = this.Scarrito.getProductosParaCompra();

    this.http.post('http://localhost:4020/api/compra', { nom_usuari, productes })
      .subscribe({
        next: () => {
          this.missatgeCompra = 'Compra realitzada correctament!';
          this.errorCompra = '';
          this.Scarrito.vaciarCarrito();
          this.cgf.detectChanges();
        },
        error: () => {
          this.errorCompra = 'Error en processar la compra. Torna-ho a intentar.';
          this.missatgeCompra = '';
        }
      });
  }
}
