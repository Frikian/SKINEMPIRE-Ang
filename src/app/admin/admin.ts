import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { EstadisticasService, VentaPorDiaProducto, OfertaVsSinOferta } from '../serveis/estadisticas.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  carregant: boolean = true;
  error: string = '';
  historial: any[] = [];

  private chartVentasPorProducto: Chart | null = null;
  private chartOfertaVsSinOferta: Chart | null = null;

  constructor(private estadisticasService: EstadisticasService, private http: HttpClient) {}

  ngOnInit() {
    this.cargarHistorial();
    this.cargarEstadisticas();
  }

  cargarHistorial() {
    this.http.get<any[]>('http://localhost:4020/api/historial').subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
      }
    });
  }

  cargarEstadisticas() {
    this.estadisticasService.getEstadisticasAdmin().subscribe({
      next: (data) => {
        this.crearGraficos(data.ventasPorDiaProducto, data.ofertaVsSinOferta);
        this.carregant = false;
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.error = 'Error al cargar las estadísticas.';
        this.carregant = false;
      }
    });
  }

  private crearGraficos(ventasPorProducto: VentaPorDiaProducto[], ofertaVsSinOferta: OfertaVsSinOferta[]) {
    this.crearGraficoVentasPorProducto(ventasPorProducto);
    this.crearGraficoOfertaVsSinOferta(ofertaVsSinOferta);
  }

  private crearGraficoVentasPorProducto(datos: VentaPorDiaProducto[]) {
    const productosMap = new Map<string, { fechas: string[], cantidades: number[] }>();

    datos.forEach(d => {
      if (!productosMap.has(d.producto)) {
        productosMap.set(d.producto, { fechas: [], cantidades: [] });
      }
      const entry = productosMap.get(d.producto)!;
      entry.fechas.push(d.fecha);
      entry.cantidades.push(d.cantidad);
    });

    const datasets = Array.from(productosMap.entries()).map(([producto, data], index) => {
      const colores = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ];
      return {
        label: producto,
        data: data.cantidades,
        borderColor: colores[index % colores.length],
        backgroundColor: colores[index % colores.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      };
    });

    const todasLasFechas = Array.from(new Set(datos.map(d => d.fecha))).sort();

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: todasLasFechas,
        datasets: datasets as any
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: { color: '#E8EBF7', font: { size: 12 } }
          },
          title: {
            display: true,
            text: 'Cantidad vendida por día y producto',
            color: '#FDEBB7',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#E8EBF7' },
            grid: { color: '#3a3a3a' },
            title: { display: true, text: 'Cantidad', color: '#E8EBF7' }
          },
          x: {
            ticks: { color: '#E8EBF7' },
            grid: { color: '#3a3a3a' },
            title: { display: true, text: 'Fecha', color: '#E8EBF7' }
          }
        }
      }
    };

    const ctx = document.getElementById('chartVentasProducto') as HTMLCanvasElement;
    if (ctx) {
      if (this.chartVentasPorProducto) this.chartVentasPorProducto.destroy();
      this.chartVentasPorProducto = new Chart(ctx, config);
    }
  }

  private crearGraficoOfertaVsSinOferta(datos: OfertaVsSinOferta[]) {
    const datosOferta = datos.filter(d => d.oferta === true);
    const datosSinOferta = datos.filter(d => d.oferta === false);
    const todasLasFechas = Array.from(new Set(datos.map(d => d.fecha))).sort();

    const cantidadesOferta = todasLasFechas.map(fecha => {
      const encontrado = datosOferta.find(d => d.fecha === fecha);
      return encontrado ? encontrado.cantidad : 0;
    });

    const cantidadesSinOferta = todasLasFechas.map(fecha => {
      const encontrado = datosSinOferta.find(d => d.fecha === fecha);
      return encontrado ? encontrado.cantidad : 0;
    });

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: todasLasFechas,
        datasets: [
          {
            label: 'Con Oferta',
            data: cantidadesOferta,
            borderColor: '#FF6384',
            backgroundColor: '#FF638420',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Sin Oferta',
            data: cantidadesSinOferta,
            borderColor: '#36A2EB',
            backgroundColor: '#36A2EB20',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: { color: '#E8EBF7', font: { size: 12 } }
          },
          title: {
            display: true,
            text: 'Comparativa: Productos en Oferta vs Sin Oferta',
            color: '#FDEBB7',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#E8EBF7' },
            grid: { color: '#3a3a3a' },
            title: { display: true, text: 'Cantidad Total de Ventas', color: '#E8EBF7' }
          },
          x: {
            ticks: { color: '#E8EBF7' },
            grid: { color: '#3a3a3a' },
            title: { display: true, text: 'Fecha', color: '#E8EBF7' }
          }
        }
      }
    };

    const ctx = document.getElementById('chartOfertaVsSinOferta') as HTMLCanvasElement;
    if (ctx) {
      if (this.chartOfertaVsSinOferta) this.chartOfertaVsSinOferta.destroy();
      this.chartOfertaVsSinOferta = new Chart(ctx, config);
    }
  }

  ngOnDestroy() {
    if (this.chartVentasPorProducto) this.chartVentasPorProducto.destroy();
    if (this.chartOfertaVsSinOferta) this.chartOfertaVsSinOferta.destroy();
  }
}
