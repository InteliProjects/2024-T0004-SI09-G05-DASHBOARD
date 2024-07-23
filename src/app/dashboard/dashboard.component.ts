import { Component, ViewChild } from '@angular/core';
import { ApiconnectService } from '../services/apiconnect.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CidMonthDTO } from '../DTOs/CidMonthDTO';
import { Observable } from 'rxjs';
import { GptwAnswersDTO } from '../DTOs/GptwAnswersDTO';
import { EmpSegDTO } from '../DTOs/EmpSegDTO';
import { CidCausaDTO } from '../DTOs/CidCausaDTO';
import { CidDiretoriaDTO } from '../DTOs/CidCausaDTO';
import { CidDoencaMax } from '../DTOs/CidCausaDTO';
import { StibaAverageEngDTO } from '../DTOs/StibaAverageEngDTO';
import { HttpResponse } from '@angular/common/http';
interface YAxisAnnotations {
  yaxis: {
    y: number;
    borderColor: string;
    label: {
      borderColor: string;
      style: {
        color: string;
        background: string;
      };
      text: string;
    };
  }[];
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis & { annotations?: YAxisAnnotations };
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotoptions: ApexPlotOptions;
  responsive: any[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('lineChart') lineChart!: ChartComponent;
  @ViewChild('barChart') barChart!: ChartComponent;
  @ViewChild('secondBarChart') secondBarChart!: ChartComponent;
  cidDoenca: string | undefined;
  cidDoencaData: number | undefined;
  cidCausaData: CidCausaDTO[] = [];  // Initialize as an empty array


  public chartOptions: Partial<ChartOptions>;
  public lineChartOptions: Partial<ChartOptions>;
  public barChartOptions: Partial<ChartOptions>;
  public secondBarChartOptions: Partial<ChartOptions>;
  selectedDisease: any;

  constructor(private apiConnect: ApiconnectService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 200,
        width: 400,
        type: 'bar',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Quantidade de Empregados por Segmento',
        align: 'left',
      },
      xaxis: {
        categories: ['Mensalista', 'Horista', 'HD', 'Executivo'],
      },
      yaxis: {
        title: {
          text: 'Quantidade de Empregados',
        },
      },
    };

    this.lineChartOptions = {
      series: [],
      chart: {
        height: 290,
        width: 560,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Número de Atestados por Mês e Unidade',
        align: 'left',
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Número de Atestados',
        },
      },
    };
  

    this.barChartOptions = {
      series: [],
      chart: {
        height: 290,
        width: 600,
        type: 'bar',
        zoom: {
          enabled: false,
        },
      },
      plotoptions: {
        bar: {
                    horizontal: false,
          columnWidth: '70%', // Ajuste a largura das barras, porcentagem ou número
          barHeight: '80%', // Ajuste a altura das barras, porcentagem ou número
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Número de Atestados de Ansiedade por Diretoria',
        align: 'left',
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Número de Atestados',
        },
        min: 0, // Defina o valor mínimo do eixo Y
        max: 250, // Defina o valor máximo do eixo ,
      },
    };

    this.secondBarChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      plotoptions: {
        bar: {
          columnWidth: '70%',
          borderRadius: 5
        }
      },
    
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
           const disease = w.config.series[seriesIndex].name;
           // Aqui você pode tentar acessar os dados de uma maneira que garanta que eles estejam disponíveis
           // Por exemplo, você pode tentar usar uma variável que é atualizada sempre que os dados são carregados
           const cause = this.cidCausaData.find(item => item.doenca === disease)?.causa_raiz;

           return `<div class="custom-tooltip">
                     <p><strong>Causa Raiz:</strong> ${cause}</p>
                     <p><strong>Doença:</strong> ${disease}</p>
                      <p><strong>Quantidade:</strong> ${series[seriesIndex][dataPointIndex]}</p>
                   </div>`;
        }
       }
       ,
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: -45
        }
      },
      yaxis: {
        title: {
          text: 'Quantidade de Casos'
        }
      },
      title: {
        text: 'Doenças por causa raiz de maior prevalência',
        align: 'left'
      },
      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 300,
              width: '100%'
            },
            plotOptions: {
              bar: {
                columnWidth: '50%'
              }
            }
          }
        }
      ]
  };
}
  ngOnInit() {
    this.loadData();
    // Retornar getDoencaMax dentro de uma variável
    this.apiConnect.getDoencaMax().subscribe((response: HttpResponse<CidDoencaMax[]>) => {
      if (response.body) {
        const doencas = response.body;
        this.cidDoenca = doencas[0].Doenca;
        console.log(doencas[0].quantidade_total);
        this.cidDoencaData = doencas[0].quantidade_total;
      }
    });     
  
  }
  loadData(): void {
    this.apiConnect.getCid2023Month().subscribe((data: CidMonthDTO[]) => {
      const units: string[] = [];
      const seriesData: any[] = [];
      const months: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];


      
      // Loop para extrair unidades únicas
      data.forEach(item => {
        if (!units.includes(item.unidade)) {
          units.push(item.unidade);
        }
      });

      // Loop para criar séries de dados para cada unidade
      units.forEach(unit => {
        const unitData = data.filter(item => item.unidade === unit);
        const series = {
          name: unit,
          data: Array(12).fill(null) // initialize with null values for all months
        };

        // Fill the series data with actual values where available
        unitData.forEach(monthData => {
          const index = months.indexOf(monthData.mes);
          if (index !== -1) {
            series.data[index] = monthData.total_atestados;
          }
        });

        seriesData.push(series);
      });

      this.lineChartOptions.series = seriesData;
      this.lineChartOptions.xaxis!.categories = months;

    });
     this.apiConnect.getDiretoria().subscribe((data: CidDiretoriaDTO[]) => {
      const diretoria: string[] = [];
      const seriesData: any[] = [];

      // Loop para extrair unidades únicas
      data.forEach(item => {
        if (!diretoria.includes(item.diretoria)) {
          diretoria.push(item.diretoria);
        }
      });

      // Loop para criar séries de dados para cada unidade
      diretoria.forEach(unit => {
        const unitData = data.filter(item => item.diretoria === unit);
        const series = {
          name: unit,
          data: []
        };

        // Preencher os dados da série com valores reais onde disponíveis
        diretoria.forEach(unit => {
          const foundData = unitData.find(item => item.diretoria === unit);
          if (foundData) {
            (series.data as number[]).push(foundData.atestados);
          } else {
            (series.data as number[]).push(0); // Se não houver dados para a unidade, preencha com 0
          }
        });

        seriesData.push(series);
      });

      this.barChartOptions.xaxis!.categories = diretoria;
      this.barChartOptions.series = seriesData;
  
    });
    this.apiConnect.getEmpSeg().subscribe((data: EmpSegDTO[]) => {
      const segmentos: string[] = [];
      const seriesData: any[] = [];

      // Loop para extrair segmentos únicos
      data.forEach(item => {
        if (!segmentos.includes(item.tipo_de_empregado)) {
          segmentos.push(item.tipo_de_empregado);
        }
      });

      // Loop para criar séries de dados para cada segmento
      segmentos.forEach(segmento => {
        const segmentoData = data.filter(item => item.tipo_de_empregado === segmento);
        const totalEmpregados = segmentoData.reduce((total, empregado) => total + empregado.quantidade_de_empregados, 0);
        seriesData.push(totalEmpregados);
      });

      this.chartOptions.xaxis!.categories = segmentos;
      this.chartOptions.series = [{ data: seriesData }];
    });
    this.apiConnect.getCausaRaiz().subscribe((response: HttpResponse<CidCausaDTO[]>) => {
      if (response.body) {
         this.cidCausaData = response.body;
     
         // Filtrar por doença (opcional)
         if (this.selectedDisease) {
           this.cidCausaData = this.cidCausaData.filter(item => item.doenca === this.selectedDisease);
         }
     
         // Preparar dados para o gráfico
         const seriesData: any[] = [];
         const diseases: string[] = [];
         this.cidCausaData.forEach(item => {
           if (!diseases.includes(item.doenca)) {
             diseases.push(item.doenca);
           }
         });
     
         diseases.forEach(disease => {
           const diseaseData = this.cidCausaData.filter(item => item.doenca === disease);
           seriesData.push({
             name: disease,
             data: diseaseData.map(item => item.quantidade)
           });
         });
     
         // Configurar as opções do gráfico
         this.secondBarChartOptions.xaxis!.categories = diseases;
         this.secondBarChartOptions.series = seriesData;
      }
     });
      
    
      
      
      
      
      // Fictitious data for the bar chart
      const barSeries = [
      {
        name: 'Taubaté',
        data: [60, 60, 70, 70, 65, 65, 65, 45, 45, 80, 60, 65]
      },
      {
        name: 'Anchieta',
        data: [50, 50, 50, 35, 45, 25, 30, 45, 40, 40, 35, 30]
      },
      {
        name: 'São Carlos',
        data: [20, 30, 25, 40, 40, 40, 30, 30, 30, 30, 40, 20]
      },
      {
        name: 'São José dos Pinhais',
        data: [70, 70, 65, 50, 50, 50, 40, 40, 30, 35, 35, 35]
      }
      ];
      
      this.barChartOptions.series = barSeries;
      
      // Fictitious data for the second bar chart (quarto gráfico)
      const secondBarSeries = [
      {
        name: 'Taubaté',
        data: [55, 65, 75, 65, 60, 70, 75, 55, 50, 70, 55, 60]
      },
      {
        name: 'Anchieta',
        data: [45, 55, 60, 40, 50, 30, 35, 50, 45, 50, 40, 35]
      },
      {
        name: 'São Carlos',
        data: [15, 25, 30, 35, 35, 40, 25, 20, 25, 25, 30, 15]
      },
      {
        name: 'São José dos Pinhais',
        data: [65, 70, 60, 45, 55, 55, 45, 45, 35, 40, 40, 40]
      }
      ];
      
      this.secondBarChartOptions.series = secondBarSeries;
      

  }


}