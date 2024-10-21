import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProductListComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  isEditing: boolean = false;
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

  productForm: FormGroup = new FormGroup({
  name: new FormControl(null, Validators.required),
  description: new FormControl(null, Validators.required),
  price: new FormControl(null, Validators.required),
  imageUrl: new FormControl(null, Validators.required),
  category: new FormControl(null, Validators.required),
  stockQuantity: new FormControl(null, Validators.required),

})

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories from localStorage
  loadCategories(): void {
    this.categories = this.adminCategoryService.getCategories();
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(controlName => {
        this.productForm.controls[controlName].markAllAsTouched()
        this.productForm.controls[controlName].markAsDirty()
      })
      console.log('hey')

      return;
    }
    if (this.productForm.controls["price"].value <= 0 || this.productForm.controls["stockQuantity"].value <= 0) {
      return;
    }

    if (this.productForm.controls['name'].value.trim()) {
      // Create a unique ID for the product
      // const getProducts = this.productService.getProducts();
      // this.newProduct.id = getProducts.length > 0 ? getProducts[getProducts.length - 1].id + 1 : 1;
      

      this.newProduct.name = this.productForm.controls["name"].value;
      this.newProduct.description = this.productForm.controls["description"].value;
      this.newProduct.imageUrl = this.productForm.controls["imageUrl"].value;
      this.newProduct.stockQuantity = this.productForm.controls["stockQuantity"].value;
      this.newProduct.category = this.productForm.controls["category"].value;
      this.newProduct.price = this.productForm.controls["price"].value;
      this.newProduct.id = this.generateId();
      this.newProduct.createdAt = new Date();
      this.newProduct.updatedAt = new Date();

      // Call the service to add the product:
      this.productService.addProduct(this.newProduct);
      // Reset the form
      this.productForm.reset();
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
