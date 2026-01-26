import { Component } from '@angular/core';
import {Usuaris} from '../serveis/usuaris';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nom: string= ""
  mensaje: string=""
  constructor(private Usuarisss: Usuaris) {
  }

  enviarLogin(){
    const nombre = (document.querySelector<HTMLInputElement>('input[name="usuari"]')!).value;
    const password = (document.querySelector<HTMLInputElement>('input[name="pass"]')!).value;
    const passwordGuardada = localStorage.getItem(nombre);

    if(!passwordGuardada){
      alert("Registrat correctament :)")
    }
    if (!nombre || !password) {
      this.mensaje = 'Usuario y contraseña son obligatorios';
      return;
    }

    // Guardar usuario como clave y contraseña como valor
    if (!localStorage.getItem(nombre)) {
      localStorage.setItem(nombre, password);
      this.mensaje = 'Usuario registrado correctamente!';
      (document.querySelector('form') as HTMLFormElement).reset();
    } else {
      this.mensaje = 'El usuario ya existe';
    }

    console.log('Usuarios en localStorage:', localStorage);
  }
}
