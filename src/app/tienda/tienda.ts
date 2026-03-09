import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoServei } from '../serveis/carrito-servei';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule
  ],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css'],
})
export class Tienda {

  productes: number[]
  skins = [
    {
      id: 1, nombre: 'AK-47 | Redline', precio: 210, estado: 'Factory New', rareza: 'C',
      imagen: 'assets/AK47Redline.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 2, nombre: 'M4A4 | Howl', precio: 5333, estado: 'Minimal Wear', rareza: 'P.C',
      imagen: 'assets/M4A4Howl.png',
      descripcion: 'Skin con diseño táctico en rojo y negro. Desgaste mínimo, ideal para coleccionistas.'
    },
    {
      id: 3, nombre: 'AWP | Asiimov', precio: 320, estado: 'Field-Tested', rareza: 'R',
      imagen: 'assets/AWPAsiimov.png',
      descripcion: 'Skin futurista en blanco, negro y naranja. Muy popular entre jugadores.'
    },
    {
      id: 4, nombre: 'Glock-18 | Fade', precio: 950, estado: 'Factory New', rareza: 'M',
      imagen: 'assets/Glock18Fade.png',
      descripcion: 'Degradado brillante con acabado premium. Muy buscada en el mercado.'
    },
    {
      id: 5, nombre: 'Desert Eagle | Blaze', precio: 780, estado: 'Minimal Wear', rareza: 'L',
      imagen: 'assets/DesertEagleBlaze.png',
      descripcion: 'Clásico diseño con llamas. Una de las skins más icónicas de la Deagle.'
    },
    {
      id: 6, nombre: 'USP-S | Kill Confirmed', precio: 260, estado: 'Field-Tested', rareza: 'R',
      imagen: 'assets/USPSKillConfirmed.png',
      descripcion: 'Diseño agresivo con ilustración de bala atravesando un cráneo.'
    },
    {
      id: 7, nombre: 'M4A1-S | Hyper Beast', precio: 180, estado: 'Minimal Wear', rareza: 'M',
      imagen: 'assets/M4A1SHyperBeast.png',
      descripcion: 'Arte colorido y monstruoso muy popular en rifles silenciados.'
    },
    {
      id: 8, nombre: 'AK-47 | Neon Rider', precio: 420, estado: 'Field-Tested', rareza: 'L',
      imagen: 'assets/AK47NeonRider.png',
      descripcion: 'Estética cyberpunk con colores neón y estilo retro.'
    },
    {
      id: 9, nombre: 'AWP | Dragon Lore', precio: 1650, estado: 'Well-Worn', rareza: 'P.C',
      imagen: 'assets/AWPDragonLore.png',
      descripcion: 'Legendaria skin con dragón dorado. Extremadamente rara.'
    },
    {
      id: 10, nombre: 'P90 | Death by Kitty', precio: 95, estado: 'Factory New', rareza: 'C',
      imagen: 'assets/P90DeathByKitty.png',
      descripcion: 'Diseño vibrante con gatos estilizados y colores intensos.'
    },
    {
      id: 11, nombre: 'MP7 | Bloodsport', precio: 70, estado: 'Minimal Wear', rareza: 'R',
      imagen: 'assets/MP7Bloodsport.png',
      descripcion: 'Estética deportiva futurista en rojo, blanco y negro.'
    },
    {
      id: 12, nombre: 'FAMAS | Roll Cage', precio: 55, estado: 'Field-Tested', rareza: 'C',
      imagen: 'assets/FAMASRollCage.png',
      descripcion: 'Diseño mecánico inspirado en estructuras industriales.'
    },
    {
      id: 13, nombre: 'Galil AR | Chatterbox', precio: 110, estado: 'Well-Worn', rareza: 'M',
      imagen: 'assets/GalilARChatterbox.png',
      descripcion: 'Arte urbano con boca de dientes metálicos.'
    },
    {
      id: 14, nombre: 'Five-SeveN | Case Hardened', precio: 240, estado: 'Minimal Wear', rareza: 'R',
      imagen: 'assets/FiveSevenCaseHardened.png',
      descripcion: 'Patrón metálico azul y dorado generado aleatoriamente.'
    },
    {
      id: 15, nombre: 'MAC-10 | Neon Rider', precio: 65, estado: 'Factory New', rareza: 'C',
      imagen: 'assets/MAC10NeonRider.png',
      descripcion: 'Diseño neón inspirado en estética retro futurista.'
    },
    {
      id: 16, nombre: 'SSG 08 | Blood in the Water', precio: 340, estado: 'Minimal Wear', rareza: 'M',
      imagen: 'assets/SSG08BloodInTheWater.png',
      descripcion: 'Ilustración de tiburón agresivo con estilo artístico único.'
    },
    {
      id: 17, nombre: 'UMP-45 | Primal Saber', precio: 85, estado: 'Field-Tested', rareza: 'C',
      imagen: 'assets/UMP45PrimalSaber.png',
      descripcion: 'Arte con tigre dientes de sable en tonos cálidos.'
    },
    {
      id: 18, nombre: 'Tec-9 | Fuel Injector', precio: 60, estado: 'Minimal Wear', rareza: 'R',
      imagen: 'assets/Tec9FuelInjector.png',
      descripcion: 'Diseño industrial amarillo y negro muy llamativo.'
    },
    {
      id: 19, nombre: 'Nova | Hyper Beast', precio: 45, estado: 'Factory New', rareza: 'C',
      imagen: 'assets/NovaHyperBeast.png',
      descripcion: 'Versión escopeta del famoso estilo Hyper Beast.'
    },
    {
      id: 20, nombre: 'Dual Berettas | Cobra Strike', precio: 38, estado: 'Field-Tested', rareza: 'C',
      imagen: 'assets/DualBerettasCobraStrike.png',
      descripcion: 'Diseño clásico con serpiente cobra en tonos rojos.'
    }
  ];


  skinsFiltradas = [...this.skins];

  constructor(private Scarrito: CarritoServei) {
    this.productes = [0, 0, 0, 0, 0, 0];
  }
  // Filtrillos
  busqueda: string = '';
  rarezaSeleccionada: string = '';
  estadoSeleccionado: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  // Opciones de los filtros
  rarezas = ['C', 'P.C', 'R', 'M', 'L', 'A'];
  estados = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

  protected afegirCarrito(id: number) {
    this.productes[id - 1]++;
    this.Scarrito.agregarProducto(id);
  }
  aplicarFiltros() {
    this.skinsFiltradas = this.skins.filter(skin => {
      const cumpleBusqueda = !this.busqueda ||
        skin.nombre.toLowerCase().includes(this.busqueda.toLowerCase());

      const cumpleRareza = !this.rarezaSeleccionada ||
        skin.rareza === this.rarezaSeleccionada;

      const cumpleEstado = !this.estadoSeleccionado ||
        skin.estado === this.estadoSeleccionado;

      const cumplePrecioMin = this.precioMin === null ||
        skin.precio >= this.precioMin;

      const cumplePrecioMax = this.precioMax === null ||
        skin.precio <= this.precioMax;

      return cumpleBusqueda && cumpleRareza && cumpleEstado &&
        cumplePrecioMin && cumplePrecioMax;
    });
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.rarezaSeleccionada = '';
    this.estadoSeleccionado = '';
    this.precioMin = null;
    this.precioMax = null;
    this.skinsFiltradas = [...this.skins];
  }

  getRarezaClass(rareza: string): string {
    const clases: { [key: string]: string } = {
      'C': 'comun',
      'P.C': 'pococomun',
      'R': 'raro',
      'M': 'mitico',
      'L': 'legendario',
      'A': 'ancestral'
    };
    return clases[rareza] || '';
  }
}
