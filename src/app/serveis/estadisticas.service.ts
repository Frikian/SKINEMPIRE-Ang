import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VentaPorDiaProducto {
  fecha: string;
  producto: string;
  cantidad: number;
}

export interface OfertaVsSinOferta {
  fecha: string;
  oferta: boolean;
  cantidad: number;
}

export interface EstadisticasResponse {
  ventasPorDiaProducto: VentaPorDiaProducto[];
  ofertaVsSinOferta: OfertaVsSinOferta[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private baseUrl = 'http://localhost:4020/api/estadisticas';

  constructor(private http: HttpClient) {}

  getEstadisticasAdmin(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.baseUrl}/admin`);
  }

  getEstadisticasUsuario(nom: string): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.baseUrl}/usuario/${nom}`);
  }
}
