import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail implements OnInit {
  code: string = '';
  mensaje: string = '';
  intentos: number = 3;
  pendingUser: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('pendingUser');
    if (!data) {
      this.router.navigate(['/register']);
      return;
    }
    this.pendingUser = JSON.parse(data);
  }

  verificar() {
    if (!this.code) {
      this.mensaje = 'Introdueix el codi.';
      return;
    }

    this.http.post<any>('http://localhost:4020/api/verify-code', {
      email: this.pendingUser.email,
      code: this.code
    }).subscribe({
      next: (res) => {
        if (res.valid) {
          this.http.post('http://localhost:4020/usuaris', this.pendingUser).subscribe({
            next: () => {
              sessionStorage.removeItem('pendingUser');
              this.router.navigate(['/login']);
            },
            error: (err) => {
              this.mensaje = 'Error al guardar usuari: ' + (err.error?.mensaje || 'Error desconegut');
            }
          });
        }
      },
      error: (err) => {
        this.intentos--;
        if (this.intentos <= 0) {
          this.mensaje = 'Has exhaurit els intents. Torna a registrar-te amb un altre correu.';
          sessionStorage.removeItem('pendingUser');
          setTimeout(() => this.router.navigate(['/register']), 2500);
        } else {
          this.mensaje = `Codi incorrecte. Et queden ${this.intentos} intent(s).`;
        }
      }
    });
  }

  reenviarCodi() {
    this.http.post('http://localhost:4020/api/send-verification', {
      email: this.pendingUser.email
    }).subscribe({
      next: () => {
        this.mensaje = 'Codi reenviat! Comprova el teu correu.';
        this.intentos = 3;
        this.code = '';
      },
      error: () => {
        this.mensaje = 'Error al reenviar el codi.';
      }
    });
  }
}
