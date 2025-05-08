import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../../services/address.service';
import { Address } from '../../../models/address.model';

@Component({
  selector: 'app-user-address-list',
  templateUrl: './user-address-list.component.html',
  styleUrls: ['./user-address-list.component.scss']
})
export class UserAddressListComponent implements OnInit {
  addresses: Address[] = [];
  userId!: number;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.loading = true;
    const pageable = { page: 0, size: 20, sort: ['logradouro,asc'] };
    this.addressService.getAddressesByUserId(this.userId, pageable).subscribe({
      next: (response) => {
        this.addresses = response.content;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar endereços';
        this.loading = false;
      }
    });
  }

  goToNewAddress(): void {
    this.router.navigate(['/usuarios', this.userId, 'endereco', 'novo']);
  }

  editAddress(addressId: number | undefined): void {
    if (addressId) {
      this.router.navigate(['/usuarios', this.userId, 'endereco', addressId]);
    }
  }

  deleteAddress(addressId: number | undefined): void {
    if (addressId && confirm('Tem certeza que deseja excluir este endereço?')) {
      this.loading = true;
      this.addressService.deleteAddress(addressId).subscribe({
        next: () => {
          this.loadAddresses();
        },
        error: () => {
          this.errorMessage = 'Erro ao excluir endereço';
          this.loading = false;
        }
      });
    }
  }
}
