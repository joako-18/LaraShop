import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { InventarioComponent } from './pages/inventario/inventario.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'admin', component: AdministradorComponent},
    { path: 'inventario', component: InventarioComponent}
];
