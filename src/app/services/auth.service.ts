import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, DecodedToken, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<string>(`${this.apiUrl}/login`, credentials, {
      responseType: 'text' as 'json'
    }).pipe(
      map(token => {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const user: User = {
          email: decodedToken.sub,
          nome: decodedToken.sub.split('@')[0],
          senha: '',
          token: token,
          tipoUsuario: decodedToken.tipoUsuario as 'ADMIN' | 'USUARIO'
        };
        return user;
      }),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getToken(): string {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.token || '';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro completo:', error);
    console.error('Status do erro:', error.status);
    console.error('Mensagem do erro:', error.message);
    console.error('Erro do servidor:', error.error);

    let errorMessage = 'Ocorreu um erro na requisição';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
      } else if (error.status === 401) {
        errorMessage = 'Email ou senha inválidos';
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado. Verifique suas credenciais.';
      } else {
        errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
