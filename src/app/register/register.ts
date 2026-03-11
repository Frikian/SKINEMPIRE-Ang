import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor(private http: HttpClient) {}

  enviarRegistro() {
    if (!this.nom || !this.email || !this.contrasena) {
      this.mensaje = "Por favor, rellena todos los campos";
      return;
    }

    const datosUsuario = {
      nom: this.nom,
      email: this.email,
      contrasena: this.contrasena
    };

    this.http.post('http://localhost:4020/usuaris', datosUsuario).subscribe({
      next: (res: any) => {
        this.mensaje = "¡Usuario " + this.nom + " guardado en Firebase con éxito!";
        console.log('Resposta directa:', res);
      },
      error: (err) => {
        this.mensaje = "Error: " + (err.error?.mensaje || "No se pudo conectar con el servidor");
        console.error('Error en la petición:', err);
      }
    });
  }
}
