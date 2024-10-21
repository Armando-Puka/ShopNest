import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../cart-item.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSignal = signal<CartItem[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartItems());
  cart$ = this.cartSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadUserCart();
  }

  getCartSignal() {
    return this.cartSignal;
  }

  loadUserCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.cart) {
      const cartItems = currentUser.cart || [];
      this.cartSubject.next(cartItems);
    } else {
      this.cartSubject.next([]);
    }
  }


  getCartItems(): CartItem[] {
    const currentUser = this.authService.getCurrentUser();
    return currentUser && currentUser.cart ? currentUser.cart : [];
    // const cart = localStorage.getItem(this.cartKey);
    // return cart ? JSON.parse(cart) : [];
  }

  // Add a product to the cart
  addToCart(product: CartItem): void {
    let cartItems = this.getCartItems();
    const existingItem = cartItems.find(item => item.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += product.quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      cartItems.push(product);
    }

    this.saveCartItems(cartItems);
    this.authService.updateCartCount();
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

  updateCartItem(updateItem: CartItem): void {
    let cartItems = this.getCartItems();

    const itemIndex = cartItems.findIndex(item => item.productId === updateItem.productId);

    if (itemIndex !== -1) {
      cartItems[itemIndex] = updateItem;
    }

    this.saveCartItems(cartItems);
    this.authService.updateCartCount();
  }

  private saveCartItems(cartItems: CartItem[]): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      currentUser.cart = cartItems;

      localStorage.setItem('loggedInUser', JSON.stringify(currentUser));

      this.cartSubject.next(cartItems);
    }
    // localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
    // this.cartSubject.next(cartItems);
  }
}
