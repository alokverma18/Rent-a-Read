import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './reader/home/home.component';
import { OwnerHomeComponent } from './owner/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BookComponent } from './reader/book/book.component';
import { BooksComponent } from './owner/books/books.component';
import { RentalsComponent } from './owner/rentals/rentals.component';
import { ReaderRentalsComponent } from './reader/rentals/rentals.component';


export const routes: Routes = [
  {
    path: 'reader',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { role: 'reader' }, 
  },
  {
    path: 'owner',
    component: OwnerHomeComponent,
    canActivate: [AuthGuard],
    data: { role: 'owner' }, 
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent, 
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  { path: 'book/:id', 
    component: BookComponent 
  }, 

  {
    path: 'owner/books',
    component: BooksComponent,
    data: { role: 'owner' },
  },

  {
    path: 'owner/rentals',
    component: RentalsComponent,
    data: { role: 'owner' },
  },

  {
    path: 'reader/rentals',
    component: ReaderRentalsComponent,
    data: { role: 'reader' },
  }
];


