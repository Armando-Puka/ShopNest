import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule,TableModule ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  
  constructor(private productService: ProductService, private router: Router, private adminCategoryService: AdminCategoryService) {}

  productListForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    imageUrl: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    stockQuantity: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
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

  editProduct(product: Product): void {
    this.router.navigate(['/admin/products', product.id]);
  }
}
