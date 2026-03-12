import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Usuaris } from '../serveis/usuaris';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  // Dades actuals llegides de Firestore
  nomActual: string = '';
  emailActual: string = '';

  // Camps del formulari d'edició
  nouNom: string = '';
  nouEmail: string = '';

  // Estat UI
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
    // Obtenim el nom de la sessió (BehaviorSubject o sessionStorage)
    const nom = this.usuarisService.currentUser$ && sessionStorage.getItem('currentUserNom');
    if (!nom) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregant = true;

    // Carreguem les dades reals des de Firestore via backend
    this.usuarisService.getUsuariByNom(nom).subscribe({
      next: (usuari) => {
        this.nomActual   = usuari.nom;
        this.emailActual = usuari.email;
        this.resetFormulari();
        this.carregant = false;
        this.cgf.detectChanges()
      },
      error: () => {
        this.missatge      = 'Error en carregar les dades del perfil.';
        this.tipusMissatge = 'error';
        this.carregant     = false;
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

    // Sense canvis
    if (this.nouNom.trim() === this.nomActual && this.nouEmail.trim() === this.emailActual) {
      this.editant = false;
      return;
    }

    this.carregant = true;
    this.missatge  = '';

    // Escrivim els canvis a Firestore via backend
    this.http.patch<any>(`http://localhost:4020/usuaris/${this.nomActual}`, {
      nouNom: this.nouNom.trim(),
      email:  this.nouEmail.trim(),
    }).subscribe({
      next: (res) => {
        this.nomActual   = res.nom;
        this.emailActual = res.email;

        // Si el nom ha canviat, actualitzem la sessió
        this.usuarisService.setUsuario(res.nom);

        this.missatge      = 'Perfil actualitzat correctament!';
        this.tipusMissatge = 'ok';
        this.editant       = false;
        this.carregant     = false;
      },
      error: (err) => {
        this.missatge      = err.error?.mensaje ?? 'Error en actualitzar el perfil.';
        this.tipusMissatge = 'error';
        this.carregant     = false;
      }
    });
  }

  tancarSessio(): void {
    this.usuarisService.logout();
    this.router.navigate(['/login']);
  }
}
