import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, InputTextareaModule],
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css', './admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = {
    id: '',
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  isEditing: boolean = false;
  editingCategoryId: string = '';

  categoriesForm: FormGroup = new FormGroup({
    categoryName: new FormControl(null, Validators.required),
    categoryDescription: new FormControl(null, Validators.required)
  });

  constructor(private categoryService: AdminCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  categoryExistence(): boolean {
    const existingCategories = this.categoryService.getCategories();
    const categoryExists = existingCategories.some((category: any) => category.name === this.categoriesForm.controls['categoryName'].value);
    return categoryExists;
  }

  addCategory(): void {
    if (this.categoryExistence()) {
      alert(`Category with name: ${this.categoriesForm.controls['categoryName'].value} already exists!`);
      return;
    }
    
    if (this.categoriesForm.controls['categoryName'].value.trim()) {
      this.newCategory.id = this.generateId(); // Generate unique ID
      this.newCategory.name = this.categoriesForm.controls['categoryName'].value;
      this.newCategory.description = this.categoriesForm.controls['categoryDescription'].value;
      this.newCategory.createdAt = new Date();
      this.newCategory.updatedAt = new Date();

      this.categoryService.addCategory(this.newCategory);
      this.resetForm();
      this.loadCategories();
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.newCategory = { ...category };
    this.categoriesForm.setValue({
      categoryName: this.newCategory.name,
      categoryDescription: this.newCategory.description
    });
    this.editingCategoryId = category.id;
  }

  updateCategory(): void {
    if ( this.editingCategoryId && this.categoriesForm.controls['categoryName'].value.trim()) {
      if (this.categoryExistence() && (this.categoriesForm.controls['categoryName'].value !== this.newCategory.name)) {
        alert(`Category with name: ${this.categoriesForm.controls['categoryName'].value} already exists!`);
        return;
      }
      this.newCategory.updatedAt = new Date();
      this.newCategory.name = this.categoriesForm.controls['categoryName'].value;
      this.newCategory.description = this.categoriesForm.controls['categoryDescription'].value;
      this.categoryService.updateCategory(this.newCategory);
      this.resetForm();
      this.loadCategories();
    }
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id);
    this.loadCategories();
  }

  resetForm(): void {
    this.categoriesForm.reset();
    this.isEditing = false;
    this.editingCategoryId = '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
