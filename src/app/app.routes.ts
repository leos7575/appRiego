import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',  // Redirige a la página de login al iniciar
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'principal',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },


];
