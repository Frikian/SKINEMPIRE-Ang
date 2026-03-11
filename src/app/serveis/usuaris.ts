import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuaris {
  private url = 'http://localhost:4020';

  // Recupera el nom de sessionStorage si ja existia (per si recàrrega de pàgina)
  private currentUserSubject = new BehaviorSubject<string | null>(
    sessionStorage.getItem('currentUserNom')
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  // Retorna les dades completes d'un usuari des de Firestore (via backend)
  getUsuariByNom(nom: string) {
    return this.http.get<any>(`${this.url}/usuaris/${nom}`);
  }

  logout() {
    this.setUsuario(null);
  }
}
