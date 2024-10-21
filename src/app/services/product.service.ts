import { Injectable, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { BehaviorSubject } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService   {
  private productsKey = 'products';

  // Observable to track the list of products
  private productsSubject = new BehaviorSubject<Product[]>(this.getProducts());
  products$ = this.productsSubject.asObservable();

  constructor() {}

  

  // Get all products from localStorage
  getProducts(): Product[] {
    const products = localStorage.getItem(this.productsKey);
    return products ? JSON.parse(products) : [];
  }

  // Get a product by its ID
  getProductById(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find((product) => product.id === id);
  }

  // Add a new product
  addProduct(newProduct: Product): void {
    const products = this.getProducts();
    products.push(newProduct);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  // Update an existing product
  updateProduct(updateProduct: Product): void {
    let products = this.getProducts();
    products = products.map((product) => product.id === updateProduct.id ? updateProduct : product);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  // Delete a product by its ID
  deleteProduct(id: number): void {
    const products = this.getProducts();
    const updatedProducts = products.filter((product) => product.id !== id);
    localStorage.setItem(this.productsKey, JSON.stringify(updatedProducts));
    this.productsSubject.next(updatedProducts);
  }
}
