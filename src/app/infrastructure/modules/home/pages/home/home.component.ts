import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'sp-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private router = inject(Router);

  goGenerador() { this.router.navigateByUrl('/generador'); }
  goBandeja()   { this.router.navigateByUrl('/bandeja'); }
  logout() {
    // limpia sesión si corresponde
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }
}
