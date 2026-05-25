import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactoService } from '../serveis/contacto';
import { CaptchaComponent } from '../components/captcha/captcha';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule, CaptchaComponent],
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

  captchaValid = false;
  captchaRequired = false;

  @ViewChild('captchaRef') captchaRef!: CaptchaComponent;

  constructor(private contactoService: ContactoService) {}

  onCaptchaValidated(valid: boolean): void {
    this.captchaValid = valid;
    if (valid) {
      this.captchaRequired = false;
    }
  }

  enviarFormulario() {
    if (!this.nombre || !this.email || !this.motivo || !this.mensaje) return;

    // Forçar validació del CAPTCHA abans d'enviar
    const result = this.captchaRef?.validate();
    if (!result) {
      this.captchaRequired = true;
      this.exito = false;
      return;
    }

    this.enviando = true;
    this.exito = false;
    this.error = false;
    this.captchaRequired = false;

    this.contactoService
      .enviarMensaje({
        nombre: this.nombre,
        email: this.email,
        motivo: this.motivo,
        mensaje: this.mensaje,
      })
      .subscribe({
        next: () => {
          this.exito = true; // Mostrarà "Enviat"
          this.enviando = false;
          this.nombre = '';
          this.email = '';
          this.motivo = '';
          this.mensaje = '';
          // Reiniciar CAPTCHA per a un futur enviament
          this.captchaValid = false;
          this.captchaRef?.refresh();
        },
        error: () => {
          this.error = true;
          this.enviando = false;
        },
      });
  }
}
