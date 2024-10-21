import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedQuantity: number = 1;

  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Get the product ID from the URL
    this.product = this.productService.getProductById(id);
  }

  validateQuantity(): void {
    if (this.selectedQuantity < 1) {
      alert('Quantity cannot be empty or less than 1');
      this.selectedQuantity = 1;
    }
  }

  addToCart(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('Please login to add items to cart!');
      return;
    }

    if (!this.product || this.product.stockQuantity === undefined || this.product.stockQuantity <= 0) {
      alert('Product is out of stock!');
      return;
    }

    if (this.selectedQuantity > this.product.stockQuantity) {
      alert(`Only ${this.product.stockQuantity} items are available in stock.`);
      return;
    }

    if (this.product && this.product.id !== undefined && this.product.price !== undefined) {
      const cartItem = {
        productId: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.selectedQuantity,
        totalPrice: this.product.price * this.selectedQuantity,
        stockQuantity: this.product.stockQuantity,
      };

      this.cartService.addToCart(cartItem);
      alert(`Product ${this.product.name} with ${this.selectedQuantity} quantity added to cart!`);
    } else {
      alert('Product details are not available.')
    }
  }
}
