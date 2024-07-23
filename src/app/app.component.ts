import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { enviroment } from './enviroment';
import { ApiconnectService } from './services/apiconnect.service';
import { HttpResponse } from '@angular/common/http';
import { UnidadeResponse } from './models/interfaces/Iunidade';
import { StibaAverageEngDTO } from './DTOs/StibaAverageEngDTO';
import { StibaAverageLocalDTO } from './DTOs/StibaAverageLocalDTO';
import { CidMonthDTO } from './DTOs/CidMonthDTO';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard-polo';
  apiUrl: string | undefined;



  ngOnInit() {
    
   
  }
}






