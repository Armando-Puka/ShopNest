import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // username: string = '';
  // password: string = '';
  loginError: boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required || Validators.email]),
    password: new FormControl(null, Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.loginForm.valid) {
      console.error('Please fill in all fields.');
      return;
    }

    const loginSuccess = this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);

    if (loginSuccess) {
      console.log('Login successful!');
      this.loginError = false;
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
