import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { AddressFormComponent } from './components/users/address-form/address-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserAddressListComponent } from './components/users/user-address-list/user-address-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'usuarios', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/novo', component: UserFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'usuarios/editar/:id', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/:userId/endereco/novo', component: AddressFormComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/:userId/endereco/:enderecoId', component: AddressFormComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/:userId/enderecos', component: UserAddressListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
