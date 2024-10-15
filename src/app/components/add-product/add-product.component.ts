import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductListComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stockQuantity: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  categories: Category[] = [];

  constructor(private productService: ProductService, private adminCategoryService: AdminCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories from localStorage
  loadCategories(): void {
    this.categories = this.adminCategoryService.getCategories();
  }

  addProduct(productForm: any): void {
    if (productForm.invalid) {
      return;
    }

    if (this.newProduct.price <= 0 || this.newProduct.stockQuantity <= 0) {
      return;
    }

    if (this.newProduct.name.trim()) {
      // Create a unique ID for the product
      // const getProducts = this.productService.getProducts();
      // this.newProduct.id = getProducts.length > 0 ? getProducts[getProducts.length - 1].id + 1 : 1;

      this.newProduct.id = this.generateId();
      this.newProduct.createdAt = new Date();
      this.newProduct.updatedAt = new Date();

      // Call the service to add the product:
      this.productService.addProduct(this.newProduct);

      // Reset the form
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stockQuantity: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000000);
  }
}
