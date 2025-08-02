import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, Role } from '../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  createUserForm: FormGroup;
  loading = false;
  rolesLoading = false;
  error = '';
  success = '';
  rolesError = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      fullName: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        this.error = `Failed to load users: ${err.message}`;
        console.error(err);
      }
    });
  }

  loadRoles() {
    this.rolesLoading = true;
    this.rolesError = '';

    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.rolesLoading = false;
      },
      error: (err) => {
        this.rolesError = `Failed to load roles: ${err.message}`;
        this.rolesLoading = false;
        console.error(err);
      }
    });
  }

  onCreateUser() {
    this.error = '';
    this.success = '';

    if (this.createUserForm.invalid) {
      this.markFormGroupTouched(this.createUserForm);
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    const formValue = this.createUserForm.value;

    this.userService.createUser({
      username: formValue.username,
      password: formValue.password,
      roleId: +formValue.roleId,
      fullName: formValue.fullName,
      email: formValue.email
    }).subscribe({
      next: () => {
        this.success = 'User created successfully!';
        this.createUserForm.reset();
        this.loadUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to create user: ${err.message}`;
        this.loading = false;
      }
    });
  }

  onRoleChange(user: User, newRoleId: string) {
    const roleIdNum = +newRoleId;
    this.userService.updateUserRole(user.id!, roleIdNum).subscribe({
      next: () => {
        const foundRole = this.roles.find(r => r.id === roleIdNum);
        if (foundRole) user.role = foundRole;
      },
      error: (err) => {
        this.error = `Failed to update role: ${err.message}`;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
