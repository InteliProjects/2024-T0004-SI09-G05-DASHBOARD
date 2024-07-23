import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ApiconnectService } from '../services/apiconnect.service';
import { StibaAverageLocalDTO } from '../DTOs/StibaAverageLocalDTO';
import { HttpResponse } from '@angular/common/http';
import { StibaAverageEngDTO } from '../DTOs/StibaAverageEngDTO';
import { GptwAverageEng } from '../DTOs/GptwAverageEng';

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
};

@Component({
  selector: 'app-engajamento',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './engajamento.component.html',
  styleUrl: './engajamento.component.css'
})
export class EngajamentoComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  stibaSatisfaction: number | undefined;
  stibaEngagement: number | undefined;
  gptwEngagement: number | undefined;
  series: any;
  chartSeries: { name: string; data: number[]; }[] | undefined;

  unitColors: { [unit: string]: string } = {
    ANC: '#FF5733', // Define a cor para a unidade ANC
    SCA: '#33FF57', // Define a cor para a unidade SCA
    TAU: '#3357FF'  // Define a cor para a unidade TAU
  };

  constructor(private apiConnect: ApiconnectService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        width: 700,
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
        text: 'Média Nota Stiba por Unidade',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#F3F3F3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['ANC', 'SCA', 'TAU'], // Plant categories
        labels: {
          rotate: 0 // Ajuste o valor do ângulo de rotação dos rótulos no eixo X (em graus)
        }
      },
      yaxis: {},
    };
  }

  ngOnInit() {
    this.apiConnect.getStibaLocalGrade().subscribe((response: HttpResponse<StibaAverageLocalDTO[]>) => {
      const data = response.body;
      const series = [
        {
          name: 'Média Nota Stiba',
          data: [
            { x: 'ANC', y: data && Math.round(data[0]?.average_nota_stiba) },
            { x: 'SCA', y: data && Math.round(data[1]?.average_nota_stiba) },
            { x: 'TAU', y: data && Math.round(data[2]?.average_nota_stiba) },
          ]
        }
      ];

      this.chartOptions.series = series.map(item => ({
        name: item.name,
        data: item.data.map(dataItem => ({
          x: dataItem.x,
          y: typeof dataItem.y === 'string' ? null : dataItem.y,
          color: this.unitColors[dataItem.x] // Applying the color based on unit
        })),
      }));

      if (!this.chartOptions.yaxis!.annotations) {
        this.chartOptions.yaxis!.annotations = { yaxis: [] };
      }

      const yaxisAnnotations = [
        {
          y: 3500,
          borderColor: '#000',
          label: {
            borderColor: '#000',
            style: { color: '#000', background: '#00E396' },
            text: 'Média nota Stiba: 3500',
          },
        },
        {
          y: 2800,
          borderColor: '#000',
          label: {
            borderColor: '#000',
            style: { color: '#fff', background: '#FF4560' },
            text: 'Unidades: 2800',
          },
        }
      ];
      this.chartOptions.yaxis!.annotations!.yaxis = yaxisAnnotations;
      
    });
  
    this.apiConnect.getStibaGrade().subscribe((response: number) => {
      this.stibaSatisfaction = response;
    });
    this.apiConnect.getStibaEng().subscribe((response: HttpResponse<StibaAverageEngDTO[]>) => {
      if (response.body) {
        const engagementData = response.body;
        this.stibaEngagement = Math.round(engagementData[0].avg); 
      }
    });
    this.apiConnect.getGptwEng().subscribe((response: HttpResponse<GptwAverageEng[]>) => {
      if (response.body) {
        const engagementData = response.body;
        this.gptwEngagement = Math.round(engagementData[0].engagement_percent);
      }
    });
  }
}
