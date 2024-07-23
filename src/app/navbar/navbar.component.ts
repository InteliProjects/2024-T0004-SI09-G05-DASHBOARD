import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,MatButtonModule, MatSidenavModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) {

  }

  handleClick4(event: MouseEvent) {
    this.router.navigate(['navbar', 'bp']);
  }

  handleClick3(event: MouseEvent) {
   this.router.navigate(['navbar', 'engajamento']);
  }

  handleClick2(event: MouseEvent) {
    this.router.navigate(['navbar', 'plantas']);
  }

  handleClick(event: MouseEvent) {
    this.router.navigate(['navbar', 'dashboard']);
  }
}
