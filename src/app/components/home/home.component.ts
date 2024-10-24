import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../cart-item.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // sidebarVisible: boolean = false;
  products: Product[] = [];

  constructor(private productService: ProductService,private authService: AuthService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  addToCart(product: Product): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('Please login to add items to the cart!');
      this.router.navigate(['/login']);
      return;
    }

    if (product.stockQuantity <= 0) {
      alert('Product is out of stock!');
      return;
    }

    if (product && product.id !== undefined && product.price !== undefined) {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        totalPrice: product.price,
        stockQuantity: product.stockQuantity,
      };

      this.cartService.addToCart(cartItem);
      alert('Product added to cart!');
    } else {
      alert('Product details are not available.')
    }
  }
}
