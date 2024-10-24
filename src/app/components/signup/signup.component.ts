import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, CalendarModule, DropdownModule, PasswordModule, InputTextModule, FloatLabelModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './signup.component.scss']
})
export class SignupComponent implements OnInit {
  emailExists: boolean = false;
  usernameExists: boolean = false;
  genderOptions?: { label: string; value: string; }[];

  constructor(private router: Router) {}

  signupForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^([A-Z])+[a-zA-Z\s]+$/)]),
    lastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^([A-Z])+[a-zA-Z\s]+$/)]),
    username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]),
    email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(70)]),
    address: new FormControl(null, Validators.required),
    birthday: new FormControl<Date | null>(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
    confirmPassword: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.genderOptions = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ];
  }

  // Age validation
  validateAge(): void {
    const today = new Date();
    const birthDate = new Date(this.signupForm.controls['birthday'].value);

    if (!this.signupForm.controls['birthday'].value) {
      // Clear previous errors if no date is entered
      this.signupForm.controls['birthday'].setErrors(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Check if birthday is in the past
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      this.signupForm.controls['birthday'].setErrors({ invalidAge: true });
    } else {
      this.signupForm.controls['birthday'].setErrors(null);
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

    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(controlName => {
        this.signupForm.controls[controlName].markAllAsTouched();
        this.signupForm.controls[controlName].markAsDirty();
      });

      return;
    }

    // Basic validation for matching passwords
    if (this.signupForm.controls['password'].value !== this.signupForm.controls['confirmPassword'].value) {
      console.error('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the email already exists
    const emailExists = existingUsers.some((user: any) => user.email === this.signupForm.controls['email'].value);
    if (emailExists) {
      this.emailExists = true;
      console.error('Email already exists!');
      return;
    }

    const usernameExists = existingUsers.some((user: any) => user.username === this.signupForm.controls['username'].value);
    if (usernameExists) {
      this.usernameExists = true;
      console.error('Username already exists!');
      return;
    }

    // Hash the password before saving it
    const hashedPassword = bcrypt.hashSync(this.signupForm.controls['password'].value, 10); // 10 rounds of salt

    // Create a new user object
    const newUser = {
      id: this.generateId(),
      name: this.signupForm.controls['name'].value,
      lastName: this.signupForm.controls['lastName'].value,
      username: this.signupForm.controls['username'].value,
      email: this.signupForm.controls['email'].value,
      address: this.signupForm.controls['address'].value,
      birthday: this.signupForm.controls['birthday'].value,
      gender: this.signupForm.controls['gender'].value,
      password: hashedPassword,
      role: 'user',
      cart: []
    }

    // Add the new user to the array of existing users
    existingUsers.push(newUser);

    // Store the updated users array back into local storage
    localStorage.setItem('users', JSON.stringify(existingUsers));

    console.log(`User ${this.signupForm.controls['username'].value} signed up successfully!`);

    console.log(`Signing up with:
      ID: ${newUser.id},
      Name: ${this.signupForm.controls['name'].value},
      Last Name: ${this.signupForm.controls['lastName'].value},
      Username: ${this.signupForm.controls['username'].value},
      Email: ${this.signupForm.controls['email'].value},
      Address: ${this.signupForm.controls['address'].value},
      Birthday: ${this.signupForm.controls['birthday'].value},
      Gender: ${this.signupForm.controls['gender'].value}`);

      this.router.navigate(['/login']);
      this.signupForm.reset();
  }

  // Clear emailExists error on input change
  onEmailChange(): void {
    this.emailExists = false;
  }

  // Clear usernameExists error on input change
  onUsernameChange(): void {
    this.usernameExists = false;
  }
}