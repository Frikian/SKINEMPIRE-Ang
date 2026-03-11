import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuaris } from '../serveis/usuaris';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header implements OnInit, OnDestroy {
  private sub!: Subscription;
  private userSub!: Subscription;
  nombreUsuario: string | null = null;

  internet: string = '1000';
  usuarios: string = '1.500.000';
  armas: string = '1.500.000';

  constructor(public usuarioService: Usuaris) {}

  ngOnInit() {
    this.userSub = this.usuarioService.currentUser$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });

    this.sub = interval(2000).subscribe(() => {
      this.internet = (Math.floor(Math.random() * (1250 - 1000 + 1)) + 1000).toString();
      this.usuarios = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toLocaleString('es-ES');
      this.armas    = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toLocaleString('es-ES');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}
