import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    usuari: "",
    correu: "",
    contrasenya: ""
  }

  constructor(private router: Router) {}

  onRegister() {
    sessionStorage.setItem('user', JSON.stringify(this.user));
    alert('Registre completat correctament!');
    this.router.navigate(['/login']);
  }
}
