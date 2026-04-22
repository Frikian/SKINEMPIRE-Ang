import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  historial: any[] = [];
  carregant: boolean = true;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:4020/api/historial').subscribe({
      next: (data) => {
        this.historial = data;
        this.carregant = false;
      },
      error: () => {
        this.error = 'Error al carregar el historial.';
        this.carregant = false;
      }
    });
  }
}
