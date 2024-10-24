import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { ProductListComponent } from "../product-list/product-list.component";
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProductListComponent, InputTextModule, InputNumberModule, InputTextareaModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  isEditing: boolean = false;
  editingProductId: number | null = null;

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

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router, private adminCategoryService: AdminCategoryService) {}

  productForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    imageUrl: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    stockQuantity: new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.loadProductForEdit(Number(id));
      } else {
        this.isEditing = false;
      }
    });
  }

  loadProductForEdit(productId: number): void {
    const product = this.productService.getProductById(productId);
    if (product) {
      this.productForm.setValue({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        stockQuantity: product.stockQuantity
      })
    }
  }

  loadCategories(): void {
    this.categories = this.adminCategoryService.getCategories();
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        ...this.productForm.value,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.productService.addProduct(newProduct);
      this.productForm.reset();
      this.router.navigate(['/admin/products']);
    }
    
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(controlName => {
        this.productForm.controls[controlName].markAllAsTouched();
        this.productForm.controls[controlName].markAsDirty();
      });

      return;
    }

    if (this.productForm.controls["price"].value <= 0 || this.productForm.controls["stockQuantity"].value <= 0) {
      return;
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.newProduct = { ...product };
    this.productForm.setValue({
      name: this.newProduct.name,
      description: this.newProduct.description,
      price: this.newProduct.price,
      imageUrl: this.newProduct.imageUrl,
      category: this.newProduct.category,
      stockQuantity: this.newProduct.stockQuantity
    });
    this.editingProductId = product.id;
  }

  updateProduct(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(controlName => {
        this.productForm.controls[controlName].markAllAsTouched();
        this.productForm.controls[controlName].markAsDirty();
      });

      return;
    }

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const updatedProduct: Product = {
        id: Number(productId),
        ...this.productForm.value,
        updatedAt: new Date(),
        createdAt: this.productService.getProductById(Number(productId))?.createdAt || new Date()
      };

      this.productService.updateProduct(updatedProduct);
      this.isEditing = false;
      this.productForm.reset();
      this.router.navigate(['/admin/products']);
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000000);
  }
}
