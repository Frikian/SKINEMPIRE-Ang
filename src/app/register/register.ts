import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {
  nom: string = "";
  email: string = "";
  contrasena: string = "";
  mensaje: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  enviarRegistro() {
    if (!this.nom || !this.email || !this.contrasena) {
      this.mensaje = "Per favor, omple tots els camps";
      return;
    }

    this.http.post('http://localhost:4020/api/send-verification', { email: this.email }).subscribe({
      next: () => {
        sessionStorage.setItem('pendingUser', JSON.stringify({
          nom: this.nom,
          email: this.email,
          contrasena: this.contrasena
        }));
        this.router.navigate(['/verify-email']);
      },
      error: () => {
        this.mensaje = "Error al enviar el codi de verificació. Torna-ho a intentar.";
      }
    });
  }
}
