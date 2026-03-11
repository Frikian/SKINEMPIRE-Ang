import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  novaContrasena: string = '';
  confirmarContrasena: string = '';
  mensaje: string = '';
  token: string = '';
  completat: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.mensaje = 'Enllaç invàlid. Sol·licita un nou correu de restabliment.';
    }
  }

  canviarContrasena() {
    if (!this.novaContrasena || !this.confirmarContrasena) {
      this.mensaje = 'Per favor, omple tots els camps.';
      return;
    }
    if (this.novaContrasena !== this.confirmarContrasena) {
      this.mensaje = 'Les contrasenyes no coincideixen.';
      return;
    }
    if (this.novaContrasena.length < 8) {
      this.mensaje = 'La contrasenya ha de tenir mínim 8 caràcters.';
      return;
    }

    this.http.post<any>('http://localhost:4020/api/reset-password', {
      token: this.token,
      novaContrasena: this.novaContrasena
    }).subscribe({
      next: () => {
        this.completat = true;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'Error en restablir la contrasenya.';
      }
    });
  }
}
