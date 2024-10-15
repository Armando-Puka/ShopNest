import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Get the product ID from the URL
    this.product = this.productService.getProductById(id);
  }


  addToCart(): void {
    if (this.product && this.product.id !== undefined && this.product.price !== undefined) {
      const cartItem = {
        productId: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: 1,
        totalPrice: this.product.price,
      };

      this.cartService.addToCart(cartItem);
      alert('Product added to cart!');
    } else {
      alert('Product details are not available.')
    }
  }
}
