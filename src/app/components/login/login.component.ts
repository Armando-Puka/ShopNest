import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // usernameOrEmail: string = '';
  // password: string = '';

  username: string = '';
  password: string = '';
  loginError: boolean = false;
  // errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // onLogin(): void {
  //   // Retrieve users from local storage
  //   const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

  //   // Check if the username/email and password match any stored user
  //   const foundUser = storedUsers.find(
  //     (user: any) =>
  //       (user.username === this.usernameOrEmail || user.email === this.usernameOrEmail) && user.password === this.password
  //   );

  //   if (foundUser) {
  //     // Store the logged-in user in local storage
  //     localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
  //     console.log('Login successful!');

  //     // Redirect to home
  //     this.router.navigate(['/']);
  //   } else {
  //     console.error('Invalid username/email or password')
  //   }

  //   // if (this.usernameOrEmail && this.password) {
  //   //   console.log(`Logging in with Username: ${this.usernameOrEmail}, Password: ${this.password}`);

  //   //   this.usernameOrEmail = '';
  //   //   this.password = '';
  //   // } else {
  //   //   console.log('Please fill in all fields.');
  //   // }
  // }


  onLogin(loginForm: NgForm): void {
    if (!loginForm.valid) {
      console.error('Please fill in all fields.');
      return;
    }

    const loginSuccess = this.authService.login(this.username, this.password);

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
