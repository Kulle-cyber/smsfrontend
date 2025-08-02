import { Component, OnInit } from '@angular/core';          // NO 'type' here
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // NO 'type' here
import { UserService } from '../services/user.service';     // NO 'type' here
import type { User, Role } from '../models/user.model';      // 'type' here is OK because used only as interface/type

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  createUserForm: FormGroup;
  editUserForm: FormGroup;
  loading = false;
  rolesLoading = false;
  error = '';
  success = '';
  rolesError = '';
  searchTerm = '';
  showCreateForm = false;
  editingUser: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      fullName: [''],
      email: ['', [Validators.email]],
    });

    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email]],
      password: [''], // Optional for updates
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
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (err) => {
        this.error = `Failed to load users: ${err.message}`;
        console.error(err);
      },
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
      },
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

    this.userService
      .createUser({
        username: formValue.username,
        password: formValue.password,
        roleId: +formValue.roleId,
        fullName: formValue.fullName,
        email: formValue.email,
      })
      .subscribe({
        next: () => {
          this.success = 'User created successfully!';
          this.createUserForm.reset();
          this.loadUsers();
          this.loading = false;
          this.showCreateForm = false;
        },
        error: (err) => {
          console.error('Create user error:', err);
          if (err.status === 409) {
            // Handle conflict errors (username/email already exists)
            let errorMessage = 'Username or email already exists.';
            if (err.error && err.error.error) {
              errorMessage = err.error.error;
            }
            this.error = errorMessage;
          } else {
            this.error = `Failed to create user: ${err.error?.error || err.message || 'Unknown error'}`;
          }
          this.loading = false;
        },
      });
  }

  onRoleChange(user: User, newRoleId: string) {
    const roleIdNum = +newRoleId;
    this.userService.updateUserRole(user.id!, roleIdNum).subscribe({
      next: () => {
        const foundRole = this.roles.find((r) => r.id === roleIdNum);
        if (foundRole) user.role = foundRole;
        this.success = 'Role updated successfully!';
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        this.error = `Failed to update role: ${err.error?.error || err.message}`;
        setTimeout(() => (this.error = ''), 5000);
      },
    });
  }

  onSearch() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    // Use backend search for better performance with large datasets
    this.userService.searchUsers(term).subscribe({
      next: (users) => {
        this.filteredUsers = users;
      },
      error: (err) => {
        // Fallback to client-side search if backend search fails
        console.warn('Backend search failed, using client-side search:', err);
        const termLower = term.toLowerCase();
        this.filteredUsers = this.users.filter(
          (user) =>
            user.username.toLowerCase().includes(termLower) ||
            (user.fullName && user.fullName.toLowerCase().includes(termLower)) ||
            (user.email && user.email.toLowerCase().includes(termLower)) ||
            (user.role && user.role.name.toLowerCase().includes(termLower)),
        );
      },
    });
  }

  toggleCreateUserForm() {
    this.showCreateForm = !this.showCreateForm;
    this.error = '';
    this.success = '';
  }

  onEditUser(user: User) {
    this.editingUser = user;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email || '',
      password: '', // Don't pre-fill password
    });
    this.error = '';
    this.success = '';
  }

  onUpdateUser() {
    if (this.editUserForm.invalid || !this.editingUser) {
      this.markFormGroupTouched(this.editUserForm);
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    const formValue = this.editUserForm.value;

    this.userService
      .updateUser(this.editingUser.id!, {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password || undefined,
      })
      .subscribe({
        next: () => {
          this.success = 'User updated successfully!';
          this.editingUser = null;
          this.editUserForm.reset();
          this.loadUsers();
          this.loading = false;
        },
        error: (err) => {
          console.error('Update user error:', err);
          if (err.status === 409) {
            this.error = err.error?.error || 'Username or email already exists.';
          } else {
            this.error = `Failed to update user: ${err.error?.error || err.message}`;
          }
          this.loading = false;
        },
      });
  }

  cancelEdit() {
    this.editingUser = null;
    this.editUserForm.reset();
    this.error = '';
    this.success = '';
  }

  onDeleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.success = `User "${user.username}" deleted successfully!`;
          this.loadUsers();
          setTimeout(() => (this.success = ''), 3000);
        },
        error: (err) => {
          this.error = `Failed to delete user: ${err.error?.error || err.message}`;
          setTimeout(() => (this.error = ''), 5000);
        },
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
