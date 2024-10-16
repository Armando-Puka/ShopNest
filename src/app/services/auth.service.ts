import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to track the logged-in user status
  private userSignal = signal<string | null>(null); // Holds the username or null if not logged in

  constructor(private router: Router) {
    // Check localstorage for an existing session on service initialization
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      this.userSignal.set(loggedInUser);
    } 
  }

  // Method to log in a user
  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => (user.username === username || user.email === username));

    if (user && bcrypt.compareSync(password, user.password)) {
      localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, role: user.role })); // Store the logged-in user in local storage
      this.userSignal.set(username); // Update the signal
      return true;
    }
    return false;
  }

  // Method to log out a user
  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.userSignal.set(null); // Reset the user signal
    this.router.navigate(['/login']);
  }

  // Method to get the current user signal
  getCurrentUserSignal() {
    return this.userSignal;
  }

   // Method to get the current user's username and role
   getCurrentUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    this.getCurrentUserSignal()();
    return loggedInUser ? JSON.parse(loggedInUser) : null; // Return username and role
  }
}
