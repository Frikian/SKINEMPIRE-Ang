import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Importamos el cliente HTTP y el módulo necesario
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule], // Asegúrate de tener HttpClientModule en tu app.config si usas standalone
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {
  nom: string = "";
  email: string = "";
  contrasena: string = "";
  mensaje: string = "";

  // Inyectamos HttpClient directamente aquí
  constructor(private http: HttpClient) {}

  enviarRegistro() {
    if (!this.nom || !this.email || !this.contrasena) {
      this.mensaje = "Por favor, rellena todos los campos";
      return;
    }

    // Preparamos los datos con los nombres que espera tu server.js
    const datosUsuario = {
      nom: this.nom,
      email: this.email,
      contrasena: this.contrasena
    };

    // Realizamos la petición directamente al puerto 3000
    this.http.post('http://localhost:4020/usuaris', datosUsuario).subscribe({
      next: (res: any) => {
        // Rellenamos el mensaje con la respuesta del servidor
        this.mensaje = "¡Usuario " + this.nom + " guardado en Firebase con éxito!";
        console.log('Respuesta directa:', res);

        // Opcional: Limpiar campos tras el registro exitoso
        // this.nom = ""; this.email = ""; this.contrasena = "";
      },
      error: (err) => {
        // Manejo de errores directamente en el componente
        this.mensaje = "Error: " + (err.error?.mensaje || "No se pudo conectar con el servidor");
        console.error('Error en la petición:', err);
      }
    });
  }
}
