import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../category.model';
import { AdminCategoryService } from '../../services/admin-category.service';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css'
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

  constructor(private categoryService: AdminCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  addCategory(): void {
    if (this.newCategory.name.trim()) {
      this.newCategory.id = this.generateId(); // Generate unique ID
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
    this.editingCategoryId = category.id;
  }

  updateCategory(): void {
    if (this.editingCategoryId && this.newCategory.name.trim()) {
      this.newCategory.updatedAt = new Date();
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
    this.newCategory = {
      id: '',
      name: '',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.isEditing = false;
    this.editingCategoryId = '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
