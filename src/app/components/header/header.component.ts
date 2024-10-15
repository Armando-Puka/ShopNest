import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  currentUser = computed(() => this.authService.getCurrentUser()); // Get the reactive signal for current user
  categories: Category[] = [];
  dropdownVisible: boolean = false;
  cartCount: number = 0;

  constructor(private router: Router, private authService: AuthService, private categoryService: AdminCategoryService, private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to card updates and update cart count
    this.cartService.cart$.subscribe((cartItems) => {
      this.cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    });
    this.loadCategories(); // Fetch categories on initialization
  }

  // Fetch categories from the service
  loadCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  // Toggle the visibility of the dropdown
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onSearch(): void {
    if (this.searchTerm) {
      console.log(`Searching for: ${this.searchTerm}`);

      this.searchTerm = '';
    } else {
      console.log('Please enter a search term.');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
