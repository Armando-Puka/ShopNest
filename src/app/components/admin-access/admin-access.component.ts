import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-access',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-access.component.html',
  styleUrl: './admin-access.component.css'
})
export class AdminAccessComponent {
  username: string = '';
  selectedRole: string = 'user';

  onSetRole(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((user: any) => user.username === this.username || user.email === this.username);

    if (userIndex !== -1) {
      users[userIndex].role = this.selectedRole; // Set the role to the selected value (either 'admin' or 'user')

      // Save the updated user back to local storage
      localStorage.setItem('users', JSON.stringify(users));

      console.log(`User ${users[userIndex].username}'s role updated to ${this.selectedRole}`);
    } else {
      console.error('User not found');
    }
  }
}
