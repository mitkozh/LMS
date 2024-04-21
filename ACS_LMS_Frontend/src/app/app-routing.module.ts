import { AppAuthGuard } from './auth/app-auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { BookLibraryComponent } from './components/pages/books/book-library/book-library.component';
import { BookCategoriesComponent } from './components/pages/books/book-categories/book-categories.component';
import { CategoryDetailsComponent } from './components/pages/books/category-details/category-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BookFullComponent } from './components/pages/book-full/book-full.component';
import { AdvancedSearchComponent } from './components/pages/advanced-search/advanced-search.component';
import { TranscationsComponent } from './components/pages/transcations/transcations.component';
import { AuthorFullComponent } from './components/pages/author-full/author-full.component';
import { ReservationsComponent } from './components/pages/reservations/reservations.component';
import { HasRolesDirective } from './directive/HasRoleDirective';
import { UserRole } from './shared/user-role';

const routes: Routes = [
  { path: 'books', component: BookLibraryComponent },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AppAuthGuard],
  },
  { path: 'books/categories', component: BookCategoriesComponent },
  { path: 'sign-in', redirectTo: 'login', pathMatch: 'full' },
  { path: 'categories/:category', component: CategoryDetailsComponent },
  { path: 'books/:title/:id', component: BookFullComponent },
  { path: 'books/:title/:id/:edition', component: BookFullComponent },
  { path: 'author/:author', component: AuthorFullComponent },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [AppAuthGuard],
    data: { roles: [UserRole.ROLE_ADMIN, UserRole.ROLE_LIBRARIAN] },
  },
  {
    path: 'advanced-search',
    component: AdvancedSearchComponent,
    canActivate: [AppAuthGuard],
  },
  {
    path: 'transactions',
    component: TranscationsComponent,
    canActivate: [AppAuthGuard],
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
