import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    // Check if the user is logged in
    const isLoggedIn = this.authService.getCurrentUser();

    if (!isLoggedIn) {
      // If the user is logged in, redirect to home
      return true; // Prevent access to the route
    }
    this.router.navigate(['/']);
    return false; // Allow access if not logged in
  }
}

@Injectable({
  providedIn: 'root',
})
export class GeneralGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Get the currently logged-in user
    const currentUser = this.authService.getCurrentUser();

    // Check if the user is logged in and has the "admin" role
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}