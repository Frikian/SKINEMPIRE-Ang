import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Usuaris} from '../serveis/usuaris';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header implements OnInit{
  private sub!: Subscription;
  nombreUsuario: string | null = null;

  constructor(public usuarioService: Usuaris) {
    nom: "";
  }

  ngOnInit() {
    this.usuarioService.currentUser$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    this.sub = interval(2000).subscribe(() => {
      document.getElementById("internet")!.textContent = (Math.floor(Math.random() * (1250 - 1000 + 1)) + 1000).toString()
      document.getElementById("usuarios")!.textContent = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toString()
      document.getElementById("armas")!.textContent = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toString()
    })})
  }
}

