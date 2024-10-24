import { EventEmitter, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to track the logged-in user status
  private userSignal = signal<string | null>(null); // Holds the username or null if not logged in
  private cartCountSignal = signal<string>('0');
  public onLogout = new EventEmitter<void>();
  public onLogin = new EventEmitter<void>();

  public currentUser = computed(() => this.getCurrentUser());
  public isLoggedIn = computed(() => this.currentUser()?.username);

  constructor(private router: Router) {
    // Check localstorage for an existing session on service initialization
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      this.userSignal.set(loggedInUser);
      this.updateCartCount();
    } 
  }

  // Method to log in a user
  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => (user.username === username || user.email === username));

    if (user && bcrypt.compareSync(password, user.password)) {
      if (!user.cart) {
        user.cart = [];
      }

      localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, role: user.role, cart: user.cart })); // Store the logged-in user in local storage
      this.userSignal.set(username); // Update the signal
      this.updateCartCount();
      this.getCurrentUser();
      return true;
    }
    return false;
  }

  // Method to log out a user
  logout(): void {
    setTimeout(() => {

    if (this.currentUser()) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((user: any) => user.username === this.currentUser().username);

      if (userIndex !== -1) {
        users[userIndex].cart = this.currentUser().cart;

        localStorage.setItem('users', JSON.stringify(users));
      }
    }
    localStorage.removeItem('loggedInUser');
    this.userSignal.set(null); // Reset the user signal
    this.cartCountSignal.set('0');
    this.router.navigate(['/login']);
    this.onLogout.emit();
    }, 500);
  }

  updateCartCount(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.cart) {
      const cartCount = currentUser.cart.reduce((total: number, item: any) => total + item.quantity, 0);
      this.cartCountSignal.set(cartCount);
    } else {
      this.cartCountSignal.set('0');
    }
  }

  getCartCountSignal() {
    return this.cartCountSignal;
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
