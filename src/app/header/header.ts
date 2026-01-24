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
})
export class Header implements OnInit{
  private sub!: Subscription;

  ngOnInit() {
    this.sub = interval(2000).subscribe(() => {
      document.getElementById("internet")!.textContent = (Math.floor(Math.random() * (1250 - 1000 + 1)) + 1000).toString()
      document.getElementById("usuarios")!.textContent = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toString()
      document.getElementById("armas")!.textContent = (Math.floor(Math.random() * (1600000 - 1500000 + 1)) + 1500000).toString()
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  protected readonly Usuaris = Usuaris;
}
