import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  nom: string = '';
  email: string = '';
  mensaje: string = '';
  enviat: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  enviarSolicitud() {
    if (!this.nom || !this.email) {
      this.mensaje = 'Per favor, omple tots els camps.';
      return;
    }

    this.http.post<any>('http://localhost:4020/api/forgot-password', {
      nom: this.nom,
      email: this.email
    }).subscribe({
      next: () => {
        this.enviat = true;
        this.mensaje = 'Correu enviat! Comprova la teva safata d\'entrada.';
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'No s\'ha trobat cap usuari amb aquestes dades.';
      }
    });
  }
}
