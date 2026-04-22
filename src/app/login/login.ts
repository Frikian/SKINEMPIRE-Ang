import { Component } from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Usuaris} from '../serveis/usuaris';
import {HttpClient , HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  mensaje: string = '';
  nombrem: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private usuarioservice: Usuaris, private router: Router, private http:HttpClient) {}

  enviarLogin() {
    this.http.get<any[]>('http://localhost:4020/usuaris').subscribe(usuaris => {
      let loginCorrecte = false;
      for (const usuari of usuaris) {
        if (usuari.nom == this.nombrem && usuari.contrasena == this.contrasena) {
          loginCorrecte = true;
          break;
        }
      }
      if (loginCorrecte) {
        console.log("esta logged in");
        this.error = 'Loggineant';
        this.http.get<any>(`http://localhost:4020/usuaris/${this.nombrem}/admin`).subscribe(resp => {
          if (resp.esAdmin) {
            sessionStorage.setItem('esAdmin', 'true');
          } else {
            sessionStorage.removeItem('esAdmin');
          }
          this.actualizarNombre();
        });
      } else {
        console.log("usuari o contrasenya incorrecta");
        this.error = 'Usuari o contrasenya incorrecte';
      }
    });
  }

  actualizarNombre() {
    this.usuarioservice.setUsuario(this.nombrem);
    this.usuarioservice.cargarCarritoAlLogin(this.nombrem);
    this.router.navigate(['/index']);
  }
}
