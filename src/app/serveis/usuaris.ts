import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuaris {
  private url = 'http://localhost:4020';

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  registrar(datos: any) {
    return this.http.post(`${this.url}/register`, datos);
  }

  login(datos: any) {
    return this.http.post(`${this.url}/login`, datos);
  }

  setUsuario(nombre: string | null) {
    this.currentUserSubject.next(nombre);
  }
}
