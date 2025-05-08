import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User, Pageable, PageResponse } from '../../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isAdmin = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.tipoUsuario === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    const pageable: Pageable = {
      page: this.currentPage,
      size: this.pageSize,
      sort: ['nome,asc']
    };

    this.userService.getUsers(pageable).subscribe({
      next: (response: PageResponse<User>) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.errorMessage = error.message || 'Erro ao carregar usuários';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  editUser(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/usuarios/editar', id]);
    }
  }

  deleteUser(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este usuário?')) {
      this.loading = true;
      this.errorMessage = '';

      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.errorMessage = error.message || 'Erro ao excluir usuário';
          this.loading = false;
        }
      });
    }
  }

  canCreateUser(): boolean {
    return this.isAdmin;
  }

  canDeleteUser(): boolean {
    return this.isAdmin;
  }
}
