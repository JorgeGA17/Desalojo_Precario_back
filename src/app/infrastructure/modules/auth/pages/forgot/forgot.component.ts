import { Component } from '@angular/core';

import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'sp-forgot',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent {
  email = '';
  sent = false;
  loading = false;
  error = '';

  submit() {
    this.error = '';
    if (!this.email.trim()) {
      this.error = 'Ingresa tu correo institucional';
      return;
    }
    this.loading = true;
    // TODO: llamar a servicio remoto: POST /auth/forgot-password
    setTimeout(() => {
      this.loading = false;
      this.sent = true;
    }, 500);
  }
}