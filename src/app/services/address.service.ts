import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Address, AddressDTO } from '../models/address.model';
import { Pageable, Sort, PageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = `${environment.apiUrl}/enderecos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAddressesByUserId(userId: number, pageable: Pageable): Observable<PageResponse<Address>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      pageable.sort.forEach(sort => {
        params = params.append('sort', sort);
      });
    }

    return this.http.get<PageResponse<Address>>(`${this.apiUrl}/usuario/${userId}`, {
      headers: this.getHeaders(),
      params
    });
  }

  getAddress(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createAddress(address: AddressDTO): Observable<Address> {
    return this.http.post(this.apiUrl, address, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          return JSON.parse(response) as Address;
        } catch (e) {
          console.error('Erro ao parsear resposta:', e);
          throw new Error('Erro ao processar resposta do servidor');
        }
      })
    );
  }

  updateAddress(id: number, address: AddressDTO): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${id}`, address, { headers: this.getHeaders() });
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
