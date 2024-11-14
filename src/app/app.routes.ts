import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () => 
      import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => 
      import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/account/account.component').then(m => m.AccountComponent)
      },
      {
        path: 'host',
        loadComponent: () => 
          import('./pages/host/host.component').then(m => m.HostComponent)
      },
      {
        path: 'host/create',
        loadComponent: () => 
          import('./pages/host/create-listing/create-listing.component').then(m => m.CreateListingComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => 
          import('./pages/account/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'billing',
        loadComponent: () => 
          import('./pages/account/billing/billing.component').then(m => m.BillingComponent)
      }
    ]
  }
];