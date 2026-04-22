import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CarritoServei {
  cantidadProductos: number[] = [];
  productos: any[] = [];
  private carritosPendents: { id_producte: number, cuantitat: number }[] = [];
  private productesCarregats: boolean = false;

  constructor(private http: HttpClient) {}

  cargarProductes(productes: any[]) {
    const yaCarregats = this.productesCarregats;
    this.productos = productes;

    if (!yaCarregats) {
      this.cantidadProductos = new Array(productes.length).fill(0);
      this.productesCarregats = true;

      if (this.carritosPendents.length > 0) {
        for (const item of this.carritosPendents) {
          const index = this.productos.findIndex(p => p.id_producte === item.id_producte);
          if (index !== -1) this.cantidadProductos[index] = item.cuantitat;
        }
        this.carritosPendents = [];
      }
    }
  }

  agregarProducto(id: number): void {
    const index = this.productos.findIndex(p => p.id_producte === id);
    if (index !== -1) {
      this.cantidadProductos[index]++;
      this.autoGuardar();
    }
  }

  eliminarUnaUnidad(id: number): void {
    const index = this.productos.findIndex(p => p.id_producte === id);
    if (index !== -1 && this.cantidadProductos[index] > 0) {
      this.cantidadProductos[index]--;
      this.autoGuardar();
    }
  }

  eliminarProductoCompleto(id: number): void {
    const index = this.productos.findIndex(p => p.id_producte === id);
    if (index !== -1) {
      this.cantidadProductos[index] = 0;
      this.autoGuardar();
    }
  }

  private autoGuardar(): void {
    const nom = sessionStorage.getItem('currentUserNom');
    if (!nom) return;
    const productes = this.getProductosParaCompra();
    console.log('AutoGuardar productes:', productes);
    if (productes.length === 0) {
      this.http.delete(`http://localhost:4020/api/carrito/${nom}`).subscribe({
        next: (r) => console.log('Carrito esborrat:', r),
        error: (e) => console.error('Error esborrant carrito:', e)
      });
    } else {
      this.http.post('http://localhost:4020/api/carrito/guardar', { nom_usuari: nom, productes }).subscribe();
    }
  }

  getTotal(): number {
    let total = 0;
    for (let i = 0; i < this.productos.length; i++) {
      if (this.cantidadProductos[i] > 0) {
        total += this.productos[i].precio * this.cantidadProductos[i];
      }
    }
    return total;
  }

  getCantidadTotal(): number {
    return this.cantidadProductos.reduce((sum, c) => sum + c, 0);
  }

  getCantidadById(id: number): number {
    const index = this.productos.findIndex(p => p.id_producte === id);
    return index !== -1 ? this.cantidadProductos[index] : 0;
  }

  getProductosParaCompra() {
    return this.productos
      .filter((_, i) => this.cantidadProductos[i] > 0)
      .map(p => ({
        id_producte: p.id_producte,
        cuantitat: this.cantidadProductos[this.productos.indexOf(p)],
        preu_unitari: p.precio,
        oferta: p.oferta ? 1 : 0,
      }));
  }

  guardarCarrito(nom_usuari: string) {
    const productes = this.getProductosParaCompra();
    if (productes.length === 0) return;
    this.http.post('http://localhost:4020/api/carrito/guardar', { nom_usuari, productes }).subscribe({
      next: (r) => console.log('Carrito guardat:', r),
      error: (e) => console.error('Error guardant carrito:', e)
    });
  }

  recuperarCarrito(nom_usuari: string) {
    this.http.get<any[]>(`http://localhost:4020/api/carrito/${nom_usuari}`).subscribe(items => {
      console.log('Carrito recuperat:', items);
      if (this.productesCarregats && this.productos.length > 0) {
        for (const item of items) {
          const index = this.productos.findIndex(p => p.id_producte === item.id_producte);
          if (index !== -1) this.cantidadProductos[index] = item.cuantitat;
        }
      } else {
        this.carritosPendents = items.map(i => ({ id_producte: i.id_producte, cuantitat: i.cuantitat }));
        console.log('Carrito pendent:', this.carritosPendents);
      }
    });
  }

  vaciarCarrito(): void {
    this.cantidadProductos = this.cantidadProductos.map(() => 0);
    this.carritosPendents = [];
  }

  resetServei(): void {
    this.cantidadProductos = [];
    this.productos = [];
    this.carritosPendents = [];
    this.productesCarregats = false;
  }
}
