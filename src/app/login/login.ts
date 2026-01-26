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

    if (!nombre || !password) {
      this.mensaje = 'Usuario y contraseña son obligatorios';
      return;
    }

    const passwordGuardada = localStorage.getItem(nombre);

    if (!passwordGuardada) {
      this.mensaje = 'Usuario no encontrado';
    } else if (passwordGuardada === password) {
      this.mensaje = `¡Bienvenido, ${nombre}!`;
      this.usuarioservice.nom = nombre;
      this.nombrem = nombre;

      // posem una ruta per al donar clic en iniciar sesion ens porti a l'inici
      setTimeout(() => {
        this.router.navigate(['/index']);
      }, 1000);
    } else {
      this.mensaje = 'Contraseña incorrecta';
    }

    console.log('Password guardada:', passwordGuardada);
  }

  actualizarNombre(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.nombrem = input.value;
    }
  }
}
