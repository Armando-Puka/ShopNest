import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  editingProduct: Product | null = null;

  productListFrom: FormGroup = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null),
    price: new FormControl(null),
    imageUrl: new FormControl(null),
    category: new FormControl(null),
  });

  constructor(
    private productService: ProductService,
    private adminCategoryService: AdminCategoryService
  ) {}

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
  // editProduct(product: Product): void {
  //   this.editingProduct = { ...product };
  //   this.loadCategories();
  // }

  editProduct(product: Product) {
    const editProduct: any = {};
    ['name', 'description', 'price', 'imageUrl', 'category'].forEach((prop) => {
      //@ts-ignore
      editProduct[prop] = product[prop];
    });
    this.productListFrom.setValue(editProduct);
  }

  // Save the edited product
  saveProduct(): void {
    if (this.productListFrom.invalid) {
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
