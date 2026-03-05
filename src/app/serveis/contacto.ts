import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactoPayload {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private apiUrl = 'http://localhost:3000/api/contacto';

  constructor(private http: HttpClient) {}

  enviarMensaje(datos: ContactoPayload): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.apiUrl, datos);
  }
}
