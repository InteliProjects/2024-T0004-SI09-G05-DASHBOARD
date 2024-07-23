import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PlantasComponent } from './plantas/plantas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EngajamentoComponent } from './engajamento/engajamento.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'navbar', component: NavbarComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'plantas', component: PlantasComponent },
        { path: 'config', component: LoginComponent },
        { path: 'engajamento', component: EngajamentoComponent},
    ] },

];
