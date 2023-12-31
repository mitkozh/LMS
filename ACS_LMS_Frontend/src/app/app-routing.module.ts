import { AppAuthGuard } from './auth/app-auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { BookLibraryComponent } from './components/pages/books/book-library/book-library.component';
import { BookCategoriesComponent } from './components/pages/books/book-categories/book-categories.component';
import { LoginComponent } from './components/pages/login/login.component';
import { LoginModalComponent } from './components/partials/modal/login/login-modal/login-modal.component';
import { CategoryDetailsComponent } from './components/pages/books/category-details/category-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BookFullComponent } from './components/pages/book-full/book-full.component';
import { AdvancedSearchComponent } from './components/pages/advanced-search/advanced-search.component';
import { TranscationsComponent } from './components/pages/transcations/transcations.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AppAuthGuard],
  },
  { path: 'books', component: BookLibraryComponent },
  { path: 'books/categories', component: BookCategoriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', redirectTo: 'login', pathMatch: 'full' },
  { path: 'categories/:category', component: CategoryDetailsComponent },
  { path: 'books/:title', component: BookFullComponent },
  { path: 'books/:title/:edition', component: BookFullComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent },
  { path: 'transactions', component: TranscationsComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
