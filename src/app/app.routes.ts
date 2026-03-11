import { Routes } from '@angular/router';
import { Carrito } from  './carrito/carrito';
import {Index} from './index';
import {Contacto} from './contacto/contacto';
import {Hdtw} from './hdtw/hdtw';
import {Login} from './login/login';
import {PoliticaDeReembolso} from './politica-de-reembolso/politica-de-reembolso';
import {PreguntasFrecuentes} from './preguntas-frecuentes/preguntas-frecuentes';
import {Register} from './register/register';
import {TerminosYCondiciones} from './terminos-y-condiciones/terminos-y-condiciones';
import {Tienda} from './tienda/tienda';
import {Venta} from './venta/venta';
import {VerifyEmail} from './verify-email/verify-email';


export const routes: Routes = [
  {path: 'carrito', component: Carrito},
  {path: '', component: Index},
  {path: 'contacto', component: Contacto},
  {path: 'hdtw', component: Hdtw},
  {path: 'index', component: Index},
  {path: 'login', component: Login},
  {path: 'politica-de-reembolso', component: PoliticaDeReembolso},
  {path: 'preguntas-frecuentes', component: PreguntasFrecuentes},
  {path: 'register', component: Register},
  {path: 'terminos-y-condiciones', component: TerminosYCondiciones},
  {path: 'tienda', component: Tienda},
  {path: 'venta', component: Venta},
  {path: 'verify-email', component: VerifyEmail}
];
