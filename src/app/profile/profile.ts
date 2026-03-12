import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Usuaris } from '../serveis/usuaris';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  nomActual: string = '';
  emailActual: string = '';

  nouNom: string = '';
  nouEmail: string = '';

  missatge: string = '';
  tipusMissatge: 'ok' | 'error' | '' = '';
  editant: boolean = false;
  carregant: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarisService: Usuaris,
    private cgf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const nom = this.usuarisService.currentUser$ && sessionStorage.getItem('currentUserNom');
    if (!nom) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregant = true;

    this.usuarisService.getUsuariByNom(nom).subscribe({
      next: (usuari) => {
        this.nomActual   = usuari.nom;
        this.emailActual = usuari.email;
        this.resetFormulari();
        this.carregant = false;
        this.cgf.detectChanges();
      },
      error: () => {
        this.missatge      = 'Error en carregar les dades del perfil.';
        this.tipusMissatge = 'error';
        this.carregant     = false;
        this.cgf.detectChanges();
      }
    });
  }

  resetFormulari(): void {
    this.nouNom        = this.nomActual;
    this.nouEmail      = this.emailActual;
    this.missatge      = '';
    this.tipusMissatge = '';
  }

  obrirEdicio(): void {
    this.resetFormulari();
    this.editant = true;
  }

  cancelarEdicio(): void {
    this.editant = false;
    this.resetFormulari();
  }

  desarCanvis(): void {
    if (!this.nouNom.trim() || !this.nouEmail.trim()) {
      this.missatge      = 'Tots els camps son obligatoris.';
      this.tipusMissatge = 'error';
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.nouEmail);
    if (!emailValid) {
      this.missatge      = "L'email no té un format vàlid.";
      this.tipusMissatge = 'error';
      return;
    }

    if (this.nouNom.trim() === this.nomActual && this.nouEmail.trim() === this.emailActual) {
      this.editant = false;
      return;
    }

    this.carregant = true;
    this.missatge  = '';

    this.http.patch<any>(`http://localhost:4020/usuaris/${this.nomActual}`, {
      nouNom: this.nouNom.trim(),
      email:  this.nouEmail.trim(),
    }).subscribe({
      next: (res) => {
        this.nomActual   = res.nom;
        this.emailActual = res.email;
        this.usuarisService.setUsuario(res.nom);
        this.missatge      = 'Perfil actualitzat correctament!';
        this.tipusMissatge = 'ok';
        this.editant       = false;
        this.carregant     = false;
        this.cgf.detectChanges();
      },
      error: (err) => {
        this.missatge      = err.error?.mensaje ?? 'Error en actualitzar el perfil.';
        this.tipusMissatge = 'error';
        this.carregant     = false;
        this.cgf.detectChanges();
      }
    });
  }

  tancarSessio(): void {
    this.usuarisService.logout();
    this.router.navigate(['/login']);
  }
}
