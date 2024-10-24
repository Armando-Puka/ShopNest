import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login.component.scss']
})
export class LoginComponent {
  loginError: boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required || Validators.email]),
    password: new FormControl(null, Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(controlName => {
        this.loginForm.controls[controlName].markAllAsTouched();
        this.loginForm.controls[controlName].markAsDirty();
      });

      return;
    }

    const loginSuccess = this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);

    if (loginSuccess) {
      console.log('Login successful!');
      this.loginError = false;
      this.authService.onLogin.emit();
      this.router.navigate(['/']);
    } else {
      console.error('Login failed. Invalid username or password');
      this.loginError = true;
    }
  }

  // Reset loginError when user changes input
  resetLoginError(): void {
    this.loginError = false;
  }
}
