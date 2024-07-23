import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    // MatFormFieldModule,
    // MatInputModule,
    FormsModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private router: Router,

  ) {

  }
  navigateToAbout() {
  
    this.router.navigate(['navbar', 'dashboard']);
 
  }

}
