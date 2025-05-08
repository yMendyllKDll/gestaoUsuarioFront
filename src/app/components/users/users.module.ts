import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { UserAddressListComponent } from './user-address-list/user-address-list.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    AddressFormComponent,
    UserAddressListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    UserListComponent,
    UserFormComponent,
    AddressFormComponent
  ]
})
export class UsersModule { }
