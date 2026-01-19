import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Index} from './index';
import {Header} from './header/header';
import {Footer} from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Index, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SKINEMPIRE-Ang');
}
