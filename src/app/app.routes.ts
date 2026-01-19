import { Routes } from '@angular/router';
import { Carrito } from  './carrito/carrito';
import {Index} from './index';


export const routes: Routes = [
  {path: 'carrito', component: Carrito},
  {path: '', component: Index},

];
