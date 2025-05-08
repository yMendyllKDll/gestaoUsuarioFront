import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const { email, senha } = this.loginForm.value;

      console.log('Iniciando tentativa de login...');

      this.authService.login({ email, senha }).subscribe({
        next: (response) => {
          console.log('Login bem sucedido, redirecionando...');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.errorMessage = error.message || 'Email ou senha inválidos';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
    }
  }
}
