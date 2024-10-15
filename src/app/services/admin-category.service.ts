import { Injectable } from '@angular/core';
import { Category } from '../category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {
  private localStorageKey = 'categories';

  constructor() { }

  // Get all categories
  getCategories(): Category[] {
    const storedCategories = localStorage.getItem(this.localStorageKey);
    return storedCategories ? JSON.parse(storedCategories) : [];
  }

  // Add a new category
  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category)
    this.saveCategories(categories);
  }

  // Update an existing category
  updateCategory(updateCategory: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === updateCategory.id);

    if (index !== -1) {
      categories[index] = updateCategory;
      this.saveCategories(categories);
    }
  }

  // Delete a category by id
  deleteCategory(id: string): void {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    this.saveCategories(filteredCategories);
  }

  // Save categories to local storage
  private saveCategories(categories: Category[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(categories));
  }
}
