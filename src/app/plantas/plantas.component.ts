import { Component, ViewChild } from '@angular/core';
import { ApiconnectService } from '../services/apiconnect.service';
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
  ApexNonAxisChartSeries
} from 'ng-apexcharts';
import { UnidadeResponse } from '../models/interfaces/Iunidade';
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
};


export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels?: string[];
  colors?: string[];
  dataLabels?: ApexDataLabels;
};


export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels?: string[];
  colors?: string[];
};

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.css'],
})
export class PlantasComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public valorDestaque: number = 57; // Adicione esta linha
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;


  constructor(private apiConnect: ApiconnectService) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        width: 500,
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
        text: 'Número de colaboradores X Número de atestados X Planta',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#F3F3F3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['TBT', 'ANC', 'SJP', 'SCA'], // Defina as categorias das plantas aqui
      },
      yaxis: {
        annotations: {
          yaxis: [], // Os valores das médias serão inseridos dinamicamente
        },
      },
    };

  this.chartOptions2 = {
    series :[0],
    chart: {
      height: 150,
      type: 'radialBar'
    },
    labels: ['TBT'],
    colors: ['#008000'],
    dataLabels: {
      style: {
        fontSize: '200px' 
      }
    }  
  };

  this.chartOptions3 = {
    series :[0],
    chart: {
      height: 150,
      type: 'radialBar'
    },
    labels: ['SJP'],
    colors: ['#FF0000']
  };

  }

  ngOnInit() {
    this.apiConnect.getCid2023EmployeesCertificate().subscribe((response: HttpResponse<UnidadeResponse>) => {
       const data = response.body;
   
       // Ensure that undefined values are replaced with null
       const series = [
         {
           name: 'Colaboradores',
           data: [
             data?.TBT.colaboradores ?? null,
             data?.ANC.colaboradores ?? null,
             data?.SJP.colaboradores ?? null,
             data?.SCA.colaboradores ?? null
           ]
         },
         {
           name: 'Atestados',
           data: [
             data?.TBT.atestados ?? null,
             data?.ANC.atestados ?? null,
             data?.SJP.atestados ?? null,
             data?.SCA.atestados ?? null
           ]
         }
       ];
       this.chartOptions.series = series;
   
       // Ensure yaxis.annotations is defined before assigning
       if (!this.chartOptions.yaxis!.annotations) {
         this.chartOptions.yaxis!.annotations = { yaxis: [] };
       }
   
       // Adicione as anotações de média ao eixo Y
       const yaxisAnnotations = [
         {
           y: 3500,
           borderColor: '#000',
           label: {
             borderColor: '#000',
             style: { color: '#000', background: '#00E396' },
             text: 'Média Colaboradores: 3500',
           },
         },
         {
           y: 2800,
           borderColor: '#000',
           label: {
             borderColor: '#000',
             style: { color: '#fff', background: '#FF4560' },
             text: 'Média Atestados: 2800',
           },
         }
       ];
       this.chartOptions.yaxis!.annotations!.yaxis = yaxisAnnotations;
    });
   }
}   