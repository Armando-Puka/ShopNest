import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  items: MenuItem[] | undefined;

  searchTerm: string = '';
  categories: Category[] = [];
  dropdownVisible: boolean = false;
  cartCount = computed(() => this.authService.getCartCountSignal()());
  public currentUser = this.authService.currentUser;

  private baseMenuItems: MenuItem[] = [
    {
      // routerLinkActiveOptions: {exact:true},
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Categories',
      icon: 'pi pi-star',
      items: this.categories.map((c) => ({ label: c.name })),
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: AdminCategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadHeader();
    
    this.authService.onLogin
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadHeader();
      });
  }

  loadHeader(): void {
    this.items = structuredClone(this.baseMenuItems);

    if (!this.authService.isLoggedIn()) return;

    this.items?.push(
      {
        label: 'My Account',
        icon: 'pi pi-user',
        routerLink: '/account',
      },
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        routerLink: '/cart',
        badge: this.cartCount(),
      }
    );

    if (this.authService.currentUser()?.role === 'admin') {
      this.items?.push({
        label: this.authService.currentUser()?.username,
        icon: 'pi pi-user',
        items: [
          {
            label: 'Manage Products',
            icon: 'pi pi-bolt',
            routerLink: 'admin/products',
          },
          {
            label: 'Manage Categories',
            icon: 'pi pi-server',
            routerLink: 'admin/categories',
          },
          {
            label: 'Add Products',
            icon: 'pi pi-pencil',
            routerLink: 'admin/products/new',
          },
        ],
      });
    }
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
    this.authService.onLogout
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.items = this.baseMenuItems;
      });
    // this.ngOnInit();
    // this.cartCount = 0;
  }
}
