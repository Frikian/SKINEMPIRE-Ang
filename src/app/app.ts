import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Index} from './index';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Index],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SKINEMPIRE-Ang');
}
