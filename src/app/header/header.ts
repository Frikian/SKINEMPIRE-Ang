import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {Usuaris} from '../serveis/usuaris';

@Component({
  selector: 'app-header',
    imports: [
        RouterLink
    ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  protected readonly Usuaris = Usuaris;
}
