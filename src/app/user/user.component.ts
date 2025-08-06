import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import { User, Role } from "../models/user.model";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  createUserForm: FormGroup;
  editUserForm: FormGroup;
  loading = false;
  rolesLoading = false;
  error = "";
  success = "";
  rolesError = "";
  searchTerm = "";
  showCreateForm = false;
  editingUser: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.createUserForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      roleId: ["", Validators.required],
      fullName: [""],
      email: ["", [Validators.email]]
    });

    this.editUserForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.email]],
      password: [""]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filteredUsers = [...users];
      },
      error: (err: any) => {
        this.error = `Failed to load users: ${err.message}`;
        console.error(err);
      }
    });
  }

  loadRoles(): void {
    this.rolesLoading = true;
    this.rolesError = "";
    this.userService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        this.rolesLoading = false;
      },
      error: (err: any) => {
        this.rolesError = `Failed to load roles: ${err.message}`;
        this.rolesLoading = false;
        console.error(err);
      }
    });
  }

  getAdminUserCount(): number {
    return this.users.filter(u => u.role?.name.toLowerCase() === 'admin').length;
  }

  onCreateUser(): void {
    this.error = "";
    this.success = "";

    if (this.createUserForm.invalid) {
      this.markFormGroupTouched(this.createUserForm);
      this.error = "Please fill all required fields correctly.";
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
        this.success = "User created successfully!";
        this.createUserForm.reset();
        this.loadUsers();
        this.loading = false;
        this.showCreateForm = false;
      },
      error: (err: any) => {
        console.error("Create user error:", err);
        if (err.status === 409) {
          this.error = err.error?.error || "Username or email already exists.";
        } else {
          this.error = `Failed to create user: ${err.error?.error || err.message || "Unknown error"}`;
        }
        this.loading = false;
      }
    });
  }

  onRoleChange(user: User, newRoleId: string): void {
    const roleIdNum = +newRoleId;
    this.userService.updateUserRole(user.id!, roleIdNum).subscribe({
      next: () => {
        const foundRole = this.roles.find(r => r.id === roleIdNum);
        if (foundRole) user.role = foundRole;
        this.success = "Role updated successfully!";
        setTimeout(() => this.success = "", 3000);
      },
      error: (err: any) => {
        this.error = `Failed to update role: ${err.error?.error || err.message}`;
        setTimeout(() => this.error = "", 5000);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      (user.fullName && user.fullName.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.name.toLowerCase().includes(term))
    );
  }

  toggleCreateUserForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.error = "";
    this.success = "";
    if (!this.showCreateForm) {
      this.createUserForm.reset();
    }
  }

  onEditUser(user: User): void {
    this.editingUser = user;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email || "",
      password: ""
    });
    this.error = "";
    this.success = "";
  }

  onUpdateUser(): void {
    if (this.editUserForm.invalid || !this.editingUser) {
      this.markFormGroupTouched(this.editUserForm);
      this.error = "Please fill all required fields correctly.";
      return;
    }

    this.loading = true;
    const formValue = this.editUserForm.value;

    this.userService.updateUser(this.editingUser.id!, {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password || undefined
    }).subscribe({
      next: () => {
        this.success = "User updated successfully!";
        this.editingUser = null;
        this.editUserForm.reset();
        this.loadUsers();
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Update user error:", err);
        if (err.status === 409) {
          this.error = err.error?.error || "Username or email already exists.";
        } else {
          this.error = `Failed to update user: ${err.error?.error || err.message}`;
        }
        this.loading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.editUserForm.reset();
    this.error = "";
    this.success = "";
  }

  onDeleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.success = `User "${user.username}" deleted successfully!`;
          this.loadUsers();
          setTimeout(() => this.success = "", 3000);
        },
        error: (err: any) => {
          this.error = `Failed to delete user: ${err.error?.error || err.message}`;
          setTimeout(() => this.error = "", 5000);
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
