import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  editingProduct: Product | null = null;

  constructor(private productService: ProductService, private adminCategoryService: AdminCategoryService) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.categories = this.adminCategoryService.getCategories();
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.products = this.productService.getProducts();
  }

  // Start editing the product
  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.loadCategories();
  }

  // Save the edited product
  saveProduct(productForm: any): void {
    if (productForm.invalid) {
      return;
    }

    if (this.editingProduct) {
      this.editingProduct.updatedAt = new Date();
      this.productService.updateProduct(this.editingProduct);
      this.editingProduct = null;
      this.products = this.productService.getProducts();
    }
  }

  // Cancel editing
  cancelEditing(): void {
    this.editingProduct = null;
  }
}
