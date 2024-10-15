import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  name: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  address: string = '';
  birthday: string = '';
  gender: string = '';
  password: string = '';
  confirmPassword: string = '';

  emailExists: boolean = false;

  constructor(private router: Router) {}

  // Age validation
  validateAge(birthdayField: NgModel): void {
    const today = new Date();
    const birthDate = new Date(birthdayField.value);

    if (!birthdayField.value) {
      // Clear previous errors if no date is entered
      birthdayField.control.setErrors(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Check if birthday is in the past
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Find the birthday input field and cast it to HTMLInputElement
    // const birthdayField = document.getElementById('birthday') as HTMLInputElement;

    if (age < 18) {
      birthdayField.control.setErrors({ invalidAge: true });
    } else {
      birthdayField.control.setErrors(null);
    }
  }

  // Generate a unique ID (UUID)
  generateId(): string {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }  

  onSignUp(): void {
    this.emailExists = false;

    // Basic validation for matching passwords
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the email already exists
    const emailExists = existingUsers.some((user: any) => user.email === this.email);
    if (emailExists) {
      this.emailExists = true;
      console.error('Email already exists!');
      return;
    }

    // Hash the password before saving it
    const hashedPassword = bcrypt.hashSync(this.password, 10); // 10 rounds of salt

    // Create a new user object
    const newUser = {
      id: this.generateId(),
      name: this.name,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      address: this.address,
      birthday: this.birthday,
      gender: this.gender,
      password: hashedPassword,
      role: 'user'
    }

    // Add the new user to the array of existing users
    existingUsers.push(newUser);

    // Store the updated users array back into local storage
    localStorage.setItem('users', JSON.stringify(existingUsers));

    console.log(`User ${this.username} signed up successfully!`);

    console.log(`Signing up with:
      ID: ${newUser.id},
      Name: ${this.name},
      Last Name: ${this.lastName},
      Username: ${this.username},
      Email: ${this.email},
      Address: ${this.address},
      Birthday: ${this.birthday},
      Gender: ${this.gender}`);

      this.router.navigate(['/login']);
      this.clearFields();
  }

  // Clear emailExists error on input change
  onEmailChange(): void {
    this.emailExists = false;
  }

  private clearFields(): void {
    this.name = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.address = '';
    this.birthday = '';
    this.gender = '';
    this.password = '';
    this.confirmPassword = '';
  }
}