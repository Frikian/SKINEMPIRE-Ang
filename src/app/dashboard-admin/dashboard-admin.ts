import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { EstadisticasService, VentaPorDiaProducto, OfertaVsSinOferta } from '../serveis/estadisticas.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit, OnDestroy {
  carregant: boolean = true;
  error: string = '';

  private chartVentasPorProducto: Chart | null = null;
  private chartOfertaVsSinOferta: Chart | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit() {
    console.log('Dashboard inicializado');
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.estadisticasService.getEstadisticasAdmin().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        try {
          this.crearGraficos(data.ventasPorDiaProducto, data.ofertaVsSinOferta);
          console.log('Gráficos creados exitosamente');
        } catch (e) {
          console.error('Error en crearGraficos:', e);
          this.error = 'Error al crear los gráficos.';
        }
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
    console.log('crearGraficos ejecutándose');
    console.log('ventasPorProducto:', ventasPorProducto);
    console.log('ofertaVsSinOferta:', ofertaVsSinOferta);

    if (ventasPorProducto.length > 0) {
      this.crearGraficoVentasPorProducto(ventasPorProducto);
    }

    if (ofertaVsSinOferta.length > 0) {
      this.crearGraficoOfertaVsSinOferta(ofertaVsSinOferta);
    }
  }

  private crearGraficoVentasPorProducto(datos: VentaPorDiaProducto[]) {
    console.log('Creando gráfico 1, datos:', datos);

    // Agrupar por producto
    const productosMap = new Map<string, { fechas: string[], cantidades: number[] }>();

    datos.forEach(d => {
      if (!productosMap.has(d.producto)) {
        productosMap.set(d.producto, { fechas: [], cantidades: [] });
      }
      const entry = productosMap.get(d.producto)!;
      entry.fechas.push(d.fecha);
      entry.cantidades.push(d.cantidad);
    });

    // Crear datasets para cada producto
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

    // Obtener todas las fechas únicas ordenadas
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
            labels: {
              color: '#E8EBF7',
              font: { size: 12 }
            }
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

    // Usar setTimeout para asegurar que el DOM está listo
    setTimeout(() => {
      const ctx = document.getElementById('chartVentasProducto') as HTMLCanvasElement;
      console.log('Canvas 1 encontrado:', ctx);

      if (ctx) {
        if (this.chartVentasPorProducto) {
          this.chartVentasPorProducto.destroy();
        }
        this.chartVentasPorProducto = new Chart(ctx, config);
        console.log('Gráfico 1 creado exitosamente');
      } else {
        console.error('Canvas 1 NO encontrado');
      }
    }, 100);
  }

  private crearGraficoOfertaVsSinOferta(datos: OfertaVsSinOferta[]) {
    console.log('Creando gráfico 2, datos:', datos);

    // Separar datos por oferta y sin oferta
    const datosOferta = datos.filter(d => d.oferta === true);
    const datosSinOferta = datos.filter(d => d.oferta === false);

    const todasLasFechas = Array.from(new Set(datos.map(d => d.fecha))).sort();

    // Crear arrays de cantidades alineadas con las fechas
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
            labels: {
              color: '#E8EBF7',
              font: { size: 12 }
            }
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

    // Usar setTimeout para asegurar que el DOM está listo
    setTimeout(() => {
      const ctx = document.getElementById('chartOfertaVsSinOferta') as HTMLCanvasElement;
      console.log('Canvas 2 encontrado:', ctx);

      if (ctx) {
        if (this.chartOfertaVsSinOferta) {
          this.chartOfertaVsSinOferta.destroy();
        }
        this.chartOfertaVsSinOferta = new Chart(ctx, config);
        console.log('Gráfico 2 creado exitosamente');
      } else {
        console.error('Canvas 2 NO encontrado');
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.chartVentasPorProducto) {
      this.chartVentasPorProducto.destroy();
    }
    if (this.chartOfertaVsSinOferta) {
      this.chartOfertaVsSinOferta.destroy();
    }
  }
}
