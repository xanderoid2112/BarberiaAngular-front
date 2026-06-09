import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { DashboardCliente } from './pages/dashboard-cliente/dashboard-cliente';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { Barberias } from './pages/barberias/barberias';
import { Equipo } from './pages/equipo/equipo';
import { Productos } from './pages/productos/productos';
import { Confirmacion } from './pages/confirmacion/confirmacion';
import { GestionCitas } from './pages/dashboard-barbero/gestion-citas/gestion-citas';
import { MisCitas } from './pages/mis-citas/mis-citas';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'dashboard-cliente', component: DashboardCliente },
  { path: 'dashboard-admin', component: DashboardAdmin },
 { path: 'barberias', component: Barberias },
 { path: 'equipo', component: Equipo },
 { path: 'confirmacion', component: Confirmacion },
 { path: 'productos', component: Productos },
 { path: 'mis-citas', component: MisCitas },
 { path: 'gestion-citas', component: GestionCitas },
  { path: '**', redirectTo: 'home' }
];