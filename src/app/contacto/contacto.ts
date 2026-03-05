import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactoService } from '../serveis/contacto';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, CommonModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  nombre = '';
  email = '';
  motivo = '';
  mensaje = '';

  enviando = false;
  exito = false;
  error = false;

  constructor(private contactoService: ContactoService) {}

  enviarFormulario() {
    if (!this.nombre || !this.email || !this.motivo || !this.mensaje) return;

    this.enviando = true;
    this.exito = false;
    this.error = false;

    this.contactoService
      .enviarMensaje({
        nombre: this.nombre,
        email: this.email,
        motivo: this.motivo,
        mensaje: this.mensaje,
      })
      .subscribe({
        next: () => {
          this.exito = true;
          this.enviando = false;
          this.nombre = '';
          this.email = '';
          this.motivo = '';
          this.mensaje = '';
        },
        error: () => {
          this.error = true;
          this.enviando = false;
        },
      });
  }
}
