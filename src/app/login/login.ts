import { Component } from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Usuaris} from '../serveis/usuaris';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  mensaje: string = '';
  nombrem: string = '';

  constructor(private usuarioservice: Usuaris, private router: Router) {
  }

  enviarLogin() {
    const nombre = (document.querySelector<HTMLInputElement>('input[name="usuari"]')!).value;
    const password = (document.querySelector<HTMLInputElement>('input[name="pass"]')!).value;

    this.usuarioservice.login({ nombre, password }).subscribe({
      next: (res: any) => {
        this.mensaje = `¡Bienvenido, ${res.nombre}!`;
        this.usuarioservice.setUsuario(res.nombre);
        setTimeout(() => this.router.navigate(['/index']), 1000);
      },
      error: (err) => {
        this.mensaje = "Credencials incorrectes";
      }
    });
  }

  actualizarNombre(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.nombrem = input.value;
    }
  }
}
