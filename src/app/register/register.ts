import { Component } from '@angular/core';
import {Usuaris} from '../serveis/usuaris';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  nom: string= ""
  constructor(private Usuarisss: Usuaris) {
  }
}
