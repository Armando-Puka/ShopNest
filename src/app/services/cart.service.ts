import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../cart-item.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService   {
  private cartKey = 'cart';

  

  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartItems());
  cart$ = this.cartSubject.asObservable();

  constructor(private router: Router) { }


  private getCartItems(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartItems(cartItems: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
    this.cartSubject.next(cartItems);
  }

  // Add a product to the cart
  addToCart(product: CartItem): void {
    let cartItems = this.getCartItems();
    const existingItem = cartItems.find(item => item.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += product.quantity;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      cartItems.push(product);
    }

    this.saveCartItems(cartItems);
  }

  // Remove a product from the cart
  removeFromCart(productId: number): void {
    let cartItems = this.getCartItems();
    cartItems = cartItems.filter(item => item.productId !== productId);
    this.saveCartItems(cartItems);
  }

  // Clear the cart
  clearCart(): void {
    this.saveCartItems([]);
  }

  getCartCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  viewCart(): void {
    const isLoggedIn = !!localStorage.getItem('user');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/cart']);
    }
  }
}
