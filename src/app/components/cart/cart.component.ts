import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../cart-item.model';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateCartTotals();
  }

  calculateCartTotals(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
    } else if (newQuantity > item.stockQuantity) {
      alert(`Sorry, only ${item.stockQuantity} items are available in stock.`);
      item.quantity = item.stockQuantity;
    } else {
      item.quantity = newQuantity;
      item.totalPrice = item.quantity * item.price;
      this.cartService.updateCartItem(item);
      this.calculateCartTotals();
    }
  }

  removeItem(item: CartItem): void {
    this.loadCart();
    this.cartService.removeFromCart(item.productId);
  }
}
