import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../../services/address.service';
import { AddressDTO } from '../../../models/address.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  addressForm: FormGroup;
  loading = false;
  errorMessage = '';
  userId!: number;
  addressId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.addressForm = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(2)]]
    });
  }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (!userIdParam) {
      this.errorMessage = 'ID do usuário não fornecido';
      return;
    }
    this.userId = Number(userIdParam);

    const addressIdParam = this.route.snapshot.paramMap.get('enderecoId');
    if (addressIdParam) {
      this.addressId = Number(addressIdParam);
      this.loadAddress();
    }
  }

  loadAddress(): void {
    if (this.addressId) {
      this.loading = true;
      this.addressService.getAddress(this.addressId).subscribe({
        next: (address) => {
          this.addressForm.patchValue({
            cep: address.cep,
            logradouro: address.logradouro,
            numero: address.numero,
            complemento: address.complemento,
            bairro: address.bairro,
            cidade: address.cidade,
            estado: address.estado
          });
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erro ao carregar endereço';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const address: AddressDTO = {
        ...this.addressForm.value,
        usuarioId: this.userId
      };
      if (this.addressId) {
        this.addressService.updateAddress(this.addressId, address).subscribe({
          next: () => {
            this.router.navigate(['/usuarios', this.userId, 'enderecos']);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || error.message || 'Erro ao atualizar endereço';
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.addressService.createAddress(address).subscribe({
          next: () => {
            this.router.navigate(['/usuarios', this.userId, 'enderecos']);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || error.message || 'Erro ao cadastrar endereço';
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
    }
  }

  buscarCep(): void {
    const cep = this.addressForm.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.loading = true;
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            this.addressForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            });
          } else {
            this.errorMessage = 'CEP não encontrado';
          }
        })
        .catch(() => {
          this.errorMessage = 'Erro ao buscar CEP';
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  get isEditMode(): boolean {
    return !!this.addressId;
  }
}
