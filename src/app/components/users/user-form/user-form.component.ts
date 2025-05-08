import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser();
      this.userForm.get('senha')?.clearValidators();
      this.userForm.get('senha')?.updateValueAndValidity();
      this.userForm.get('confirmarSenha')?.clearValidators();
      this.userForm.get('confirmarSenha')?.updateValueAndValidity();
    } else {
      this.isEditMode = false;
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    if (senha !== confirmarSenha) {
      form.get('confirmarSenha')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmarSenha')?.setErrors(null);
    }
    return null;
  }

  loadUser(): void {
    if (this.userId) {
      this.loading = true;
      this.userService.getUser(this.userId).subscribe({
        next: (user) => {
          this.userForm.patchValue({
            nome: user.nome,
            email: user.email
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar usuário';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData = this.userForm.value;
      delete userData.confirmarSenha;

      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/usuarios']);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar usuário';
            this.loading = false;
          }
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.router.navigate(['/usuarios']);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao criar usuário';
            this.loading = false;
          }
        });
      }
    }
  }
}
