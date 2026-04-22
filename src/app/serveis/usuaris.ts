import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CarritoServei } from './carrito-servei';

@Injectable({
  providedIn: 'root'
})
export class Usuaris {
  private url = 'http://localhost:4020';

  private currentUserSubject = new BehaviorSubject<string | null>(
    sessionStorage.getItem('currentUserNom')
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private carritoServei: CarritoServei) {}

  registrar(datos: any) {
    return this.http.post(`${this.url}/register`, datos);
  }

  login(datos: any) {
    return this.http.post(`${this.url}/login`, datos);
  }

  setUsuario(nombre: string | null) {
    if (nombre) {
      sessionStorage.setItem('currentUserNom', nombre);
    } else {
      sessionStorage.removeItem('currentUserNom');
    }
    this.currentUserSubject.next(nombre);
  }

  getUsuariByNom(nom: string) {
    return this.http.get<any>(`${this.url}/usuaris/${nom}`);
  }

  logout() {
    const nom = sessionStorage.getItem('currentUserNom');
    if (nom) {
      const productes = this.carritoServei.getProductosParaCompra();
      if (productes.length > 0) {
        this.http.post(`http://localhost:4020/api/carrito/guardar`, { nom_usuari: nom, productes }).subscribe();
      } else {
        this.http.delete(`http://localhost:4020/api/carrito/${nom}`).subscribe();
      }
    }
    sessionStorage.removeItem('esAdmin');
    this.carritoServei.resetServei();
    this.setUsuario(null);
  }

  cargarCarritoAlLogin(nom: string) {
    this.carritoServei.recuperarCarrito(nom);
  }
}
